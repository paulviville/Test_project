import {CMap2} from './CMapJS/CMap/CMap.js';
import { Slide } from './Slide.js';
import Renderer from './CMapJS/Renderer.js';
import * as THREE from './CMapJS/three.module.js';
import {OrbitControls} from './CMapJS/OrbitsControls.js';
import {load_cmap2} from './CMapJS/IO/Surface_Formats/CMap2_IO.js' 
import {tetrahedron_off, icosahedron_off, cube_off, octahedron_off, cactus_off, fertility_off, metatron_off} from './off_files.js';
import {catmull_clark} from './CMapJS/Modeling/Subdivision/Surface/Catmull_Clark.js';
import {doo_sabin} from './CMapJS/Modeling/Subdivision/Surface/Doo_Sabin.js';
import { sqrt3 } from './CMapJS/Modeling/Subdivision/Surface/Sqrt3.js';
import { sqrt2 } from './CMapJS/Modeling/Subdivision/Surface/Sqrt2.js';
import { loop } from './CMapJS/Modeling/Subdivision/Surface/Loop.js';
import { butterfly } from './CMapJS/Modeling/Subdivision/Surface/Butterfly.js';

export let cc_slide = new Slide(
	function(domElement){
			let width = domElement.parentElement.clientWidth;
			let height = domElement.parentElement.clientHeight;

			this.scene = new THREE.Scene();
			this.scene.background = new THREE.Color(0x191919);
			this.scene.add(new THREE.AmbientLight(0xAAAAFF, 0.8));
			let pointLight0 = new THREE.PointLight(0x3137DD, 0.8);
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
			this.map_renderer.vertices.create().add(this.scene);
			this.map_renderer.edges.create({color: 0xFFFFFF}).add(this.scene);
			this.map_renderer.faces.create().add(this.scene);

			function onKeyUp(event){
				switch(event.which){
					case 67:
						catmull_clark(this.cmap2);
						this.map_renderer.vertices.update();
						this.map_renderer.edges.update();
						this.map_renderer.faces.update();
						break;
					default:
				}
			}
			domElement.addEventListener( 'keyup', onKeyUp.bind(this), false );

			this.running = false;
			this.loop = function(){
				if(this.running){
					this.renderer.render(this.scene, this.camera);
					requestAnimationFrame(this.loop.bind(this));
				}
			}
	}
);

export let ds_slide = new Slide(
	function(domElement){
			let width = domElement.parentElement.clientWidth;
			let height = domElement.parentElement.clientHeight;

			this.scene = new THREE.Scene();
			this.scene.background = new THREE.Color(0x191919);
			this.scene.add(new THREE.AmbientLight(0xAAAAFF, 0.8));
			let pointLight0 = new THREE.PointLight(0x3137DD, 0.8);
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
			this.map_renderer.vertices.create().add(this.scene);
			this.map_renderer.edges.create({color: 0xFFFFFF}).add(this.scene);
			this.map_renderer.faces.create().add(this.scene);

			function onKeyUp(event){
				switch(event.which){
					case 67:
						doo_sabin(this.cmap2);
						this.map_renderer.vertices.update();
						this.map_renderer.edges.update();
						this.map_renderer.faces.update();
						break;
					default:
				}
			}
			domElement.addEventListener( 'keyup', onKeyUp.bind(this), false );

			this.loop = function(){
				if(this.running){
					this.renderer.render(this.scene, this.camera);
					requestAnimationFrame(this.loop.bind(this));
				}
			}
	}
);

export let sqrt2_slide = new Slide(
	function(domElement){
			let width = domElement.parentElement.clientWidth;
			let height = domElement.parentElement.clientHeight;

			this.scene = new THREE.Scene();
			this.scene.background = new THREE.Color(0x191919);
			this.scene.add(new THREE.AmbientLight(0xAAAAFF, 0.8));
			let pointLight0 = new THREE.PointLight(0x3137DD, 0.8);
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
			this.map_renderer.vertices.create().add(this.scene);
			this.map_renderer.edges.create({color: 0xFFFFFF}).add(this.scene);
			this.map_renderer.faces.create().add(this.scene);

			function onKeyUp(event){
				switch(event.which){
					case 67:
						sqrt2(this.cmap2);
						this.map_renderer.vertices.update();
						this.map_renderer.edges.update();
						this.map_renderer.faces.update();
						break;
					default:
				}
			}
			domElement.addEventListener( 'keyup', onKeyUp.bind(this), false );

			this.loop = function(){
				if(this.running){
					this.renderer.render(this.scene, this.camera);
					requestAnimationFrame(this.loop.bind(this));
				}
			}
	}
);

export let sqrt3_slide = new Slide(
	function(domElement){
			let width = domElement.parentElement.clientWidth;
			let height = domElement.parentElement.clientHeight;

			this.scene = new THREE.Scene();
			this.scene.background = new THREE.Color(0x191919);
			this.scene.add(new THREE.AmbientLight(0xAAAAFF, 0.8));
			let pointLight0 = new THREE.PointLight(0x3137DD, 0.8);
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
			this.map_renderer.vertices.create().add(this.scene);
			this.map_renderer.edges.create({color: 0xFFFFFF}).add(this.scene);
			this.map_renderer.faces.create().add(this.scene);

			function onKeyUp(event){
				switch(event.which){
					case 67:
						sqrt3(this.cmap2);
						this.map_renderer.vertices.update();
						this.map_renderer.edges.update();
						this.map_renderer.faces.update();
						break;
					default:
				}
			}
			domElement.addEventListener( 'keyup', onKeyUp.bind(this), false );

			this.loop = function(){
				if(this.running){
					this.renderer.render(this.scene, this.camera);
					requestAnimationFrame(this.loop.bind(this));
				}
			}
	}
);

export let loop_slide = new Slide(
	function(domElement){
			let width = domElement.parentElement.clientWidth;
			let height = domElement.parentElement.clientHeight;

			this.scene = new THREE.Scene();
			this.scene.background = new THREE.Color(0x191919);
			this.scene.add(new THREE.AmbientLight(0xAAAAFF, 0.8));
			let pointLight0 = new THREE.PointLight(0x3137DD, 0.8);
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
			this.map_renderer.vertices.create().add(this.scene);
			this.map_renderer.edges.create({color: 0xFFFFFF}).add(this.scene);
			this.map_renderer.faces.create().add(this.scene);

			function onKeyUp(event){
				switch(event.which){
					case 67:
						loop(this.cmap2);
						this.map_renderer.vertices.update();
						this.map_renderer.edges.update();
						this.map_renderer.faces.update();
						break;
					default:
				}
			}
			domElement.addEventListener( 'keyup', onKeyUp.bind(this), false );

			this.loop = function(){
				if(this.running){
					this.renderer.render(this.scene, this.camera);
					requestAnimationFrame(this.loop.bind(this));
				}
			}
	}
);