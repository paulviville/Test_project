import {CMap2} from './CMapJS/CMap/CMap.js';
import Renderer from './CMapJS/Rendering/Renderer.js';
import * as THREE from './CMapJS/Libs/three.module.js';




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



function Grid2D (params = {}) {
	let { xmin = -1, xmax = 1, 
		ymin = -1, ymax = 1,
		xdivs = 10,	ydivs = 10 } = params;
	console.log(xmin, xmax, ymin, ymax, xdivs, ydivs);

	const map = new CMap2;
	const grid = new Array(xdivs * ydivs);
	
	this.getCell = function (i, j) {
		return grid[j + i * xdivs];
	};

	this.getVertex = function (i, j, v) {
		let vd;
		const d = getCell(i, j);
		switch(v) {
			case 1:
				vd = map.phi1[d];
				break;
			case 2:
				vd = map.phi1[map.phi1[d]];
				break;
			case 3:
				vd = map.phi_1[d];
				break;
			default:
				vd = d;
		}
		return vd
	};

	this.getEdge = this.getVertex;

	function initGrid() {
		for(let i = 0; i < ydivs; ++i) {
			for(let j = 0; j < xdivs; ++j) {
				grid[j + i * xdivs] = map.addFace1(4);		
			}
		}
	}
	
	const extrudeMouseDown = function(event) {
		setMouse(event);
		map_handler.deselectAll();
		if(event.button == 0){
			raycaster.setFromCamera(mouse, camera);

			let vertexHit = map_handler.selectHit(raycaster, {vertices: true});
			if(vertexHit) {
				let vid0 = vertexHit.instanceId;
				console.log(vertexHit)
				let vid1 = map_handler.addVertex(vertexHit.point);
				map_handler.selectVertex(vid1);
				map_handler.addEdgeFromSelection();
				map_handler.selectVertex(vid1);
				moveMouseDown(event);
				return;
			}

			let edgeHit = map_handler.selectHit(raycaster, {edges: true});
			if(edgeHit) {
				let eid0 = edgeHit.instanceId;
				let eid1 = map_handler.extrudeEdge(eid0);
				map_handler.deselectEdge(eid0);
				map_handler.deselectAll();
				map_handler.selectEdge(eid1);
				moveMouseDown(event);

			}
		}
	}
	const modeExtrude = new Mode(
		() => {
			map_handler.deselectAll();
			scope.addEventListener( 'pointerdown', extrudeMouseDown );
		},
		() => {
			scope.removeEventListener( 'pointerdown', extrudeMouseDown );
		},
	);


	
	const cutEdgeMouseDown = function(event) {
		setMouse(event);
		map_handler.deselectAll();
		if(event.button == 0){
			raycaster.setFromCamera(mouse, camera);

			let edgeHit = map_handler.selectHit(raycaster, {edges: true});
			if(edgeHit) {
				let eid0 = edgeHit.instanceId;
				let vid = map_handler.cutEdge(eid0, edgeHit.point)
				map_handler.deselectAll();
				map_handler.selectVertex(vid);
				moveMouseDown(event);
				// sphereEdge.position.copy(map_handler.edgePoint(edgeHit.point, eid0));
			}
		}
	}
	const modeCutEdge = new Mode(
		() => {
			map_handler.deselectAll();
			scope.addEventListener( 'pointerdown', cutEdgeMouseDown );
		},
		() => {
			scope.removeEventListener( 'pointerdown', cutEdgeMouseDown );
		},
	);



	map.close();
	console.log(map.nbCells(map.face));
}


window.Grid2D = Grid2D;





function update ()
{

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

