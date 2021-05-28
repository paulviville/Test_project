import { CMap2 } from './CMapJS/CMap/CMap.js';
// import { Vector3 } from './CMapJS/Libs/three.module.js';
import * as THREE from './CMapJS/Libs/three.module.js';

export default function Grid2D (params = {}) {
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

		for(let j = 0; j < ydivs; ++j) {
			for(let i = 0; i < xdivs; ++i) {
				const fd00 = this.addFace1(4);
				grid[i + j * xdivs] = fd00;
				if(i > 0) {
					const ed00 = this.getEdge(i, j, 3);
					const ed10 = this.getEdge(i - 1, j, 1);
					this.sewPhi2(ed00, ed10);
				}
				if(j > 0) {
					const ed00 = this.getEdge(i, j, 0);
					const ed10 = this.getEdge(i, j - 1, 2);
					this.sewPhi2(ed00, ed10);
				}
			}
		}

		this.close(true);
		this.setEmbeddings(this.vertex);
		const position = this.addAttribute(this.vertex, "position");

		let vd = this.getVertex(0, 0, 0);
		position[this.cell(this.vertex, vd)] = new THREE.Vector3(xmin, ymin, 0);

		for(let i = 0; i < xdivs; ++i) {
			const pos1 = new THREE.Vector3(xmin + xstep * (i + 1), ymin, 0);
			position[this.cell(this.vertex, this.getVertex(i, 0, 1))] = pos1;
		}

		for(let j = 0; j < ydivs; ++j) {
			position[this.cell(this.vertex, this.getVertex(0, j, 3))] = new THREE.Vector3(xmin, ymin + ystep * (j+1), 0);
			for(let i = 0; i < xdivs; ++i) {
				const pos2 = new THREE.Vector3(xmin + xstep * (i + 1), ymin + xstep * (j + 1), 0);
				position[this.cell(this.vertex, this.getVertex(i, j, 2))] = pos2;
			}
		}
	}

	this.initGrid();

	return this;
}