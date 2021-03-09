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
import Gizmo from './Gizmo.js';

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


let ig_renderer = new Renderer(incidence_graph);
ig_renderer.vertices.create({color: new THREE.Color(0x00FF00)});
ig_renderer.edges.create({color: new THREE.Color(0xFF0000), size: 2.5});
ig_renderer.faces.create({color: new THREE.Color(0x00FFFF), side: THREE.DoubleSide});



const scene = new THREE.Scene();
scene.background = new THREE.Color(0xAAAAAA);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);
camera.position.set(0, 0, 2);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

console.log(camera.rotation)

window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});




let ambientLight = new THREE.AmbientLight(0xAAAAFF, 0.5);
scene.add(ambientLight);
let pointLight0 = new THREE.PointLight(0x3137DD, 5);
pointLight0.position.set(10,8,5);
scene.add(pointLight0);



const map_handler = new MeshHandler(incidence_graph);
map_handler.initialize({vertices: true, edges: true, faces: true});
map_handler.addMeshesTo(scene);
let gizmo = new Gizmo();
	gizmo.initialize();
	gizmo.addTo(scene);

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
	


	function setMouse(event) {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	}

	let activeMode = undefined;
	const keyHeld = {};

	let vertex = null;
	let edge = null;

	const selectMouseDown = function(event) {
		setMouse(event);
		if(event.button == 0){
			raycaster.setFromCamera(mouse, camera);
			if(!keyHeld.ShiftLeft)
				map_handler.deselectAll();

			let hit = keyHeld.ShiftLeft ? map_handler.toggleSelectHit(raycaster) : map_handler.selectHit(raycaster);
		}
	}

	const modeSelect = new Mode(
		() => {
			scope.addEventListener( 'pointerdown', selectMouseDown );
		},
		() => {
			scope.removeEventListener( 'pointerdown', selectMouseDown );
		}
	);

	const OPdblClick = function(event) {
		setMouse(event);
		raycaster.setFromCamera(mouse, camera);
		let point = map_handler.positionHit(raycaster);
		if(point) {
			orbit_controls.target.copy(point)
			orbit_controls.update();
		}
	}

	const modeOrbit = new Mode(
		() => {
			orbit_controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
			scope.addEventListener('dblclick', OPdblClick, false);
		},
		() => {
			scope.removeEventListener('dblclick', OPdblClick, false);
			orbit_controls.mouseButtons.LEFT = null;
		}
	);

	const modePan = new Mode(
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

	// let transcontrols = new TransformControls(camera, renderer.domElement);
	// scene.add(transcontrols);



	let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.01, 10, 10), new THREE.MeshLambertMaterial({color: 0x000000}));
		
	const getGizmoConstraint = function () {
		if(keyHeld.Digit1)
			return keyHeld.ShiftLeft ? gizmo.constrain.YZ : gizmo.constrain.X;

		if(keyHeld.Digit2)
			return keyHeld.ShiftLeft ? gizmo.constrain.XZ : gizmo.constrain.Y;

		if(keyHeld.Digit3)
			return keyHeld.ShiftLeft ? gizmo.constrain.XY : gizmo.constrain.Z;
	}

	const moveMouseDown = function(event) {
		setMouse(event);
		if(event.button == 0){
			raycaster.setFromCamera(mouse, camera);
			let p = gizmo.positionHit(raycaster, getGizmoConstraint());
			sphere.position.copy(p);
			scope.addEventListener( 'pointermove', moveMouseMove );
			scope.addEventListener( 'pointerup', moveMouseUp );
			
		}
	}

	const moveMouseMove = function(event) {
		setMouse(event);
			raycaster.setFromCamera(mouse, camera);
			let p = gizmo.positionHit(raycaster, getGizmoConstraint());
			sphere.position.copy(p);
	}

	const moveMouseUp = function(event) {
		scope.removeEventListener( 'pointermove', moveMouseMove );
		scope.removeEventListener( 'pointerup', moveMouseUp );

	}
	
	const modeMove = new Mode(
		() => {
			scene.add(sphere);
			scope.addEventListener( 'pointerdown', moveMouseDown );
		},
		() => {
			scene.remove(sphere);
		}
	);

	const addFaceSelectMouseDown = function(event) {
		setMouse(event);
		if(event.button == 0){
			raycaster.setFromCamera(mouse, camera);

			map_handler.toggleSelectHit(raycaster, {edges: true});
			map_handler.addFaceFromSelection();
		}
	}

	const modeAddFace = new Mode(
		() => {
			map_handler.deselectAll({vertices: true, faces:  true});
			map_handler.addFaceFromSelection();
			scope.addEventListener( 'pointerdown', addFaceSelectMouseDown );
		},
		() => {
			scope.removeEventListener( 'pointerdown', addFaceSelectMouseDown );
		}
	);

	const addEdgeSelectMouseDown = function(event) {
		setMouse(event);
		if(event.button == 0){
			raycaster.setFromCamera(mouse, camera);

			map_handler.toggleSelectHit(raycaster, {vertices: true});
			if(map_handler.hasSelection({vertices: true}) == 2){
				map_handler.addEdgeFromSelection();
			}
		}
	}

	const modeAddEdge = new Mode(
		() => {
			map_handler.deselectAll();
			scope.addEventListener( 'pointerdown', addEdgeSelectMouseDown );
		},
		() => {
			scope.removeEventListener( 'pointerdown', addEdgeSelectMouseDown );
		}
	);
	

	const defaultKeyDown = function(event){
		keyHeld[event.code] = true;
	};

	const defaultKeyUp = function(event){
		console.log(event.which, event.code, event.charCode);
		let nextMode = undefined;
		switch(event.code) {
			case "Escape": // deselect
				map_handler.deselectAll();
				break;
			case "Space": // select mode
				nextMode = modeSelect;
				break;
			case "Delete": // delete selection
				map_handler.deleteSelection();
				break;
			case "KeyA": // add vertices mode
				break;
			case "KeyC": // cut edge
				break;
			case "KeyE": // eraser
				break;
			case "KeyF": // create face
				nextMode = modeAddFace;
				break
			case "KeyL": // draw
				nextMode = modeAddEdge;
				break;
			case "Semicolon": // azerty -> "m" move
			case "KeyM":
				nextMode = modeMove;
				break;
			case "KeyO": // orbit
				nextMode = modeOrbit;
				break;
			case "KeyP": // pan
				nextMode = modePan;
				break;
		};

		if(nextMode) {
			if(activeMode) 
				activeMode.stop();
			activeMode = nextMode;
			activeMode.start();
		}

		keyHeld[event.code] = false;

	}

	scope.addEventListener("keydown", defaultKeyDown);
	scope.addEventListener("keyup", defaultKeyUp);
	activeMode = modeSelect;
	activeMode.start();

	return this;
})(renderer.domElement, map_handler);

window.event_handler = event_handler;
window.map_handler = map_handler;




function update ()
{
	gizmo.update(camera);
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
