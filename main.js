import {CMap1, CMap2, Graph} from './CMapJS/CMap/CMap.js';
import Renderer from './CMapJS/Rendering/Renderer.js';
import * as THREE from './CMapJS/Libs/three.module.js';
import { OrbitControls } from './CMapJS/Libs/OrbitsControls.js';
import Grid2D from './Grid2D.js';
import Grid3D from './Grid3D.js';
import {MCLookUpTable} from './MCLookup.js';
import { exportCmap2, loadCMap2 } from './CMapJS/IO/Surface_Formats/CMap2IO.js';
import { octahedron_off, tetrahedron_off} from './off_files.js'


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

// let grid3d = new Grid2D;
// window.grid3d = grid3d;

let grid = new Grid3D;
window.grid = grid;

const vertexValue = grid.addAttribute(grid.vertex, "value");
const vertexPos = grid.getAttribute(grid.vertex, "position");

const bRadius = 0.3;
const aRadius = 0.65;
let pow = Math.pow;
let sqrt = Math.sqrt;
function torusVal(pos) {

	// return Math.pow(
	// 	Math.pow(pos.x*pos.x+pos.y*pos.y, 2)
	// 		+pos.x*(pos.x*pos.x-3*pos.y*pos.y),2) + pos.z * pos.z - 0.08;
	return (pow(aRadius - sqrt(pos.x*pos.x + pos.y*pos.y), 2) + pow(pos.z, 2) - bRadius * bRadius)
}

// function gumdropVal(pos) {
	// pos = pos.clone().multiplyScalar(2);
	// return 4 * pow(pos.x, 4) + 4 * pow(pos.y, 4) + 8 * pow(pos.y,2)
	// * pow(pos.z, 2) + 4 * pow(pos.z, 4) + 17 * pow(pos.x, 2) 
	// * pow(pos.y, 2) + 17 * pow(pos.x, 2) * pow(pos.z, 2) - 20 
	// * pow(pos.x, 2) - 20 * pow(pos.y, 2) - 20 * pow(pos.z, 2) + 17;
// }

const gumdropVal = new Function("pos", 
`pos = pos.clone().multiplyScalar(2);
return 4 * Math.pow(pos.x, 4) + 4 * Math.pow(pos.y, 4) + 8 * Math.pow(pos.y,2)
* Math.pow(pos.z, 2) + 4 * Math.pow(pos.z, 4) + 17 * Math.pow(pos.x, 2) 
* Math.pow(pos.y, 2) + 17 * Math.pow(pos.x, 2) * Math.pow(pos.z, 2) - 20 
* Math.pow(pos.x, 2) - 20 * Math.pow(pos.y, 2) - 20 * Math.pow(pos.z, 2) + 17;`
);

function tangleVal(pos) {
	pos = pos.clone().multiplyScalar(2);
	return (pow(pos.x, 4) - 5*pow(pos.x, 2) + pow(pos.y, 4) - 5*pow(pos.y, 2)
	 + pow(pos.z, 4) - 5*pow(pos.z, 2) + 11.8);
}
/// http://www-sop.inria.fr/galaad/surface/

const radius = 0.5;
function circleVal(pos) {
	return pos.x * pos.x + pos.y * pos.y - radius * radius;
}

function sphereVal(pos) {
	return pos.x * pos.x + pos.y * pos.y + pos.z * pos.z - radius * radius;
}

grid.foreach(grid.vertex, vd => {
	let vpos = vertexPos[grid.cell(grid.vertex, vd)];
	// vertexValue[grid.cell(grid.vertex, vd)] = tangleVal(vpos)*sphereVal(vpos);
	vertexValue[grid.cell(grid.vertex, vd)] = gumdropVal(vpos);
	// vertexValue[grid.cell(grid.vertex, vd)] = -1;
	// vertexValue[grid.cell(grid.vertex, vd)] = Math.pow(-1, ((vpos.x * vpos.y) > 0 ));
});




let gridRenderer = new Renderer(grid);
gridRenderer.vertices.create({size: 0.00625, color: new THREE.Color(0xFFFF00)});
gridRenderer.vertices.addTo(scene);
gridRenderer.edges.create({size: 0.75});
// gridRenderer.edges.addTo(scene);

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
	graphRenderer.vertices.create({size: 0.5, color: new THREE.Color(0x0000FF)})
	graphRenderer.vertices.addTo(scene)
}
window.evaluate = evaluate;
window.evaluate3 = evaluate3;

