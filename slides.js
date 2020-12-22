import {CMap2} from './CMapJS/CMap/CMap.js';
import Slide from './Slide.js';
import Renderer from './CMapJS/Renderer.js';
import * as THREE from './CMapJS/three.module.js';
import {OrbitControls} from './CMapJS/OrbitsControls.js';
import {load_cmap2} from './CMapJS/IO/Surface_Formats/CMap2_IO.js' 
import {load_cmap3} from './CMapJS/IO/Volumes_Formats/CMap3_IO.js' 
import {tetrahedron_off, icosahedron_off, cube_off, octahedron_off, cactus_off, fertility_off, metatron_off} from './off_files.js';
import {catmull_clark} from './CMapJS/Modeling/Subdivision/Surface/Catmull_Clark.js';
import {fertility, metatron, santa, dinopet, test0_mesh} from './mesh_files.js';
import {doo_sabin} from './CMapJS/Modeling/Subdivision/Surface/Doo_Sabin.js';
import { sqrt3 } from './CMapJS/Modeling/Subdivision/Surface/Sqrt3.js';
import { sqrt2 } from './CMapJS/Modeling/Subdivision/Surface/Sqrt2.js';
import { loop } from './CMapJS/Modeling/Subdivision/Surface/Loop.js';
import { butterfly } from './CMapJS/Modeling/Subdivision/Surface/Butterfly.js';
import { compute_face_normals } from './CMapJS/Modeling/Geometry/normal.js';
import {load_mesh} from './CMapJS/IO/Volumes_Formats/Mesh.js';
import {map_from_geometry } from './CMapJS/IO/Volumes_Formats/CMap3_IO.js';

let background = new THREE.Color(0xfdf6e3);
let mesh_face_color = new THREE.Color(0x555555);
let mesh_edge_color = new THREE.Color(0x333333);

let mesh_face_material = new THREE.MeshLambertMaterial({
	color: mesh_face_color,
	side: THREE.FrontSide,
	transparent: true,
	opacity: 0.5
});

let mesh_edge_material = new THREE.LineBasicMaterial({
	color: mesh_edge_color,
	linewidth: 2,
	polygonOffset: true,
	polygonOffsetFactor: -0.5
});

export let cc_slide = new Slide(
	function(domElement, width, height){
		this.clock = new THREE.Clock(true);
		this.time = 0;

		this.scene = new THREE.Scene();
		this.scene.background = background;
		this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.8));
		let pointLight0 = new THREE.PointLight(0xFFFFFF, 0.8);
		pointLight0.position.set(10,8,5);
		this.scene.add(pointLight0);
		
		this.renderer = new THREE.WebGLRenderer();	
		this.renderer.setSize( width *0.5, height *0.5);
		domElement.appendChild( this.renderer.domElement );

		// this.renderer2 = new THREE.WebGLRenderer();	
		// this.renderer2.setSize( width *0.5, height *0.5);
		// domElement.appendChild( this.renderer2.domElement );

		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000.0);
		this.camera.position.set(0, 0, 2);

		let orbit_controls = new OrbitControls(this.camera, this.renderer.domElement)
		orbit_controls.enablePan = false;
		orbit_controls.update();

		
		this.cmap2 = load_cmap2('off', cube_off);
		this.map_renderer = new Renderer(this.cmap2);
		this.map_renderer.edges.create({material: mesh_edge_material}).add(this.scene);
		this.map_renderer.faces.create({material: mesh_face_material}).add(this.scene);

		this.running = false;
		const axis = new THREE.Vector3(1, 1, 0.5).normalize();
		let next_step = 3;
		this.loop = function(){
			if(this.running){
				this.time += this.clock.getDelta();
				if(this.time > next_step){
					next_step += 3;
					catmull_clark(this.cmap2);
					this.map_renderer.edges.update();
					this.map_renderer.faces.update();
				}
				if(this.time > 15){
					this.time = 0;
					this.map_renderer.edges.delete();
					this.map_renderer.faces.delete();
					next_step = 3;					
					this.cmap2 = load_cmap2('off', cube_off);
					this.map_renderer = new Renderer(this.cmap2);
					this.map_renderer.edges.create({material: mesh_edge_material}).add(this.scene);
					this.map_renderer.faces.create({material: mesh_face_material}).add(this.scene);
					this.clock.start();

				}
				this.map_renderer.edges.mesh.setRotationFromAxisAngle(axis, Math.PI / 7.5 * this.time)
				this.map_renderer.faces.mesh.setRotationFromAxisAngle(axis, Math.PI / 7.5 * this.time)
				
				this.renderer.render(this.scene, this.camera);
				// this.renderer2.render(this.scene, this.camera);
				requestAnimationFrame(this.loop.bind(this));
			}
		}

		this.open = function(){
			this.running = true;
			this.clock.start();
			console.log("clock", this.clock, this.clock, this.clock.getElapsedTime());
			this.loop();
		}
	
		this.close = function(){
			console.log("test")
			this.clock.stop();
			this.running = false;
		}
	}
);

