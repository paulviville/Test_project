import {CMap1, CMap2, Graph} from './CMapJS/CMap/CMap.js';
import Renderer from './CMapJS/Rendering/Renderer.js';
import * as THREE from './CMapJS/Libs/three.module.js';
import { OrbitControls } from './CMapJS/Libs/OrbitsControls.js';




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



function Grid2D (params = {}) {
	let { xmin = -1, xmax = 1, 
		ymin = -1, ymax = 1,
		xdivs = 10,	ydivs = 10 } = params;

	CMap2.call(this);

	const grid = new Array(xdivs * ydivs);

	this.getCell = function (i, j) {
		return grid[i + j * xdivs];
	};

	this.getVertex = function (i, j, v) {
		let vd;
		const d = this.getCell(i, j);
		switch(v) {
			case 1:
				vd = this.phi1[d];
				break;
			case 2:
				vd = this.phi1[this.phi1[d]];
				break;
			case 3:
				vd = this.phi_1[d];
				break;
			default:
				vd = d;
		}
		return vd
	};

	this.getEdge = this.getVertex;

	this.initGrid = function () {
		const xstep = (xmax - xmin) / xdivs;
		const ystep = (ymax - ymin) / ydivs;

		for(let i = 0; i < ydivs; ++i) {
			for(let j = 0; j < xdivs; ++j) {
				const fd00 = this.addFace1(4);
				grid[j + i * xdivs] = fd00;
				if(j > 0) {
					const ed00 = this.getEdge(j, i, 3);
					const ed10 = this.getEdge(j - 1, i, 1);
					this.sewPhi2(ed00, ed10);
				}
				if(i > 0) {
					const ed00 = this.getEdge(j, i, 0);
					const ed10 = this.getEdge(j, i - 1, 2);
					this.sewPhi2(ed00, ed10);
				}
			}
		}

		this.close(true);
		this.setEmbeddings(this.vertex);
		const position = this.addAttribute(this.vertex, "position");

		let vd = this.getVertex(0, 0, 0);
		position[this.cell(this.vertex, vd)] = new THREE.Vector3(xmin, ymin, 0);

		for(let j = 0; j < xdivs; ++j) {
			const pos1 = new THREE.Vector3(xmin + xstep * (j + 1), ymin, 0);
			position[this.cell(this.vertex, this.getVertex(j, 0, 1))] = pos1;
		}

		for(let i = 0; i < ydivs; ++i) {
			position[this.cell(this.vertex, this.getVertex(0, i, 3))] = new THREE.Vector3(xmin, ymin + ystep * (i+1), 0);
			for(let j = 0; j < xdivs; ++j) {
				const pos2 = new THREE.Vector3(xmin + xstep * (j+1), ymin + xstep * (i+1), 0);
				position[this.cell(this.vertex, this.getVertex(j, i, 2))] = pos2;
			}
		}
	}

	this.initGrid();

	return this;
}

window.Grid2D = Grid2D;

let grid = new Grid2D;

const vertexValue = grid.addAttribute(grid.vertex, "value");
const vertexPos = grid.getAttribute(grid.vertex, "position");

const radius = 0.5;
function circleVal(pos) {
	return pos.x * pos.x + pos.y * pos.y - radius * radius;
}

grid.foreach(grid.vertex, vd => {
	let vpos = vertexPos[grid.cell(grid.vertex, vd)];
	// vertexValue[grid.cell(grid.vertex, vd)] = circleVal(vpos);
	vertexValue[grid.cell(grid.vertex, vd)] = -1;
	// vertexValue[grid.cell(grid.vertex, vd)] = Math.pow(-1, ((vpos.x * vpos.y) > 0 ));
});


let gridRenderer = new Renderer(grid);
gridRenderer.vertices.create({size: 0.025});
gridRenderer.vertices.addTo(scene);
gridRenderer.edges.create({size: 2});
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
	graphRenderer.vertices.create()
	graphRenderer.vertices.addTo(scene)
}
window.evaluate = evaluate;

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

