import {CMap0} from './CMapJS/CMap/CMap.js';
import {CMap1} from './CMapJS/CMap/CMap.js';
import {CMap2} from './CMapJS/CMap/CMap.js';
import {CMap3} from './CMapJS/CMap/CMap.js';
import IncidenceGraph from './CMapJS/CMap/IncidenceGraph.js';
import Renderer from './CMapJS/Rendering/Renderer.js';
import * as THREE from './CMapJS/Dependencies/three.module.js';
import {OrbitControls} from './CMapJS/Dependencies/OrbitsControls.js';
import {load_cmap2} from './CMapJS/IO/Surface_Formats/CMap2_IO.js' 
import {load_cmap3} from './CMapJS/IO/Volumes_Formats/CMap3_IO.js' 
import {tetrahedron_off, icosahedron_off, cube_off, octahedron_off, cactus_off, fertility_off, metatron_off} from './off_files.js';
import {test1_mesh, fertility, dinopet, santa, ortho3, cactus, test0_mesh, metatron} from './mesh_files.js';
import {cut_all_edges, quadrangulate_all_faces} from './CMapJS/Utils/Subdivision.js';
import {catmull_clark, catmull_clark_inter} from './CMapJS/Modeling/Subdivision/Surface/Catmull_Clark.js';
import {doo_sabin} from './CMapJS/Modeling/Subdivision/Surface/Doo_Sabin.js';

import {controllers, GUI} from './CMapJS/Dependencies/dat.gui.module.js';

import {TransformControls} from './CMapJS/Dependencies/TransformControls.js'
import MeshHandler from './MeshHandler.js';

let incidence_graph = new IncidenceGraph();
let igpos = incidence_graph.add_attribute(0, "position");
let v0 = incidence_graph.add_vertex();
igpos[v0] = new THREE.Vector3(0, 1, 0);
let v1 = incidence_graph.add_vertex();
igpos[v1] = new THREE.Vector3(-0.433, 0.25, 0);
let v2 = incidence_graph.add_vertex();
igpos[v2] = new THREE.Vector3(0.433, 0.25, 0);
let v3 = incidence_graph.add_vertex();
igpos[v3] = new THREE.Vector3(-0.866, -0.5, 0);
let v4 = incidence_graph.add_vertex();
igpos[v4] = new THREE.Vector3(0.0, -0.5, 0);
let v5 = incidence_graph.add_vertex();
igpos[v5] = new THREE.Vector3(0.866, -0.5, 0);
let v6 = incidence_graph.add_vertex();
igpos[v6] = new THREE.Vector3(0, 0, 0);
// incidence_graph.delete_vertex(v5);
let e0 = incidence_graph.add_edge(v0, v1);
let e1 = incidence_graph.add_edge(v0, v2);
let e2 = incidence_graph.add_edge(v1, v2);
let e3 = incidence_graph.add_edge(v1, v3);
let e4 = incidence_graph.add_edge(v1, v4);
let e5 = incidence_graph.add_edge(v2, v4);
let e6 = incidence_graph.add_edge(v2, v5);
let e7 = incidence_graph.add_edge(v3, v4);
let e8 = incidence_graph.add_edge(v4, v5);
let e9 = incidence_graph.add_edge(v4, v6);

let f0 = incidence_graph.add_face(e0, e1, e2);
let f1 = incidence_graph.add_face(e7, e3, e4);
let f2 = incidence_graph.add_face(e8, e5, e6);
let f3 = incidence_graph.add_face(e0, e7, e6);
console.log(f3);
let f4 = incidence_graph.add_face(e2, e5, e4);
incidence_graph.delete_face(f4);
// incidence_graph.delete_edge(e4);
// incidence_graph.delete_edge(0);
// incidence_graph.delete_vertex(0);
// incidence_graph.add_vertex();
// incidence_graph.add_vertex();
console.log(incidence_graph);
incidence_graph.debug();

console.log(incidence_graph.nb_cells(2))

let ig_renderer = new Renderer(incidence_graph);
ig_renderer.vertices.create({color: new THREE.Color(0x00FF00)});
ig_renderer.edges.create({color: new THREE.Color(0xFF0000), size: 2.5});
ig_renderer.faces.create({color: new THREE.Color(0x00FFFF), side: THREE.DoubleSide});



const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);
camera.position.set(0, 0, 2);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});


