import {CMap1, CMap2, Graph} from './CMapJS/CMap/CMap.js';
import Renderer from './CMapJS/Rendering/Renderer.js';
import * as THREE from './CMapJS/Libs/three.module.js';
import { OrbitControls } from './CMapJS/Libs/OrbitsControls.js';
import Grid2D from './Grid2D.js';
import Grid3D from './Grid3D.js';




const scene = new THREE.Scene();
scene.background = new THREE.Color(0xAAAAAA);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);
camera.position.set(0, 0, 2);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enablePan = false;

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

let grid3d = new Grid2D;
window.grid3d = grid3d;

let grid = new Grid3D;

const vertexValue = grid.addAttribute(grid.vertex, "value");
const vertexPos = grid.getAttribute(grid.vertex, "position");

const aRadius = 0.7;
const bRadius = 0.07;
function torusVal(pos) {
	return Math.pow(
		Math.pow(pos.x*pos.x+pos.y*pos.y, 2)
			+pos.x*(pos.x*pos.x-3*pos.y*pos.y),2) + pos.z * pos.z - 0.08;
	// return (Math.sqrt(pos.x*pos.x + pos.y*pos.y ))
}

let pow = Math.pow;

function tangleVal(pos) {
	pos = pos.clone().multiplyScalar(2);
	return pow(pos.x, 4) - 5*pow(pos.x, 2) + pow(pos.y, 4) - 5*pow(pos.y, 2)
	 + pow(pos.z, 4) - 5*pow(pos.z, 2) + 11.8;
}
/// http://www-sop.inria.fr/galaad/surface/

const radius = 0.85;
function circleVal(pos) {
	return pos.x * pos.x + pos.y * pos.y - radius * radius;
}

function sphereVal(pos) {
	return pos.x * pos.x + pos.y * pos.y + pos.z * pos.z - radius * radius;
}

grid.foreach(grid.vertex, vd => {
	let vpos = vertexPos[grid.cell(grid.vertex, vd)];
	vertexValue[grid.cell(grid.vertex, vd)] = tangleVal(vpos);
	// vertexValue[grid.cell(grid.vertex, vd)] = circleVal(vpos);
	// vertexValue[grid.cell(grid.vertex, vd)] = -1;
	// vertexValue[grid.cell(grid.vertex, vd)] = Math.pow(-1, ((vpos.x * vpos.y) > 0 ));
});




let gridRenderer = new Renderer(grid);
gridRenderer.vertices.create({size: 0.00625});
gridRenderer.vertices.addTo(scene);
gridRenderer.edges.create({size: 0.75});
gridRenderer.edges.addTo(scene);

const vertexPosColor = new THREE.Color(0x00FF00);
const vertexNegColor = new THREE.Color(0xFF0000);

const vertexIId = grid.getAttribute(grid.vertex, "instanceId");

grid.foreach(grid.vertex, vd => {
	const viid = vertexIId[grid.cell(grid.vertex, vd)];
	const val = vertexValue[grid.cell(grid.vertex, vd)];
	// gridRenderer.vertices.mesh.setColorAt(viid, val > 0 ? vertexPosColor : vertexNegColor);
	gridRenderer.vertices.mesh.setColorAt(viid, val > 0 ? vertexPosColor : vertexNegColor);
});
gridRenderer.vertices.mesh.instanceColor.needsUpdate = true;


function toggleVertexVal(vd) {
	vertexValue[grid.cell(grid.vertex, vd)] *= -1;
	const viid = vertexIId[grid.cell(grid.vertex, vd)];
	gridRenderer.vertices.mesh.setColorAt(viid, vertexValue[grid.cell(grid.vertex, vd)] > 0 ? vertexPosColor : vertexNegColor);
	gridRenderer.vertices.mesh.instanceColor.needsUpdate = true;
}

window.toggleVertexVal = toggleVertexVal;

const raycaster = new THREE.Raycaster;
const mouse = new THREE.Vector2;

function setMouse(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

const selectMouseDown = function(event) {
	setMouse(event);
	if(event.button == 2){
		raycaster.setFromCamera(mouse, camera);
		const inter = raycaster.intersectObject(gridRenderer.vertices.mesh)[0];
		console.log(inter);
		if(inter) {
			let viid = inter.instanceId;
			let vd = gridRenderer.vertices.mesh.vd[viid];
			toggleVertexVal(vd);
		}
	}
}
window.addEventListener( 'pointerdown', selectMouseDown );

const graph = new Graph;
graph.createEmbedding(graph.vertex);
const gPos = graph.addAttribute(graph.vertex, "position");

function evaluate() {
	grid.foreach(grid.face, fd => {
		if(!grid.isBoundary(fd)){
			let inversion = 0;
			grid.foreachIncident(grid.vertex, grid.face, fd, vd => {
				if(vertexValue[grid.cell(grid.vertex, vd)] > 0)
					++inversion; 
			});
			if(inversion != 0 && inversion != 4){
				const gv = graph.addVertex();
				const pos = new THREE.Vector3;
				grid.foreachIncident(grid.vertex, grid.face, fd, vd => {
					pos.add(vertexPos[grid.cell(grid.vertex, vd)]);
				});
				pos.divideScalar(4);
				gPos[graph.cell(graph.vertex, gv)] = pos;
			}
		}
	});

	const graphRenderer = new Renderer(graph);
	graphRenderer.vertices.create({size: 0.05, color: new THREE.Color(0x0000FF)})
	graphRenderer.vertices.addTo(scene)
}
function evaluate3() {
	grid.foreach(grid.volume, wd => {
		if(!grid.isBoundary(wd)){
			let inversion = 0;
			grid.foreachIncident(grid.vertex, grid.volume, wd, vd => {
				if(vertexValue[grid.cell(grid.vertex, vd)] > 0)
					++inversion; 
			});
			if(inversion != 0 && inversion != 8){
				const gv = graph.addVertex();
				const pos = new THREE.Vector3;
				grid.foreachIncident(grid.vertex, grid.volume, wd, vd => {
					pos.add(vertexPos[grid.cell(grid.vertex, vd)]);
				});
				pos.divideScalar(8);
				gPos[graph.cell(graph.vertex, gv)] = pos;
			}
		}
	});

	const graphRenderer = new Renderer(graph);
	graphRenderer.vertices.create({size: 0.05, color: new THREE.Color(0x0000FF)})
	graphRenderer.vertices.addTo(scene)
}
window.evaluate = evaluate;
window.evaluate3 = evaluate3;

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

