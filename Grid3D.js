import { CMap3 } from './CMapJS/CMap/CMap.js';
// import { Vector3 } from './CMapJS/Libs/three.module.js';
import * as THREE from './CMapJS/Libs/three.module.js';


export default function Grid3D (params = {}) {
	let { xmin = -1, xmax = 1, 
		ymin = -1, ymax = 1,
		zmin = -1, zmax = 1,
		xdivs = 2,	ydivs = 2, zdivs = 2 } = params;

	CMap3.call(this);

	const grid = new Array(xdivs * ydivs * zdivs);

	const hash = (i, j, k) =>  {return i + (j + k * zdivs) * ydivs};

	this.getCell = function (i, j, k) {
		return grid[hash(i, j, k)];
	};

	this.createEmbedding(this.volume);
	const cellVertices = this.addAttribute(this.volume, "cellVertices");
	const cellEdges = this.addAttribute(this.volume, "cellEdges");
	const cellFaces = this.addAttribute(this.volume, "cellFaces");
	
	this.getFace = function(i, j, k, f) {

	};

	for(let k = 0; k < zdivs; ++k) {
		for(let j = 0; j < ydivs; ++j) {
			for(let i = 0; i < xdivs; ++i) {
				const wd = this.addPrism(4);
				const wid = this.cell(this.volume, wd);
				grid[hash(i, j, k)] = wd;

				const faces = [wd]
				faces[1] = this.phi([1, 2, 1], faces[0]);
				faces[2] = this.phi([1, 2, 1], faces[1]);
				faces[3] = this.phi([1, 2, 1], faces[2]);
				faces[4] = this.phi2[faces[0]];
				faces[5] = this.phi([1, 1, 2], faces[0]);
				cellFaces[wid] = faces;

				if(i > 0) {
					let fd1 = cellFaces[this.cell(this.volume, this.getCell(i - 1, j, k))][1];
					const fd3 = faces[3];
					let d3 = fd3
					do {
						d3 = this.phi1[d3];
						fd1 = this.phi_1[fd1];
						this.sewPhi3(d3, fd1);
					} while(d3 != fd3);
				}
				if(j > 0) {
					let fd2 = cellFaces[this.cell(this.volume, this.getCell(i, j - 1, k))][2];
					const fd0 = faces[0];
					let d0 = fd0
					do {
						d0 = this.phi1[d0];
						fd2 = this.phi_1[fd2];
						this.sewPhi3(d0, fd2);
					} while(d0 != fd0);
				}
				if(k > 0) {
					let fd5 = cellFaces[this.cell(this.volume, this.getCell(i, j, k - 1))][5];
					const fd4 = faces[4];
					let d4 = fd4
					do {
						d4 = this.phi1[d4];
						fd5 = this.phi_1[fd5];
						this.sewPhi3(d4, fd5);
					} while(d4 != fd4);
				}
			}
		}	
	}
	this.close();
	this.debug();
};