// ig_renderer.vertices.add(scene);
// ig_renderer.edges.add(scene);
// ig_renderer.faces.add(scene);

// let orbit_controls = new OrbitControls(camera, renderer.domElement)
// orbit_controls.enablePan = false;
// orbit_controls.update();
// orbit_controls.addEventListener('change', render);


let ambientLight = new THREE.AmbientLight(0xAAAAFF, 0.5);
scene.add(ambientLight);
let pointLight0 = new THREE.PointLight(0x3137DD, 5);
pointLight0.position.set(10,8,5);
scene.add(pointLight0);


let cmap2 = load_cmap2('off', icosahedron_off);
// cmap2.set_embeddings(cmap2.edge);
// cmap2.set_embeddings(cmap2.face);
let pos2 = cmap2.get_attribute(cmap2.vertex, "position");
// let vd0 = triangulate_face(cmap2, 0);
// console.log(vd0, cmap2.cell(cmap2.vertex, vd0))
// pos2[cmap2.cell(cmap2.vertex, vd0)] = new THREE.Vector3;

// doo_sabin(cmap2);
// catmull_clark(cmap2);
catmull_clark_inter(cmap2);
// doo_sabin(cmap2);
// loop(cmap2);
// sqrt3(cmap2);
// catmull_clark(cmap2);

// let p2_1 = pos2[cmap2.cell(cmap2.vertex, 0)];
// let p2_2 = pos2[cmap2.cell(cmap2.vertex, cmap2.phi2[0])];
// let v2 = cmap2.cut_edge(0, true);
// pos2[cmap2.cell(cmap2.vertex, v2)] = (new THREE.Vector3()).add(p2_1).add(p2_2).multiplyScalar(0.5);


let cmap2_base = load_cmap2('off', icosahedron_off);
let renderer2_base = new Renderer(cmap2_base);
// renderer2_base.edges.create({size: 4}).add(scene);
// renderer2_base.vertices.create({size: 0.0125}).add(scene);

let renderer2 = new Renderer(cmap2);
// renderer2.vertices.create({size: 0.0015625 * 8}).add(scene);
// renderer2.edges.create({size: 1, color: 0x0055DD}).add(scene);
// renderer2.faces.create({}).add(scene);

// function onMouseMove(event)
// {

// }

// function onMouseUp(event)
// {
//     window.removeEventListener( 'mousemove', onMouseMove, false );
//     window.removeEventListener( 'mouseup', onMouseUp, false );
// }

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let id = null;
let mesh = null;
function onMouseDown(event)
{
	console.log(event.detail)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
	let intersections = raycaster.intersectObject(renderer2.vertices.mesh);
    
	if(id != null) { 
		mesh.setColorAt(id, new THREE.Color(0xFF0000));
		id = null;
		mesh.instanceColor.needsUpdate = true;
	}

	if(intersections.length) {
        id = intersections[0].instanceId;
		mesh = renderer2.vertices.mesh;
        mesh.setColorAt(id, new THREE.Color(0x00FF00))
        mesh.instanceColor.needsUpdate = true;
    }
    else {
		intersections = raycaster.intersectObject(renderer2.edges.mesh);
		if(intersections.length) {
			id = intersections[0].instanceId;
			mesh = renderer2.edges.mesh;
			mesh.setColorAt(id, new THREE.Color(0x00FF00))
			mesh.instanceColor.needsUpdate = true;
		}
		else {
			// intersections = raycaster.intersectObject(renderer2.edges.mesh);
		}
    }
}

/// structure graphe d'incidence
// opérations: ajouter sommet, connecter sommets/ajouter arete, ajouter face, couper arete

const map_handler = new MeshHandler(incidence_graph);
map_handler.initialize({vertices: true, edges: true, faces: true});
map_handler.addMeshesTo(scene);