export let ds_slide = new Slide(
	function(domElement, width, height){
		this.clock = new THREE.Clock(true);
		this.time = 0;

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(background);
		this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.8));
		let pointLight0 = new THREE.PointLight(0xFFFFFF, 0.8);
		pointLight0.position.set(10,8,5);
		this.scene.add(pointLight0);
		
		this.renderer = new THREE.WebGLRenderer();	
		this.renderer.setSize( width *0.8, height *0.8);
		domElement.appendChild( this.renderer.domElement );

		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000.0);
		this.camera.position.set(0, 0, 2);

		let orbit_controls = new OrbitControls(this.camera, this.renderer.domElement)
		orbit_controls.enablePan = false;
		orbit_controls.update();

		
		this.cmap2 = load_cmap2('off', cube_off);
		this.map_renderer = new Renderer(this.cmap2);
		this.map_renderer.edges.create({material: mesh_edge_material}).add(this.scene);
		this.map_renderer.faces.create({material: mesh_face_material}).add(this.scene);
		this.running = false;
		const axis = new THREE.Vector3(1, 1, 0.5).normalize();
		let next_step = 3;
		this.loop = function(){
			if(this.running){
				this.time += this.clock.getDelta();
				if(this.time > next_step){
					next_step += 3;
					doo_sabin(this.cmap2);
					this.map_renderer.edges.update();
					this.map_renderer.faces.update();
				}
				if(this.time > 15){
					this.map_renderer.edges.delete();
					this.map_renderer.faces.delete();
					this.time = 0;
					next_step = 3;					
					this.cmap2 = load_cmap2('off', cube_off);
					this.map_renderer = new Renderer(this.cmap2);
					this.map_renderer.edges.create({material: mesh_edge_material}).add(this.scene);
					this.map_renderer.faces.create({material: mesh_face_material}).add(this.scene);
					this.clock.start();

				}
				this.map_renderer.edges.mesh.setRotationFromAxisAngle(axis, Math.PI / 7.5 * this.time)
				this.map_renderer.faces.mesh.setRotationFromAxisAngle(axis, Math.PI / 7.5 * this.time)
				
				this.renderer.render(this.scene, this.camera);
				requestAnimationFrame(this.loop.bind(this));
			}
		}

		this.open = function(){
			this.running = true;
			this.clock.start();
			console.log("clock", this.clock, this.clock.getElapsedTime());
			this.loop();
		}
	
		this.close = function(){
			this.clock.stop();
			this.running = false;
		}
	}
);