const MSLookUpTable = {
	0: [],
	1: [0, 3],
	2: [1, 0],
	3: [1, 3],
	4: [2, 1],
	5: [0, 1, 2, 3],
	6: [2, 0],
	7: [2, 3],
	8: [3, 2],
	9: [0, 2],
	10: [3, 0, 1, 2],
	11: [1, 2],
	12: [3, 1],
	13: [0, 1],
	14: [3, 0],
	15: []
}

function marchingSquare(grid) {
	const vertex = grid.vertex;
	const edge = grid.edge;
	const face = grid.face;
	
	grid.foreach(edge, ed => {
		let signChange = 0;
		grid.foreachIncident(vertex, edge, ed, vd => {
			signChange += (vertexValue[grid.cell(vertex, vd)] > 0 ? 1 : 0);
		});
		if(signChange % 2) {
			const pos = vertexPos[grid.cell(vertex, ed)].clone();
			pos.add(vertexPos[grid.cell(vertex, grid.phi2[ed])]);
			pos.divideScalar(2);
			let gv = graph.addVertex();
			gPos[graph.cell(graph.vertex, gv)] = pos;
		}
	});


	const graphRenderer = new Renderer(graph);
	graphRenderer.vertices.create({size: 0.025, color: new THREE.Color(0x0000FF)})
	graphRenderer.edges.create({size: 0.5})
	graphRenderer.vertices.addTo(scene)
	graphRenderer.edges.addTo(scene)
}
let abs = Math.abs;

// function marchingSquare(grid) {
// 	const vertex = grid.vertex;
// 	const edge = grid.edge;
// 	const face = grid.face;
	
// 	grid.foreach(edge, ed => {
// 		let signChange = 0;
// 		grid.foreachIncident(vertex, edge, ed, vd => {
// 			signChange += (vertexValue[grid.cell(vertex, vd)] > 0 ? 1 : 0);
// 		});

// 		if(signChange % 2) {
// 			let a = abs(vertexValue[grid.cell(vertex, ed)])
// 			let b = abs(vertexValue[grid.cell(vertex, grid.phi2[ed])])
// 			let ratio = a /(a + b)
// 			const pos = vertexPos[grid.cell(vertex, ed)].clone().multiplyScalar(b);
// 			pos.addScaledVector(vertexPos[grid.cell(vertex, grid.phi2[ed])], a);
// 			pos.divideScalar(a + b);


// 			let gv = graph.addVertex();
// 			gPos[graph.cell(graph.vertex, gv)] = pos;
// 		}
// 	});


// 	const graphRenderer = new Renderer(graph);
// 	graphRenderer.vertices.create({size: 0.0125, color: new THREE.Color(0x0000FF)})
// 	graphRenderer.edges.create({size: 0.5})
// 	graphRenderer.vertices.addTo(scene)
// 	graphRenderer.edges.addTo(scene)
// }

// function marchingSquare(grid) {
// 	const vertex = grid.vertex;
// 	const edge = grid.edge;
// 	const face = grid.face;
	
// 	const edgeVertex = grid.addAttribute(edge, "edgeVertex");

// 	grid.foreach(edge, ed => {
// 		let signChange = 0;
// 		grid.foreachIncident(vertex, edge, ed, vd => {
// 			signChange += (vertexValue[grid.cell(vertex, vd)] > 0 ? 1 : 0);
// 		});

// 		if(signChange % 2) {
// 			let a = abs(vertexValue[grid.cell(vertex, ed)])
// 			let b = abs(vertexValue[grid.cell(vertex, grid.phi2[ed])])
// 			const pos = vertexPos[grid.cell(vertex, ed)].clone().multiplyScalar(b);
// 			pos.addScaledVector(vertexPos[grid.cell(vertex, grid.phi2[ed])], a);
// 			pos.divideScalar(a + b);

// 			let gv = graph.addVertex();
// 			edgeVertex[grid.cell(edge, ed)] = gv;
// 			gPos[graph.cell(graph.vertex, gv)] = pos;
// 		}
// 	});

// 	grid.foreach(face, fd => {
// 		if(grid.isBoundary(fd))
// 			return;
// 		let caseId = 0;
// 		for(let i = 0; i < 4; ++i) {
// 			const value = vertexValue[grid.cell(vertex, grid.cellVertex(fd, 3 - i))];
// 			caseId <<= 1;
// 			caseId |= (value >= 0 ? 1 : 0);
// 		}
// 		const edges = MSLookUpTable[caseId];
// 		for(let i = 0; i < edges.length; i += 2) {
// 			const v0 = edgeVertex[(grid.cell(edge, grid.cellEdge(fd, edges[i])))];
// 			const v1 = edgeVertex[(grid.cell(edge, grid.cellEdge(fd, edges[i + 1])))];
// 			graph.connectVertices(v0, v1);
// 		}
// 	});
// 	edgeVertex.delete();

