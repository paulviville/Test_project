import {CMap0} from './CMapJS/CMap/CMap.js';
import {CMap1} from './CMapJS/CMap/CMap.js';
import {CMap2} from './CMapJS/CMap/CMap.js';
import {CMap3} from './CMapJS/CMap/CMap.js';
import Renderer from './CMapJS/Renderer.js';
import * as THREE from './CMapJS/three.module.js';
import {OrbitControls} from './CMapJS/OrbitsControls.js';
import {load_cmap2} from './CMapJS/IO/Surface_Formats/CMap2_IO.js' 
import {load_cmap3} from './CMapJS/IO/Volumes_Formats/CMap3_IO.js' 
import {tetrahedron_off} from './off_files.js';
import {test1_mesh, fertility, ortho3, cactus, test0_mesh} from './mesh_files.js';

let cmap0 = new CMap0();
const dart = CMap0.dart;
let d0 = cmap0.new_dart();
let d1 = cmap0.new_dart();
let d2 = cmap0.new_dart();

cmap0.create_embedding(cmap0.vertex);
cmap0.set_embeddings(cmap0.vertex);
let position = cmap0.add_attribute(cmap0.vertex, "position");

position[cmap0.cell(cmap0.vertex, d0)] = new THREE.Vector3(0, 1, 0);
position[cmap0.cell(cmap0.vertex, d1)] = new THREE.Vector3(-0.866, -0.5, 0);
position[cmap0.cell(cmap0.vertex, d2)] = new THREE.Vector3(0.866, -0.5, 0);

// cmap0.foreach(1,
// 	d => {
// 		cmap0.foreach_dart_of(1, d, d1 => console.log(cmap0.cell(1, d), d1));
// 	})

let cmap1 = new CMap1();
let f00 = cmap1.add_face(6);
cmap1.set_embeddings(cmap1.edge);
cmap1.set_embeddings(cmap1.vertex);
cmap1.set_embeddings(cmap1.face);

cmap1.mark_cell_as_boundary(cmap1.edge, f00);

let pos1_base = cmap1.add_attribute(cmap1.vertex, "position");
pos1_base[cmap1.cell(cmap1.vertex, 0)] = new THREE.Vector3(0, 1, 0);
pos1_base[cmap1.cell(cmap1.vertex, 1)] = new THREE.Vector3(-0.866, 0.5, 0);
pos1_base[cmap1.cell(cmap1.vertex, 2)] = new THREE.Vector3(-0.866, -0.5, 0.2);
pos1_base[cmap1.cell(cmap1.vertex, 3)] = new THREE.Vector3(0, -1, 0.2);
pos1_base[cmap1.cell(cmap1.vertex, 4)] = new THREE.Vector3(0.866, -0.5, 0.2);
pos1_base[cmap1.cell(cmap1.vertex, 5)] = new THREE.Vector3(0.866, 0.5, 0);

// let cmap2 = load_cmap2('off', tetrahedron_off);


// let cmap3 = new CMap3;



// // cmap2.set_embeddings(cmap2.vertex);
// // cmap2.set_embeddings(cmap2.edge);
// // cmap2.set_embeddings(cmap2.face);
// // cmap2.set_embeddings(cmap2.volume);
// let bd = cmap3.add_prism(4, true);
// let bd1 = cmap3.add_prism(4, true);
// let bd2 = cmap3.phi2[cmap3.phi1[cmap3.phi1[cmap3.phi2[bd]]]];
// let bd3 = cmap3.phi2[cmap3.phi1[cmap3.phi1[cmap3.phi2[bd1]]]];

// cmap3.sew_phi3(bd1, bd2);
// bd1 = cmap3.phi1[bd1];
// bd2 = cmap3.phi_1[bd2];
// cmap3.sew_phi3(bd1, bd2);
// bd1 = cmap3.phi1[bd1];
// bd2 = cmap3.phi_1[bd2];
// cmap3.sew_phi3(bd1, bd2);
// bd1 = cmap3.phi1[bd1];
// bd2 = cmap3.phi_1[bd2];
// cmap3.sew_phi3(bd1, bd2);
// bd1 = cmap3.phi1[bd1];
// bd2 = cmap3.phi_1[bd2];
// console.log(bd, bd2);
// let pos2 = cmap3.add_attribute(cmap3.vertex, "position");
// cmap3.close();
// cmap3.set_embeddings(cmap3.vertex);
// cmap3.debug();
// console.log(pos2);
// pos2[cmap3.cell(cmap3.vertex, bd)] = new THREE.Vector3(0.2, 0.2, -0.2);
// bd = cmap3.phi1[bd];
// pos2[cmap3.cell(cmap3.vertex, bd)] = new THREE.Vector3(0.2, -0.2, -0.2);
// bd = cmap3.phi1[bd];
// pos2[cmap3.cell(cmap3.vertex, bd)] = new THREE.Vector3(-0.2, -0.2, -0.2);
// bd = cmap3.phi1[bd];
// pos2[cmap3.cell(cmap3.vertex, bd)] = new THREE.Vector3(-0.2, 0.2, -0.2);