export let sqrt2_slide = new Slide(
	function(domElement, width, height){
		this.clock = new THREE.Clock(true);
		this.time = 0;

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(background);
		this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.8));
		let pointLight0 = new THREE.PointLight(0xFFFFFF, 0.8);
		pointLight0.position.set(10,8,5);
		this.scene.add(pointLight0);
		
		this.renderer = new THREE.WebGLRenderer();	
		this.renderer.setSize( width *0.8, height *0.8);
		domElement.appendChild( this.renderer.domElement );

		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000.0);
		this.camera.position.set(0, 0, 2);

		let orbit_controls = new OrbitControls(this.camera, this.renderer.domElement)
		orbit_controls.enablePan = false;
		orbit_controls.update();

		
		this.cmap2 = load_cmap2('off', cube_off);
		this.map_renderer = new Renderer(this.cmap2);
		this.map_renderer.edges.create({material: mesh_edge_material}).add(this.scene);
		this.cmap2.set_embeddings(this.cmap2.face);
		let face_normals = this.cmap2.add_attribute(this.cmap2.face, "face_normals");
		let position = this.cmap2.get_attribute(this.cmap2.vertex, "position");
		compute_face_normals(this.cmap2, position, face_normals);
		console.log(face_normals);
		this.map_renderer.faces.create({normals: face_normals, material: mesh_face_material}).add(this.scene);

		this.running = false;
		const axis = new THREE.Vector3(1, 1, 0.5).normalize();
		let next_step = 3;
		this.loop = function(){
			if(this.running){
				this.time += this.clock.getDelta();
				if(this.time > next_step){
					next_step += 3;
					sqrt2(this.cmap2);
					compute_face_normals(this.cmap2, position, face_normals);
					this.map_renderer.edges.update();
					this.map_renderer.faces.update();
				}
				if(this.time > 15){
					this.map_renderer.edges.delete();
					this.map_renderer.faces.delete();
					this.time = 0;
					next_step = 3;					
					this.cmap2 = load_cmap2('off', cube_off);
					this.cmap2.set_embeddings(this.cmap2.face);
					face_normals = this.cmap2.add_attribute(this.cmap2.face, "face_normals");
					position = this.cmap2.get_attribute(this.cmap2.vertex, "position");
					compute_face_normals(this.cmap2, position, face_normals);
		
					this.map_renderer = new Renderer(this.cmap2);
					this.map_renderer.edges.create({material: mesh_edge_material}).add(this.scene);
					this.map_renderer.faces.create_buffered({normals: face_normals, material: mesh_face_material}).add(this.scene);
					this.clock.start();

				}
				this.map_renderer.edges.mesh.setRotationFromAxisAngle(axis, Math.PI / 7.5 * this.time)
				this.map_renderer.faces.mesh.setRotationFromAxisAngle(axis, Math.PI / 7.5 * this.time)
				
				this.renderer.render(this.scene, this.camera);
				requestAnimationFrame(this.loop.bind(this));
			}
		}

		this.open = function(){
			this.running = true;
			this.clock.start();
			this.loop();
		}
	
		this.close = function(){
			this.clock.stop();
			this.running = false;
		}
	}
);

export let sqrt3_slide = new Slide(
	function(domElement, width, height){
		this.clock = new THREE.Clock(true);
		this.time = 0;

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(background);
		this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.8));
		let pointLight0 = new THREE.PointLight(0xFFFFFF, 0.8);
		pointLight0.position.set(10,8,5);
		this.scene.add(pointLight0);
		
		this.renderer = new THREE.WebGLRenderer();	
		this.renderer.setSize( width *0.8, height *0.8);
		domElement.appendChild( this.renderer.domElement );

		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000.0);
		this.camera.position.set(0, 0, 2);

		let orbit_controls = new OrbitControls(this.camera, this.renderer.domElement)
		orbit_controls.enablePan = false;
		orbit_controls.update();

		
		this.cmap2 = load_cmap2('off', octahedron_off);
		this.map_renderer = new Renderer(this.cmap2);
		this.map_renderer.edges.create({material: mesh_edge_material}).add(this.scene);
		this.map_renderer.faces.create({material: mesh_face_material}).add(this.scene);

		this.running = false;
		const axis = new THREE.Vector3(1, 1, 0.5).normalize();
		let next_step = 3;
		this.loop = function(){
			if(this.running){
				this.time += this.clock.getDelta();
				if(this.time > next_step){
					next_step += 3;
					sqrt3(this.cmap2);
					this.map_renderer.edges.update();
					this.map_renderer.faces.update();
				}
				if(this.time > 15){
					this.map_renderer.edges.delete();
					this.map_renderer.faces.delete();
					this.time = 0;
					next_step = 3;					
					this.cmap2 = load_cmap2('off', octahedron_off);
					this.map_renderer = new Renderer(this.cmap2);
					this.map_renderer.edges.create({material: mesh_edge_material}).add(this.scene);
					this.map_renderer.faces.create({material: mesh_face_material}).add(this.scene);
					this.clock.start();

				}
				this.map_renderer.edges.mesh.setRotationFromAxisAngle(axis, Math.PI / 7.5 * this.time)
				this.map_renderer.faces.mesh.setRotationFromAxisAngle(axis, Math.PI / 7.5 * this.time)
				
				this.renderer.render(this.scene, this.camera);
				requestAnimationFrame(this.loop.bind(this));
			}
		}

		this.open = function(){
			this.running = true;
			this.clock.start();
			this.loop();
		}
	
		this.close = function(){
			this.clock.stop();
			this.running = false;
		}
	}
);

