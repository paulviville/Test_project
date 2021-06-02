import { CMap3 } from './CMapJS/CMap/CMap.js';
// import { Vector3 } from './CMapJS/Libs/three.module.js';
import * as THREE from './CMapJS/Libs/three.module.js';


export default function Grid3D (params = {}) {
	let { xmin = -1.2, xmax = 1.2, 
		ymin = -1.2, ymax = 1.2,
		zmin = -1.2, zmax = 1.2,
		xdivs = 20,	ydivs = 20, zdivs = 20 } = params;

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
	
	this.cellFace = function(wd, f) {
		return cellFaces[this.cell(this.volume, wd)][f]
	}

	this.cellEdge = function(wd, e) {
		return cellEdges[this.cell(this.volume, wd)][e]
	}

	this.cellVertex = function(wd, v) {
		return cellVertices[this.cell(this.volume, wd)][v]
	}

	this.getFace = function(i, j, k, f) {
		return this.cellFace(this.getCell(i, j, k), f);
	};

	this.getEdge = function(i, j, k, e) {
		return this.cellEdge(this.getCell(i, j, k), e);
	};

	this.getVertex = function(i, j, k, v) {
		return this.cellVertex(this.getCell(i, j, k), v);
	};

	
	(() => {
		const xstep = (xmax - xmin) / xdivs;
		const ystep = (ymax - ymin) / ydivs;
		const zstep = (zmax - zmin) / zdivs;
		
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

					const edges = [wd];
					edges[1] = this.phi([1, 2, 1], edges[0]);
					edges[2] = this.phi([1, 2, 1], edges[1]);
					edges[3] = this.phi([1, 2, 1], edges[2]);
					edges[4] = this.phi([1, 1, 2], edges[0]);
					edges[5] = this.phi1[edges[4]];
					edges[6] = this.phi1[edges[5]];
					edges[7] = this.phi1[edges[6]];
					edges[8] = this.phi_1[edges[0]];
					edges[9] = this.phi1[edges[0]];
					edges[10] = this.phi_1[edges[2]];
					edges[11] = this.phi1[edges[2]];

					// edges[] = this.phi1[];
					cellEdges[wid] = edges;

					const vertices = [wd];
					vertices[1] = this.phi1[vertices[0]];
					vertices[2] = this.phi([2, 1, 1, 2], vertices[0]);
					vertices[3] = this.phi1[vertices[2]];
					vertices[4] = this.phi_1[vertices[0]];
					vertices[5] = this.phi1[vertices[1]];
					vertices[6] = this.phi_1[vertices[2]];
					vertices[7] = this.phi1[vertices[3]];
					cellVertices[wid] = vertices;

					if(i > 0) {
						let fd1 = this.getFace(i - 1, j, k, 1);
						const fd3 = faces[3];
						let d3 = fd3
						do {
							d3 = this.phi1[d3];
							fd1 = this.phi_1[fd1];
							this.sewPhi3(d3, fd1);
						} while(d3 != fd3);
					}
					if(j > 0) {
						let fd2 = this.getFace(i, j - 1, k, 2);
						const fd0 = faces[0];
						let d0 = fd0
						do {
							d0 = this.phi1[d0];
							fd2 = this.phi_1[fd2];
							this.sewPhi3(d0, fd2);
						} while(d0 != fd0);
					}
					if(k > 0) {
						let fd5 = this.getFace(i, j, k - 1, 5);;
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
		this.close(true);
		this.setEmbeddings(this.vertex);
		const position = this.addAttribute(this.vertex, "position");
		this.debug();

		this.foreach(this.vertex, vd => {
			position[this.cell(this.vertex, vd)] = new THREE.Vector3;
		});

		let vd = this.getVertex(0, 0, 0, 0);
		position[this.cell(this.vertex, vd)] = new THREE.Vector3(xmin, ymin, zmin);

		for(let i = 0; i < xdivs; ++i) {
			const pos1 = new THREE.Vector3(xmin + xstep * (i + 1), ymin, zmin);
			position[this.cell(this.vertex, this.getVertex(i, 0, 0, 1))] = pos1;
		}

		for(let j = 0; j < ydivs; ++j) {
			position[this.cell(this.vertex, this.getVertex(0, j, 0, 3))] = new THREE.Vector3(xmin, ymin + ystep * (j + 1), zmin);
			for(let i = 0; i < xdivs; ++i) {
				const pos2 = new THREE.Vector3(xmin + xstep * (i + 1), ymin + ystep * (j + 1), zmin);
				position[this.cell(this.vertex, this.getVertex(i, j, 0, 2))] = pos2;
			}
		}

		for(let k = 0; k < zdivs; ++k) {
			let vd = this.getVertex(0, 0, k, 4);
			position[this.cell(this.vertex, vd)] = new THREE.Vector3(xmin, ymin, zmin + (k + 1) * zstep);

			for(let i = 0; i < xdivs; ++i) {
				const pos1 = new THREE.Vector3(xmin + xstep * (i + 1), ymin, zmin + (k + 1) * zstep);
				position[this.cell(this.vertex, this.getVertex(i, 0, k, 5))] = pos1;
			}

			for(let j = 0; j < ydivs; ++j) {
				position[this.cell(this.vertex, this.getVertex(0, j, k, 7))] = new THREE.Vector3(xmin, ymin + ystep * (j + 1), zmin + (k + 1) * zstep);
				for(let i = 0; i < xdivs; ++i) {
					const pos2 = new THREE.Vector3(xmin + xstep * (i + 1), ymin + ystep * (j + 1), zmin + (k + 1) * zstep);
					position[this.cell(this.vertex, this.getVertex(i, j, k, 6))] = pos2;
				}
			}
		}
	})();
};