// 	const graphRenderer = new Renderer(graph);
// 	graphRenderer.vertices.create({size: 0.0125, color: new THREE.Color(0x0000FF)})
// 	graphRenderer.edges.create({size: 0.5})
// 	graphRenderer.vertices.addTo(scene)
// 	graphRenderer.edges.addTo(scene)
// }


window.marchingSquare = marchingSquare;


function marchingCube(grid) {
	const vertex = grid.vertex;
	const edge = grid.edge;
	const face = grid.face;
	const volume = grid.volume;
	
	const edgeVertex = grid.addAttribute(edge, "edgeVertex");
	
	const cmap = new CMap2;
	const position = cmap.addAttribute(cmap.vertex, "position");
	const dartPerVertex = cmap.addAttribute(cmap.vertex, "dartPerVertex");

	grid.foreach(edge, ed => {
		let signChange = 0;
		grid.foreachIncident(vertex, edge, ed, vd => {
			signChange += (vertexValue[grid.cell(vertex, vd)] > 0 ? 1 : 0);
		});

		if(signChange % 2) {
			let a = abs(vertexValue[grid.cell(vertex, ed)])
			let b = abs(vertexValue[grid.cell(vertex, grid.phi2[ed])])
			const pos = vertexPos[grid.cell(vertex, ed)].clone().multiplyScalar(b);
			pos.addScaledVector(vertexPos[grid.cell(vertex, grid.phi2[ed])], a);
			pos.divideScalar(a + b);

			// const pos = vertexPos[grid.cell(vertex, ed)].clone();
			// pos.addScaledVector(vertexPos[grid.cell(vertex, grid.phi2[ed])], 1);
			// pos.divideScalar(2);
			
			let vid = cmap.newCell(cmap.vertex);
			edgeVertex[grid.cell(edge, ed)] = vid;

			position[vid] = pos;
			dartPerVertex[vid] = [];
		}
	});

	cmap.createEmbedding(cmap.vertex);

	grid.foreach(volume, wd => {
		if(grid.isBoundary(wd))
			return;

		let caseId = 0;
		for(let i = 0; i < 8; ++i) {
			const value = vertexValue[grid.cell(vertex, grid.cellVertex(wd, 7 - i))];
			caseId <<= 1;
			caseId |= (value >= 0 ? 1 : 0);
		}
		const edges = MCLookUpTable[caseId];
		for(let i = 0; i < edges.length; i += 3) {
			const vid0 = edgeVertex[(grid.cell(edge, grid.cellEdge(wd, edges[i])))];
			const vid1 = edgeVertex[(grid.cell(edge, grid.cellEdge(wd, edges[i + 1])))];
			const vid2 = edgeVertex[(grid.cell(edge, grid.cellEdge(wd, edges[i + 2])))];
			
			const fd = cmap.addFace(3, false);

			cmap.setEmbedding(cmap.vertex, fd, vid0);
			cmap.setEmbedding(cmap.vertex, cmap.phi1[fd], vid1);
			cmap.setEmbedding(cmap.vertex, cmap.phi_1[fd], vid2);

			dartPerVertex[vid0].push(fd);
			dartPerVertex[vid1].push(cmap.phi1[fd]);
			dartPerVertex[vid2].push(cmap.phi_1[fd]);
		}
	});

	let v0;
	cmap.foreachDart(d0 => {
		v0 = cmap.cell(cmap.vertex, d0);
		dartPerVertex[cmap.cell(cmap.vertex, cmap.phi1[d0])].forEach(d1 => {
			if(cmap.cell(cmap.vertex, cmap.phi1[d1]) == v0){
				cmap.sewPhi2(d0, d1);
			}
		});
	});

	edgeVertex.delete();
	cmap.close();

	const graphRenderer = new Renderer(cmap);
	graphRenderer.vertices.create({size: 0.0125, color: new THREE.Color(0x0000FF)})
	graphRenderer.edges.create({size: 0.25})
	// graphRenderer.vertices.addTo(scene)
	graphRenderer.edges.addTo(scene)
	graphRenderer.faces.create()
	gridRenderer.vertices.remove();
graphRenderer.faces.addTo(scene) 
}
window.marchingCube = marchingCube;

// let rendererr= new Renderer(loadCMap2("off", octahedron_off)).faces.create().addTo(scene);

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