export let loop_slide = new Slide(
	function(domElement, width, height){
		this.clock = new THREE.Clock(true);
		this.time = 0;

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(background);
		this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.8));
		let pointLight0 = new THREE.PointLight(0xFFFFFF, 0.8);
		pointLight0.position.set(10,8,5);
		this.scene.add(pointLight0);
		
		this.renderer = new THREE.WebGLRenderer();	
		this.renderer.setSize( width *0.8, height *0.8);
		domElement.appendChild( this.renderer.domElement );

		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000.0);
		this.camera.position.set(0, 0, 2);

		let orbit_controls = new OrbitControls(this.camera, this.renderer.domElement)
		orbit_controls.enablePan = false;
		orbit_controls.update();

		
		this.cmap2 = load_cmap2('off', octahedron_off);
		this.map_renderer = new Renderer(this.cmap2);
		this.map_renderer.edges.create({material: mesh_edge_material}).add(this.scene);
		this.map_renderer.faces.create({material: mesh_face_material}).add(this.scene);

		this.running = false;
		const axis = new THREE.Vector3(1, 1, 0.5).normalize();
		let next_step = 3;
		this.loop = function(){
			if(this.running){
				this.time += this.clock.getDelta();
				if(this.time > next_step){
					next_step += 3;
					loop(this.cmap2);
					this.map_renderer.edges.update();
					this.map_renderer.faces.update();
				}
				if(this.time > 15){
					this.map_renderer.edges.delete();
					this.map_renderer.faces.delete();
					this.time = 0;
					next_step = 3;					
					this.cmap2 = load_cmap2('off', octahedron_off);
					this.map_renderer = new Renderer(this.cmap2);
					this.map_renderer.edges.create({material: mesh_edge_material}).add(this.scene);
					this.map_renderer.faces.create({material: mesh_face_material}).add(this.scene);
					this.clock.start();

				}
				this.map_renderer.edges.mesh.setRotationFromAxisAngle(axis, Math.PI / 7.5 * this.time)
				this.map_renderer.faces.mesh.setRotationFromAxisAngle(axis, Math.PI / 7.5 * this.time)

				this.renderer.render(this.scene, this.camera);
				requestAnimationFrame(this.loop.bind(this));
			}
		}

		this.open = function(){
			this.running = true;
			this.clock.start();
			this.loop();
		}
	
		this.close = function(){
			this.clock.stop();
			this.running = false;
		}
	}
);

export let butterfly_slide = new Slide(
	function(domElement, width, height){
		this.clock = new THREE.Clock(true);
		this.time = 0;
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(background);
		this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.8));
		let pointLight0 = new THREE.PointLight(0xFFFFFF, 0.8);
		pointLight0.position.set(10,8,5);
		this.scene.add(pointLight0);
		
		this.renderer = new THREE.WebGLRenderer();	
		this.renderer.setSize( width *0.8, height *0.8);
		domElement.appendChild( this.renderer.domElement );

		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000.0);
		this.camera.position.set(0, 0, 2);

		let orbit_controls = new OrbitControls(this.camera, this.renderer.domElement)
		orbit_controls.enablePan = false;
		orbit_controls.update();

		
		this.cmap2 = load_cmap2('off', octahedron_off);
		this.map_renderer = new Renderer(this.cmap2);
		this.map_renderer.edges.create({material: mesh_edge_material}).add(this.scene);
		this.map_renderer.faces.create({material: mesh_face_material}).add(this.scene);

		this.running = false;
		const axis = new THREE.Vector3(1, 1, 0.5).normalize();
		let next_step = 3;
		this.loop = function(){
			if(this.running){
				this.time += this.clock.getDelta();
				if(this.time > next_step){
					next_step += 3;
					butterfly(this.cmap2);
					this.map_renderer.edges.update();
					this.map_renderer.faces.update();
				}
				if(this.time > 15){
					this.map_renderer.edges.delete();
					this.map_renderer.faces.delete();
					this.time = 0;
					next_step = 3;					
					this.cmap2 = load_cmap2('off', octahedron_off);
					this.map_renderer = new Renderer(this.cmap2);
					this.map_renderer.edges.create({material: mesh_edge_material}).add(this.scene);
					this.map_renderer.faces.create({material: mesh_face_material}).add(this.scene);
					this.clock.start();
					
				}
				this.map_renderer.edges.mesh.setRotationFromAxisAngle(axis, Math.PI / 7.5 * this.time)
				this.map_renderer.faces.mesh.setRotationFromAxisAngle(axis, Math.PI / 7.5 * this.time)

				this.renderer.render(this.scene, this.camera);
				requestAnimationFrame(this.loop.bind(this));
			}
		}

		this.open = function(){
			this.running = true;
			this.clock.start();
			this.loop();
		}
	
		this.close = function(){
			this.clock.stop();
			this.running = false;
		}
	}
);

