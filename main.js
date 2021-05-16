import {CMap2} from './CMapJS/CMap/CMap.js';
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
const orbit_controls = new OrbitControls(camera, renderer.domElement)

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

	const map = new CMap2;
	const grid = new Array(xdivs * ydivs);
	
	
	this.getMap = function () {
		return map;
	};

	this.getCell = function (i, j) {
		return grid[i + j * xdivs];
	};

	this.getVertex = function (i, j, v) {
		let vd;
		const d = this.getCell(i, j);
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

	this.initGrid = function () {
		const xstep = (xmax - xmin) / xdivs;
		const ystep = (ymax - ymin) / ydivs;

		for(let i = 0; i < ydivs; ++i) {
			for(let j = 0; j < xdivs; ++j) {
				const fd00 = map.addFace1(4);
				grid[j + i * xdivs] = fd00;
				if(j > 0) {
					const ed00 = this.getEdge(j, i, 3);
					const ed10 = this.getEdge(j - 1, i, 1);
					map.sew_phi2(ed00, ed10);
				}
				if(i > 0) {
					const ed00 = this.getEdge(j, i, 0);
					const ed10 = this.getEdge(j, i - 1, 2);
					map.sew_phi2(ed00, ed10);
				}
			}
		}

		map.close();
		map.setEmbeddings(map.vertex);
		const position = map.addAttribute(map.vertex, "position");

		let vd = this.getVertex(0, 0, 0);
		position[map.cell(map.vertex, vd)] = new THREE.Vector3(xmin, ymin, 0);

		for(let j = 0; j < xdivs; ++j) {
			const pos1 = new THREE.Vector3(xmin + xstep * (j + 1), ymin, 0);
			position[map.cell(map.vertex, this.getVertex(j, 0, 1))] = pos1;
		}

		for(let i = 0; i < ydivs; ++i) {
			position[map.cell(map.vertex, this.getVertex(0, i, 3))] = new THREE.Vector3(xmin, ymin + ystep * (i+1), 0);
			for(let j = 0; j < xdivs; ++j) {
				const pos2 = new THREE.Vector3(xmin + xstep * (j+1), ymin + xstep * (i+1), 0);
				position[map.cell(map.vertex, this.getVertex(j, i, 2))] = pos2;
			}
		}



		map.foreach(map.vertex, vd => {console.log(map.cell(map.vertex, vd), position[map.cell(map.vertex, vd)])});
		console.log(map.nbCells(map.vertex), map.nbCells(map.edge), map.nbCells(map.face));
	}

	this.initGrid();

	return this;
}


window.Grid2D = Grid2D;

let g = new Grid2D;
let gridRenderer = new Renderer(g.getMap());
gridRenderer.vertices.create({size: 0.025});
gridRenderer.vertices.addTo(scene);
gridRenderer.edges.create({size: 2});
gridRenderer.edges.addTo(scene);


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