const event_handler = new (function(scope, map_handler){
	function Mode(start, stop) {
		let on = false;
		this.start = function() {
			start();
			on = true;
			return true;
		};
		this.stop = function(){
			stop();
			on = false;
		};
	
		this.toggle = function() {
			on ? this.stop() : this.start();
		}
	}	

	const orbit_controls = new OrbitControls(camera, scope)
	orbit_controls.enablePan = false;
	orbit_controls.mouseButtons.MIDDLE = THREE.MOUSE.ROTATE;
	orbit_controls.mouseButtons.LEFT = null;
	orbit_controls.mouseButtons.RIGHT = null;
	const raycaster = new THREE.Raycaster;
	const mouse = new THREE.Vector2;
	
	function set_mouse(event) {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	}

	function raycast(target) {
		raycaster.setFromCamera(mouse, camera);
		const intersections = (Array.isArray(target) ? 
			raycaster.intersectObjects(target):
			raycaster.intersectObject(target));

		return intersections[0];
	}

	let active_mode = undefined;
	const key_held = {};

	let vertex = null;
	let edge = null;

	// const select_vertex = function(vd) {
	// 	if(selected_vertices.has(vd)) {
	// 		deselect_vertex(vd);
	// 		return;	
	// 	}

	// 	selected_vertices.add(vd);
	// 	map_handler.select_vertex(vd);
	// }

	// const select_edge = function(ed) {
	// 	if(selected_edges.has(ed)) {
	// 		deselect_edge(ed);
	// 		return;	
	// 	}

	// 	selected_edges.add(ed);
	// 	map_handler.select_edge(ed);
	// }

	// const deselect_all = function() {
	// 	selected_vertices.forEach(vd => deselect_vertex(vd));
	// 	selected_edges.forEach(ed => deselect_edge(ed));
	// }

	// const deselect_vertex = function(vd) {
	// 	selected_vertices.delete(vd);
	// 	map_handler.deselect_vertex(vd);
	// }

	// const deselect_edge = function(ed) {
	// 	selected_edges.delete(ed);
	// 	map_handler.deselect_edge(ed);
	// };

	const selectMouseDown = function(event) {
		set_mouse(event);
		if(event.button == 0){
			raycaster.setFromCamera(mouse, camera);
			if(!key_held.ShiftLeft)
				map_handler.deselectAll();

			let hit = key_held.ShiftLeft ? map_handler.toggleSelectHit(raycaster) : map_handler.selectHit(raycaster);
		}
	}

	const mode_select = new Mode(
		() => {
			scope.addEventListener( 'pointerdown', selectMouseDown );
		},
		() => {
			scope.removeEventListener( 'pointerdown', selectMouseDown );
		}
	);

	const OPdblClick = function(event) {
		set_mouse(event);
		raycaster.setFromCamera(mouse, camera);
		let point = map_handler.positionHit(raycaster);
		if(point) {
			orbit_controls.target.copy(point)
			orbit_controls.update();
		}
	}

	const mode_orbit = new Mode(
		() => {
			orbit_controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
			scope.addEventListener('dblclick', OPdblClick, false);
		},
		() => {
			scope.removeEventListener('dblclick', OPdblClick, false);
			orbit_controls.mouseButtons.LEFT = null;
		}
	);

	const mode_pan = new Mode(
		() => {
			scope.addEventListener('dblclick', OPdblClick);
			orbit_controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
			orbit_controls.enablePan = true;
		},
		() => {
			scope.removeEventListener('dblclick', OPdblClick);
			orbit_controls.mouseButtons.LEFT = null;
			orbit_controls.enablePan = false;
		}
	);

	let transcontrols = new TransformControls(camera, renderer.domElement);
	scene.add(transcontrols);
	const mode_move = new Mode(
		() => {
			transcontrols.addEventListener( 'dragging-changed', function (event) {} );
			transcontrols.attach(map_handler.get_vertices_mesh());
			console.log(transcontrols)
		},
		() => {
			transcontrols.detach();
		}
	);

	const defaultKeyDown = function(event){
		key_held[event.code] = true;
	};

	const defaultKeyUp = function(event){
		console.log(event.which, event.code, event.charCode);
		let next_mode = undefined;
		switch(event.code) {
			case "Escape": // deselect
				map_handler.deselectAll();
				break;
			case "Space": // select mode
				next_mode = mode_select;
				break;
			case "Delete": // delete selection
				map_handler.deleteSelection();
				break;
			case "KeyA": // add vertices mode
				break;
			case "KeyC": // cut edge
				break;
			case "Key": // eraser
				break;
			case "KeyF": // create face
				break
			case "KeyL": // draw
				break;
			case "KeyM": // move
				next_mode = mode_move;
				break;
			case "KeyO": // orbit
				next_mode = mode_orbit;
				break;
			case "KeyP": // pan
				next_mode = mode_pan;
				break;
		};

		if(next_mode) {
			if(active_mode) 
				active_mode.stop();
			active_mode = next_mode;
			active_mode.start();
		}

		key_held[event.code] = false;

	}

	scope.addEventListener("keydown", defaultKeyDown);
	scope.addEventListener("keyup", defaultKeyUp);
	active_mode = mode_select;
	active_mode.start();

	return this;
})(renderer.domElement, map_handler);