import Stats from './stats.module.js'
let stats = new Stats();
document.body.appendChild(stats.dom);

export let volume_slide = new Slide(
	function(domElement, width, height){


		this.clock = new THREE.Clock(true);
		this.time = 0;

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(background);
		this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.8));
		let pointLight0 = new THREE.PointLight(0xFFFFFF, 0.8);
		pointLight0.position.set(10,8,5);
		this.scene.add(pointLight0);
		
		this.renderer = new THREE.WebGLRenderer({antialias: true});	
		this.renderer.setSize( width *0.8, height *0.8);
		domElement.appendChild( this.renderer.domElement );

		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000.0);
		this.camera.position.set(0, 0, 2);

		let orbit_controls = new OrbitControls(this.camera, this.renderer.domElement)
		orbit_controls.enablePan = false;
		orbit_controls.update();

		
		// this.cmap3 = load_cmap3('mesh', metatron);
		// this.map_renderer = new Renderer(this.cmap3);
		// let position = this.cmap3.get_attribute(this.cmap3.vertex, "position");


		let v_shader = `
			in vec3 position;

			in vec3 center;
			in vec3 v0;
			in vec3 v1;
			in vec3 v2;
			in vec3 v3;
			in vec3 v4;
			in vec3 v5;
			in vec3 v6;
			in vec3 v7;

			uniform mat4 modelMatrix;
			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;
			uniform vec3 cameraPos;

			out vec3 pos;

			void main() {
				vec3 p = position;
				switch(gl_VertexID){
					case 0:
						p = v0;
						break;
					case 1:
						p = v1;
						break;
					case 2:
						p = v2;
						break;
					case 3:
						p = v3;
						break;
					case 4:
						p = v4;
						break;
					case 5:
						p = v5;
						break;
					case 6:
						p = v6;
						break;
					case 7:
						p = v7;
						break;
				}

				vec3 plane = vec3(-1, 0, -1);
				float scale = 0.98;
				float min = - 0.1;
				float max = 0.0;
				float value = dot(plane, vec3(modelMatrix * vec4(center, 1.0)));
				// float value = dot(plane, vec3(modelMatrix * vec4(center + p, 1.0)));
				value = clamp((value - min)/(max-min), 0.0, 1.0);
				scale *= (value * value);

				p *= scale;
				p += center;

				vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
				gl_Position = projectionMatrix * mvPosition;
				pos = vec3(modelViewMatrix * vec4( p, 1.0));
			}
		`;

		let f_shader = `
			precision highp float;

			in vec3 pos;

			out vec4 fragColor;

			void main(){
				vec3 light_pos = vec3(10.75, 10.75,10.75);

				float specular = 0.9;
				float shine = 0.1;
				
				vec3 N = normalize(cross(dFdx(pos),dFdy(pos)));
				 vec3 L = normalize(light_pos - pos);
				float lamb = clamp(dot(N, L), 0.2, 1.0);
				vec3 E = normalize(-pos);
				vec3 R = reflect(-L, N);
				float spec = pow(max(dot(R,E), 0.0), specular);
				vec3 specCol = mix(vec3(1.0), vec3(1.0), shine);
				fragColor = vec4(mix(vec3(1.0) * lamb, specCol, spec), 1.0);

				// fragColor = vec4(N, 1.0);

			}
		`;


		
		// let nb_inst = this.cmap3.nb_cells(this.cmap3.volume) - 1;
		// console.log(nb_inst)
		// let v0_array =  new Float32Array(nb_inst * 3);
		// let v1_array =  new Float32Array(nb_inst * 3);
		// let v2_array =  new Float32Array(nb_inst * 3);
		// let v3_array =  new Float32Array(nb_inst * 3);
		// let v4_array =  new Float32Array(nb_inst * 3);
		// let v5_array =  new Float32Array(nb_inst * 3);
		// let v6_array =  new Float32Array(nb_inst * 3);
		// let v7_array =  new Float32Array(nb_inst * 3);

		// let centers = new Float32Array(nb_inst * 3);
		// let n = 0;
		// let D = [];
		// let p0 = new THREE.Vector3;
		// let p1 = new THREE.Vector3;
		// let p2 = new THREE.Vector3;
		// let p3 = new THREE.Vector3;
		// let p4 = new THREE.Vector3;
		// let p5 = new THREE.Vector3;
		// let p6 = new THREE.Vector3;
		// let p7 = new THREE.Vector3;
		
		// this.cmap3.foreach(this.cmap3.volume, wd => {
		// 	if(this.cmap3.is_boundary(wd))
		// 		return;

		// 	let center = new THREE.Vector3();
		// 	D.length = 0;
		// 	D[0] = wd;
		// 	D[1] = this.cmap3.phi1[D[0]];
		// 	D[2] = this.cmap3.phi1[D[1]];
		// 	D[3] = this.cmap3.phi1[D[2]];
		// 	D[4] = this.cmap3.phi2[this.cmap3.phi1[this.cmap3.phi2[D[0]]]];
		// 	D[5] = this.cmap3.phi2[this.cmap3.phi1[this.cmap3.phi2[D[1]]]];
		// 	D[6] = this.cmap3.phi2[this.cmap3.phi1[this.cmap3.phi2[D[2]]]];
		// 	D[7] = this.cmap3.phi2[this.cmap3.phi1[this.cmap3.phi2[D[3]]]];

		// 	p0.copy(position[this.cmap3.cell(this.cmap3.vertex, D[0])]);
		// 	p1.copy(position[this.cmap3.cell(this.cmap3.vertex, D[1])]);
		// 	p2.copy(position[this.cmap3.cell(this.cmap3.vertex, D[2])]);
		// 	p3.copy(position[this.cmap3.cell(this.cmap3.vertex, D[3])]);
		// 	p4.copy(position[this.cmap3.cell(this.cmap3.vertex, D[4])]);
		// 	p5.copy(position[this.cmap3.cell(this.cmap3.vertex, D[5])]);
		// 	p6.copy(position[this.cmap3.cell(this.cmap3.vertex, D[6])]);
		// 	p7.copy(position[this.cmap3.cell(this.cmap3.vertex, D[7])]);
		// 	center.add(p0)
		// 	center.add(p1)
		// 	center.add(p2)
		// 	center.add(p3)
		// 	center.add(p4)
		// 	center.add(p5)
		// 	center.add(p6)
		// 	center.add(p7)

		// 	center.divideScalar(8);
			
		// 	v0_array[n] = p0.x - center.x;
		// 	v1_array[n] = p1.x- center.x;
		// 	v2_array[n] = p2.x- center.x;
		// 	v3_array[n] = p3.x- center.x;
		// 	v4_array[n] = p4.x- center.x;
		// 	v5_array[n] = p5.x- center.x;
		// 	v6_array[n] = p6.x- center.x;
		// 	v7_array[n] = p7.x- center.x;
		// 	centers[n++] = center.x;
		// 	v0_array[n] = p0.y - center.y;
		// 	v1_array[n] = p1.y - center.y;
		// 	v2_array[n] = p2.y - center.y;
		// 	v3_array[n] = p3.y - center.y;
		// 	v4_array[n] = p4.y - center.y;
		// 	v5_array[n] = p5.y - center.y;
		// 	v6_array[n] = p6.y - center.y;
		// 	v7_array[n] = p7.y - center.y;
		// 	centers[n++] = center.y;
		// 	v0_array[n] = p0.z - center.z;
		// 	v1_array[n] = p1.z - center.z;
		// 	v2_array[n] = p2.z - center.z;
		// 	v3_array[n] = p3.z - center.z;
		// 	v4_array[n] = p4.z - center.z;
		// 	v5_array[n] = p5.z - center.z;
		// 	v6_array[n] = p6.z - center.z;
		// 	v7_array[n] = p7.z - center.z;
		// 	centers[n++] = center.z;
		// });

		

		let g = load_mesh(metatron);

		let nb_inst = g.hex.length;
		console.log(nb_inst)
		let v0_array =  new Float32Array(nb_inst * 3);
		let v1_array =  new Float32Array(nb_inst * 3);
		let v2_array =  new Float32Array(nb_inst * 3);
		let v3_array =  new Float32Array(nb_inst * 3);
		let v4_array =  new Float32Array(nb_inst * 3);
		let v5_array =  new Float32Array(nb_inst * 3);
		let v6_array =  new Float32Array(nb_inst * 3);
		let v7_array =  new Float32Array(nb_inst * 3);

		let centers = new Float32Array(nb_inst * 3);
		let jacobian = new Float32Array(nb_inst);
		let n = 0;
		let D = [];
		let p0 = new THREE.Vector3;
		let p1 = new THREE.Vector3;
		let p2 = new THREE.Vector3;
		let p3 = new THREE.Vector3;
		let p4 = new THREE.Vector3;
		let p5 = new THREE.Vector3;
		let p6 = new THREE.Vector3;
		let p7 = new THREE.Vector3;
		
		let center = new THREE.Vector3;
		console.log(g)
		g.hex.forEach(hex => {
			center.set(0, 0, 0);
			p0 = g.v[hex[0]];
			p1 = g.v[hex[1]];
			p2 = g.v[hex[2]];
			p3 = g.v[hex[3]];
			p4 = g.v[hex[4]];
			p5 = g.v[hex[5]];
			p6 = g.v[hex[6]];
			p7 = g.v[hex[7]];

			center.x += p0[0];
			center.x += p1[0];
			center.x += p2[0];
			center.x += p3[0];
			center.x += p4[0];
			center.x += p5[0];
			center.x += p6[0];
			center.x += p7[0];
			center.y += p0[1];
			center.y += p1[1];
			center.y += p2[1];
			center.y += p3[1];
			center.y += p4[1];
			center.y += p5[1];
			center.y += p6[1];
			center.y += p7[1];
			center.z += p0[2];
			center.z += p1[2];
			center.z += p2[2];
			center.z += p3[2];
			center.z += p4[2];
			center.z += p5[2];
			center.z += p6[2];
			center.z += p7[2];
			center.divideScalar(8);

			v0_array[n] = p0[0]- center.x;
			v1_array[n] = p1[0]- center.x;
			v2_array[n] = p2[0]- center.x;
			v3_array[n] = p3[0]- center.x;
			v4_array[n] = p4[0]- center.x;
			v5_array[n] = p5[0]- center.x;
			v6_array[n] = p6[0]- center.x;
			v7_array[n] = p7[0]- center.x;
			centers[n++] = center.x;
			v0_array[n] = p0[1] - center.y;
			v1_array[n] = p1[1] - center.y;
			v2_array[n] = p2[1] - center.y;
			v3_array[n] = p3[1] - center.y;
			v4_array[n] = p4[1] - center.y;
			v5_array[n] = p5[1] - center.y;
			v6_array[n] = p6[1] - center.y;
			v7_array[n] = p7[1] - center.y;
			centers[n++] = center.y;
			v0_array[n] = p0[2] - center.z;
			v1_array[n] = p1[2] - center.z;
			v2_array[n] = p2[2] - center.z;
			v3_array[n] = p3[2] - center.z;
			v4_array[n] = p4[2] - center.z;
			v5_array[n] = p5[2] - center.z;
			v6_array[n] = p6[2] - center.z;
			v7_array[n] = p7[2] - center.z;
			centers[n++] = center.z;
		});

		let geometry = new THREE.BufferGeometry();
		let pos = [
			0.1, -0.1, -0.1,
			-0.1, -0.1, -0.1,
			-0.1, 0.1, -0.1,
			0.1, 0.1, -0.1,
			0.1, -0.1, 0.1,
			-0.1, -0.1, 0.1,
			-0.1, 0.1, 0.1,
			0.1, 0.1, 0.1
		]

		let indices = [
			1, 0, 2,
			2, 0, 3,
			1, 5, 4,
			1, 4, 0,
			0, 4, 3, 
			3, 4, 7,
			3, 7, 6, 
			3, 6, 2, 
			1, 2, 5,
			2, 6, 5,
			5, 6, 4,
			4, 6, 7	
		];

		geometry.setIndex(indices);
		geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( pos, 3 ) );
		geometry.setAttribute( 'center', new THREE.InstancedBufferAttribute( centers, 3 ) );
		geometry.setAttribute( 'v0', new THREE.InstancedBufferAttribute( v0_array, 3 ) );
		geometry.setAttribute( 'v1', new THREE.InstancedBufferAttribute( v1_array, 3 ) );
		geometry.setAttribute( 'v2', new THREE.InstancedBufferAttribute( v2_array, 3 ) );
		geometry.setAttribute( 'v3', new THREE.InstancedBufferAttribute( v3_array, 3 ) );
		geometry.setAttribute( 'v4', new THREE.InstancedBufferAttribute( v4_array, 3 ) );
		geometry.setAttribute( 'v5', new THREE.InstancedBufferAttribute( v5_array, 3 ) );
		geometry.setAttribute( 'v6', new THREE.InstancedBufferAttribute( v6_array, 3 ) );
		geometry.setAttribute( 'v7', new THREE.InstancedBufferAttribute( v7_array, 3 ) );

		let mat = new THREE.RawShaderMaterial( {
			glslVersion: THREE.GLSL3,
			vertexShader: v_shader,
			fragmentShader: f_shader,
			depthTest: true,
			depthWrite: true
		} );


			console.log(mat)
		let mesh = new THREE.InstancedMesh(geometry, mat, nb_inst);
		let p = new THREE.Vector3();
		let matrix = new THREE.Matrix4();
		// let color = new THREE.Color();
		// for(let i = 0; i < nb_inst; ++i){
		// 	matrix.setPosition(centers[i].x, centers[i].y, centers[i].z);
		// 	mesh.setMatrixAt(i, matrix);
		// 	mesh.setColorAt(i, color.setHex(0xffffff * Math.random()))
		// }

		// let i = 0;
		// this.cmap3.foreach(this.cmap3.vertex, vd => {
		// 	p.copy(position[this.cmap3.cell(this.cmap3.vertex, vd)]);
		// 	matrix.setPosition(p.x, p.y, p.z);
		// 	mesh.setMatrixAt(i++, matrix);
		// });


		this.scene.add(mesh);

		// let mat2 = new THREE.RawShaderMaterial( {
		// 	glslVersion: THREE.GLSL3,
		// 	vertexShader: v_shader,
		// 	fragmentShader: f_shader,
		// 	depthTest: true,
		// 	depthWrite: true
		// } );
		// let mesh2 = new THREE.InstancedMesh(geometry, mat, nb_inst);
		// mesh2.position.set(0, -2, 0)
		// this.scene.add(mesh2);
		// let mat3 = new THREE.RawShaderMaterial( {
		// 	glslVersion: THREE.GLSL3,
		// 	vertexShader: v_shader,
		// 	fragmentShader: f_shader,
		// 	depthTest: true,
		// 	depthWrite: true
		// } );
		// let mesh3 = new THREE.InstancedMesh(geometry, mat, nb_inst);
		// mesh3.position.set(0, 2, 0)
		// this.scene.add(mesh3);

		this.running = false;
		const axis = new THREE.Vector3(1, 1, 0).normalize();
		let next_step = 3;
		this.loop = function(){
				stats.update();
				if(this.running){
				this.time += this.clock.getDelta();

				// this.map_renderer.edges.mesh.setRotationFromAxisAngle(axis, Math.PI / 7.5 * this.time)
				mesh.setRotationFromAxisAngle(axis, Math.PI / 15 * this.time)
				// mesh2.setRotationFromAxisAngle(axis, Math.PI / 15 * this.time)
				// mesh3.setRotationFromAxisAngle(axis, Math.PI / 15 * this.time)
				
				this.renderer.render(this.scene, this.camera);
				requestAnimationFrame(this.loop.bind(this));
			}
		}

		this.open = function(){
			this.running = true;
			this.clock.start();
			this.loop();
		}
	
		this.close = function(){
			this.clock.stop();
			this.running = false;
		}

		let clock = new THREE.Clock(true);

		// console.log("loading geometry");
		// clock.getDelta();
		// let time = 0;
		// let g = load_mesh(metatron);
		// time = clock.getDelta();
		// console.log(time);
		// g = load_mesh(metatron);
		// time = clock.getDelta();
		// console.log(time);
		// g = load_mesh(metatron);
		// time = clock.getDelta();
		// console.log(time);
		// g = load_mesh(metatron);
		// time = clock.getDelta();
		// console.log(time);
		// g = load_mesh(metatron);
		// time = clock.getDelta();
		// console.log(time);
		// g = load_mesh(metatron);
		// time = clock.getDelta();
		// console.log(time);
		// console.log("creating map");
		// let m = map_from_geometry(g);
		// time = clock.getDelta();
		// console.log(time);
		// m = map_from_geometry(g);
		// time = clock.getDelta();
		// console.log(time);
		// m = map_from_geometry(g);
		// time = clock.getDelta();
		// console.log(time);
		// m = map_from_geometry(g);
		// time = clock.getDelta();
		// console.log(time);
		// m = map_from_geometry(g);
		// time = clock.getDelta();
		// console.log(time);
	}
);