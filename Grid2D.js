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