window.event_handler = event_handler;
window.map_handler = map_handler;

















// function test({cache = undefined, indices = false}){
//     console.log(cache, indices);
// }



// let cmap3 = load_cmap3("mesh", test1_mesh);
// let pos3 = cmap3.get_attribute(cmap3.vertex, "position");

// // let cache_ed = cmap3.cache(cmap3.edge);
// // console.log(cache_ed)
// // cmap3.foreach(cmap3.edge, ed => {
// //     let p1 = pos3[cmap3.cell(cmap3.vertex, ed)];
// //     let p2 = pos3[cmap3.cell(cmap3.vertex, cmap3.phi2[ed])];
// //     let v3 = cmap3.cut_edge(ed, true);
// //     pos3[cmap3.cell(cmap3.vertex, v3)] = (new THREE.Vector3()).add(p1).add(p2).multiplyScalar(0.5);
    
// // }, cache_ed);

// // cmap3.cut_face(cmap3.phi1[0], cmap3.phi_1[0], true)
// // let c3d0 = cmap3.phi2[0];
// // let c3d1 = cmap3.phi1[cmap3.phi1[c3d0]];
// // console.log(c3d0, c3d1)
// // cmap3.cut_face(c3d0, c3d1, true)
// // c3d0 = cmap3.phi1[cmap3.phi2[c3d1]];
// // c3d1 = cmap3.phi1[cmap3.phi1[c3d0]];
// // cmap3.cut_face(c3d0, c3d1, true)
// // let c3ed = cmap3.phi1[0];
// // let path_d = [c3ed];
// // path_d.push(cmap3.phi1[cmap3.phi2[cmap3.phi1[c3ed]]]);
// // path_d.push(cmap3.phi_1[cmap3.phi2[cmap3.phi_1[c3ed]]]);
// // cmap3.cut_volume(path_d, true);

// let renderer3 = new Renderer(cmap3);
// renderer3.volumes.create().add(scene).rescale(0.85);
// renderer3.vertices.create({size: 0.05}).add(scene);
// renderer3.edges.create().add(scene);





let clock = new THREE.Clock();
clock.start();

let cmap3 = load_cmap3("mesh", test0_mesh);
let load_time = clock.getDelta();
cmap3.set_embeddings(cmap3.edge);
let load_time2 = clock.getDelta();
console.log("load time: ", load_time);

let integrity = true;
cmap3.foreach_dart(d => {
	integrity &= cmap3.phi_1[cmap3.phi1[d]] == d;
	integrity &= cmap3.phi1[cmap3.phi_1[d]] == d;
	integrity &= cmap3.phi2[d] != d;
	integrity &= cmap3.phi2[cmap3.phi2[d]] == d;
	integrity &= cmap3.phi3[d] != d;
	integrity &= cmap3.phi3[cmap3.phi3[d]] == d;
});

console.log("integrity", integrity);

// cmap3.foreach_incident(cmap3.vertex2, cmap3.volume, 0, v2d => {
// 	cmap3.foreach_dart_of(cmap3.vertex2, v2d, d => {console.log("v2d", cmap3.cell(5, d))});
// });

// cmap3.foreach_incident(cmap3.vertex2, cmap3.volume, cmap3.phi3[0], v2d => {
// 	cmap3.foreach_dart_of(cmap3.vertex2, v2d, d => {console.log("3 v2d", cmap3.cell(5, d))});
// });

// cmap3.foreach(5, vd => {
// 	cmap3.foreach_dart_of(5, vd, d => {console.log(cmap3.cell(5, d))});
// })

let renderer3 = new Renderer(cmap3);
// renderer3.volumes.create().add(scene);
// renderer3.faces.create().add(scene);
// renderer3.edges.create().add(scene);
// renderer3.vertices.create({size: 0.05}).add(scene);
let renderer_time = clock.getDelta();

