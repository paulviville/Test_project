import * as THREE from './CMapJS/Dependencies/three.module.js';
import Renderer from './CMapJS/Rendering/Renderer.js';


function MeshHandler (mesh, params = {}) {
	const vertex = mesh.vertex;
	const edge = mesh.edge;
	// const face = mesh.face;

	const renderer = new Renderer(mesh);
	const position = mesh.get_attribute(vertex, "position");
	const saved_position = mesh.add_attribute(vertex, "saved_position");

	const vertex_color = params.vertex_color || new THREE.Color(0xFF0000);
	const vertex_select_color = params.vertex_select_color || new THREE.Color(0x00FF00);
	const edge_color = params.edge_color || new THREE.Color(0x0000DD);
	const edge_select_color = params.edge_select_color || new THREE.Color(0x00FF00);
	const face_color = params.face_color || new THREE.Color(0x339999);
	const face_select_color = params.face_select_color || new THREE.Color(0x00FF00);

	const selectedVertices = new Set;
	const selectedEdges = new Set;
	const selectedFaces = new Set;
	const selection_vertices = new Set;

	let parentObject;
	let verticesMesh, edgesMesh, facesMesh;
	this.initialize = function (params = {}) {
		if(params.vertices) {
			renderer.vertices.create({size: 0.0015625 * 6, color: vertex_color}); 
			verticesMesh = renderer.vertices.mesh;
		}
		if(params.edges) {
			renderer.edges.create({size: 1, color: edge_color}); 
			edgesMesh = renderer.edges.mesh;
		}
		if(params.faces) {
			renderer.faces.create({color: face_color, side: THREE.DoubleSide}); 
			facesMesh = renderer.faces.mesh;
		}
	};

	this.addMeshesTo = function (parent) {
		parentObject = parentObject || parent;
		if(verticesMesh) renderer.vertices.addTo(parent);
		if(edgesMesh) renderer.edges.addTo(parent);
		if(facesMesh) renderer.faces.addTo(parent);
	}


	this.updateVertices = function() {
		renderer.vertices.update();
		verticesMesh = renderer.vertices.mesh;
	};

	this.updateEdges = function() {
		renderer.edges.update();
		edgesMesh = renderer.edges.mesh;
	};

	this.updateFaces = function() {
		renderer.faces.update();
		facesMesh = renderer.faces.mesh;
		console.log(facesMesh)
	}

	this.updateMeshes = function () {
		if(verticesMesh) {
			this.updateVertices();
		}
		if(edgesMesh) {
			this.updateEdges();
		}
		if(facesMesh) {
			this.updateFaces();
		}
	}

	function raycast (raycaster, target) {
		return raycaster.intersectObject(target)[0];
	};

	this.positionHit = function (raycaster) {
		const hit = raycaster.intersectObjects([verticesMesh, edgesMesh, facesMesh]);
		return (hit[0] ? hit[0].point : undefined);
	};

	this.selectHit = function (raycaster) {
		let vertexHit = verticesMesh ? raycast(raycaster, verticesMesh) : undefined;
		if(vertexHit) {
			let vid = vertexHit.instanceId;
			selectedVertices.add(vid);
			this.changeVertexColor(vid, vertex_select_color);
			return vertexHit;
		}
		let edgeHit = edgesMesh ? raycast(raycaster, edgesMesh): undefined;
		if(edgeHit) {
			let eid = edgeHit.instanceId;
			selectedEdges.add(eid);
			this.changeEdgeColor(eid, edge_select_color);
			return edgeHit;
		}
		let faceHit = facesMesh ? raycast(raycaster, facesMesh) : undefined;
		if(faceHit) {
			let fid = faceHit.faceIndex;
			selectedFaces.add(fid);
			this.changeFaceColor(fid, edge_select_color);
			return faceHit;
		}

		return undefined;
	};

	this.toggleSelectHit = function (raycaster) {
		let vertexHit = verticesMesh ? raycast(raycaster, verticesMesh) : undefined;
		if(vertexHit) {
			let vid = vertexHit.instanceId;
			if(selectedVertices.has(vid)) {
				selectedVertices.delete(vid);
				this.changeVertexColor(vid, vertex_color);
			}
			else {
				selectedVertices.add(vid);
				this.changeVertexColor(vid, vertex_select_color);
			}
			return vertexHit;
		}
		let edgeHit = edgesMesh ? raycast(raycaster, edgesMesh): undefined;
		if(edgeHit) {
			let eid = edgeHit.instanceId;
			if(selectedEdges.has(eid)) {
				selectedEdges.delete(eid);
				this.changeEdgeColor(eid, edge_color);
			}
			else {
				selectedEdges.add(eid);
				this.changeEdgeColor(eid, edge_select_color);
			}
			return edgeHit;
		}
		let faceHit = facesMesh ? raycast(raycaster, facesMesh) : undefined;
		if(faceHit) {
			let fid = faceHit.faceIndex;
			if(selectedFaces.has(fid)) {
				selectedFaces.delete(fid);
				this.changeFaceColor(fid, face_color);
			}
			else {
				selectedFaces.add(fid);
				this.changeFaceColor(fid, face_select_color);
			}
			return faceHit;
		}

		return undefined;
	};

	this.deselectAll = function () {
		selectedVertices.forEach(v => this.changeVertexColor(v, vertex_color));
		selectedVertices.clear();
		selectedEdges.forEach(e => this.changeEdgeColor(e, edge_color));
		selectedEdges.clear();
		selectedFaces.forEach(f => this.changeFaceColor(f, face_color));
		selectedFaces.clear();
	};

	this.changeVertexColor = function(vid, color) {
		verticesMesh.setColorAt(vid, color);
		renderer.vertices.mesh.instanceColor.needsUpdate = true;
	};

	this.changeEdgeColor = function(eid, color) {
		edgesMesh.setColorAt(eid, color);
		edgesMesh.instanceColor.needsUpdate = true;
	};

	this.changeFaceColor = function(fid, color) {
		facesMesh.geometry.faces[fid].color.copy(color);
		facesMesh.geometry.colorsNeedUpdate = true;
	};

	this.targetCenter = function(raycaster) {}

	this.getPosition = function(v) {};

	this.getEdgeMid = function(e) {};

	this.getFaceCenter = function(f) {};

	this.saveVertexPos = function(v) {};
	this.savedVertexPos = function(v) {};
	this.updateVertex = function(v) {};
	this.updateEdge = function(e) {};

	// this.rescale_vertices

	this.deleteSelection = function () {
		const update = {};
		if(selectedFaces.size) {
			selectedFaces.forEach(fid => {
				let f = facesMesh.fd[fid];
				mesh.delete_face(f);
			});
			selectedFaces.clear();
			update.faces = true;
		}

		if(selectedEdges.size) {
			selectedEdges.forEach(eid => {
				let e = edgesMesh.ed[eid];
				mesh.delete_edge(e);
			});
			selectedEdges.clear();
			update.edges = true;
			update.faces = true;
		}

		if(selectedVertices.size) {
			selectedVertices.forEach(vid => {
				let v = verticesMesh.vd[vid];
				mesh.delete_vertex(v);
			});
			selectedVertices.clear();
			update.vertices = true;
			update.edges = true;
			update.faces = true;
		}

		update.vertices ? this.updateVertices() : undefined;
		update.edges ? this.updateEdges() : undefined;
		update.faces ? this.updateFaces() : undefined;
	};
}

export default MeshHandler