// pos2[cmap3.cell(cmap3.vertex, bd2)] = new THREE.Vector3(0.2, -0.2, 0.2);
// bd2 = cmap3.phi1[bd2];
// pos2[cmap3.cell(cmap3.vertex, bd2)] = new THREE.Vector3(0.2, 0.2, 0.2);
// bd2 = cmap3.phi1[bd2];
// pos2[cmap3.cell(cmap3.vertex, bd2)] = new THREE.Vector3(-0.2, 0.2, 0.2);
// bd2 = cmap3.phi1[bd2];
// pos2[cmap3.cell(cmap3.vertex, bd2)] = new THREE.Vector3(-0.3, -0.3, 0.2);

// pos2[cmap3.cell(cmap3.vertex, bd3)] = new THREE.Vector3(0.2, -0.2, 0.6);
// bd3 = cmap3.phi1[bd3];
// pos2[cmap3.cell(cmap3.vertex, bd3)] = new THREE.Vector3(0.2, 0.2, 0.6);
// bd3 = cmap3.phi1[bd3];
// pos2[cmap3.cell(cmap3.vertex, bd3)] = new THREE.Vector3(-0.2, 0.2, 0.6);
// bd3 = cmap3.phi1[bd3];
// pos2[cmap3.cell(cmap3.vertex, bd3)] = new THREE.Vector3(-0.2, -0.2, 0.6);


// console.log(pos2);

// cmap3.debug();




// cmap2.foreach_dart_phi1_phi2(0, d=> {
// 	console.log(d);
// 	return d == 12
// });


// let tmap = new CMap2();
// let fd0 = tmap.add_face(3);
// let fd1 = tmap.add_face(3);
// tmap.sew_phi2(fd0, fd1);
// tmap.close_hole(1, false, true);

// tmap.set_embeddings(1);
// tmap.set_embeddings(3);

// let p = tmap.add_attribute(1, "position");
// p[tmap.cell(1, fd0)] = new THREE.Vector3(-1, -1, 0);
// p[tmap.cell(1, fd1)] = new THREE.Vector3(1, 1, 0);
// p[tmap.cell(1, tmap.phi_1[fd0])] = new THREE.Vector3(-1, 1, -0.5);
// p[tmap.cell(1, tmap.phi_1[fd1])] = new THREE.Vector3(1, -1, -0.5);


let cmap3 = load_cmap3("mesh", fertility);




const scene = new THREE.Scene();
scene.background = new THREE.Color(0xA0A0A0);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);
camera.position.set(0, 0, 2);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let orbit_controls = new OrbitControls(camera, renderer.domElement)
orbit_controls.enablePan = false;
orbit_controls.update();
orbit_controls.addEventListener('change', render);

let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);
let pointLight0 = new THREE.PointLight(0xFFEEDD, 0.8);
pointLight0.position.set(10,8,5);
let pointLight1 = new THREE.PointLight(0xFFEEDD, 0.5);
pointLight1.position.set(-10,-8,-5);
scene.add(pointLight0);
scene.add(pointLight1);


let renderer0 = new Renderer(cmap0);
renderer0.vertices.create({size: 0.025}).add(scene);
// renderer0.vertices.add(scene);

let renderer1 = new Renderer(cmap1);
renderer1.vertices.create({size: 0.025}).add(scene);
renderer1.edges.create().add(scene);
// renderer1.vertices.add(scene);

let renderer2 = new Renderer(cmap3);
// renderer2.vertices.create({size: 0.025}).add(scene);
// renderer2.edges.create().add(scene);
renderer2.volumes.create().add(scene);
// renderer2.faces.create().add(scene);

// let renderert = new Renderer(tmap);
// renderert.vertices.create({size: 0.025}).add(scene);
// renderert.edges.create().add(scene);
// renderert.faces.create().add(scene);

function update ()
{
    renderer2.volumes.mesh.rotation.x += 0.05
    renderer2.volumes.rescale(0.9 + Math.sin(renderer2.volumes.mesh.rotation.x) / 10)
}

function render()
{
	renderer.render(scene, camera);
}

function loop()
{
    update();
    render();

    requestAnimationFrame(loop);
}

loop();

// export {cmap0};
window.renderer2 = renderer2;
window.cmap0 = cmap0;
window.cmap3 = cmap3;
window.CMap0 = CMap0;