let total_time = load_time + renderer_time;
console.log("total time: ", total_time);
console.log("load time: ", load_time);
console.log("renderer time: ", renderer_time);

let iterations = 100;
let v;
let average_time_0 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap2.foreach_incident(cmap2.vertex, cmap2.volume, 0, vd => {let v = 2 * vd;});
//     average_time_0 += clock.getDelta();
// }
// average_time_0 /= iterations;

let average_time_1 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap2.foreach_incident(cmap2.vertex, cmap2.volume, 0, vd => {let v = 2 * vd;}, true);
//     average_time_1 += clock.getDelta();
// }
// average_time_1 /= iterations;
// console.log("foreach_incident vertex to volume times : ", average_time_0, average_time_1);

// average_time_0 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap2.foreach_incident(cmap2.edge, cmap2.volume, 0, vd => {let v = 2 * vd;});
//     average_time_0 += clock.getDelta();
// }
// average_time_0 /= iterations;

// average_time_1 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap2.foreach_incident(cmap2.edge, cmap2.volume, 0, vd => {let v = 2 * vd;}, true);
//     average_time_1 += clock.getDelta();
// }
// average_time_1 /= iterations;
// console.log("foreach_incident edge to volume times : ", average_time_0, average_time_1);

// average_time_0 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap2.foreach_incident(cmap2.face, cmap2.volume, 0, vd => {let v = 2 * vd;});
//     average_time_0 += clock.getDelta();
// }
// average_time_0 /= iterations;

// average_time_1 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap2.foreach_incident(cmap2.face, cmap2.volume, 0, vd => {let v = 2 * vd;}, true);
//     average_time_1 += clock.getDelta();
// }
// average_time_1 /= iterations;
// console.log("foreach_incident face to volume times : ", average_time_0, average_time_1);

// cmap3.set_embeddings(cmap3.connex)
// cmap3.set_embeddings(cmap3.face)
// cmap3.set_embeddings(cmap3.face2)
// cmap3.set_embeddings(cmap3.edge)

// average_time_0 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap3.foreach_incident(cmap3.face, cmap3.connex, 0, vd => {v = 2 * vd;});
//     average_time_0 += clock.getDelta();
// }
// average_time_0 /= iterations;

// average_time_1 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap3.foreach_incident(cmap3.face, cmap3.connex, 0, vd => {v = 2 * vd;}, true);
//     average_time_1 += clock.getDelta();
// }
// average_time_1 /= iterations;
// console.log("foreach_incident face to connex times : ", average_time_0, average_time_1);

// average_time_0 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap3.foreach_incident(cmap3.vertex, cmap3.connex, 0, vd => {v = 2 * vd;});
//     average_time_0 += clock.getDelta();
// }
// average_time_0 /= iterations;

// average_time_1 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap3.foreach_incident(cmap3.vertex, cmap3.connex, 0, vd => {v = 2 * vd;}, true);
//     average_time_1 += clock.getDelta();
// }
// average_time_1 /= iterations;
// console.log("foreach_incident vertex to connex times : ", average_time_0, average_time_1);

    // renderer3.volumes.rescale(0.85)

function update ()
{
    // renderer3.volumes.mesh.rotation.x += 0.003125
    // renderer3.volumes.mesh.rotation.y -= 0.001875
    // renderer3.volumes.mesh.rotation.z += 0.000625
    // let s = Math.sin(renderer3.volumes.mesh.rotation.x / Math.PI * 4) / 5 + Math.cos(renderer3.volumes.mesh.rotation.y * 30) / 10;
    // renderer3.volumes.rescale(0.8 + s)
    // let s2 = Math.sin(renderer3.volumes.mesh.rotation.x / Math.PI * 2) / 10;
    // renderer3.volumes.mesh.scale.set(1 + s2, 1 + s2, 1 + s2);

    // pointLight0.color.b = 0.8 + s ;
}

function render()
{
	renderer.render(scene, camera);
}

function mainloop()
{
    update();
    render();
    requestAnimationFrame(mainloop);
}

mainloop();

// export {cmap0};
// window.renderer2 = renderer2;
// window.renderer3 = renderer3;
// window.light0 = pointLight0;
// // window.cmap0 = cmap0;
// window.cmap1 = cmap1;
// window.cmap2 = cmap2;
// window.cmap3 = cmap3;
// window.CMap0 = CMap0;
