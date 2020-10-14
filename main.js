import {CMap0} from './CMapJS/CMap/CMap.js';
import {CMap1} from './CMapJS/CMap/CMap.js';
import {CMap2} from './CMapJS/CMap/CMap.js';
import {CMap3} from './CMapJS/CMap/CMap.js';
import Renderer from './CMapJS/Renderer.js';
import * as THREE from './CMapJS/three.module.js';
import {OrbitControls} from './CMapJS/OrbitsControls.js';
import {load_cmap2} from './CMapJS/IO/Surface_Formats/CMap2_IO.js' 
import {load_cmap3} from './CMapJS/IO/Volumes_Formats/CMap3_IO.js' 
import {tetrahedron_off, cactus_off, fertility_off} from './off_files.js';
import {test1_mesh, fertility, ortho3, cactus, test0_mesh, metatron} from './mesh_files.js';

let cmap0 = new CMap0();
const dart = CMap0.dart;
let d0 = cmap0.new_dart();
let d1 = cmap0.new_dart();
let d2 = cmap0.new_dart();

// cmap0.create_embedding(cmap0.vertex);
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



const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000.0);
camera.position.set(0, 0, 2);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

let orbit_controls = new OrbitControls(camera, renderer.domElement)
orbit_controls.enablePan = false;
orbit_controls.update();
// orbit_controls.addEventListener('change', render);

let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);
let pointLight0 = new THREE.PointLight(0xFFEEDD, 0.8);
// pointLight0.position.set(10,8,5);
let pointLight1 = new THREE.PointLight(0xFFEEDD, 0.5);
pointLight0.position.set(0, 0, 0);
// pointLight1.position.set(-10,-8,-5);
scene.add(pointLight0);
// scene.add(pointLight1);

let cmap2 = load_cmap2('off', fertility_off);
cmap2.set_embeddings(cmap2.edge);
cmap2.set_embeddings(cmap2.face);

let clock = new THREE.Clock();
clock.start();

let cmap3 = load_cmap3("mesh", metatron);
let load_time = clock.getDelta();

// let pos3 = cmap3.get_attribute(cmap3.vertex, "position");
// let center = new THREE.Vector3();
// pos3.forEach(v => center.add(v));
// center.divideScalar(pos3.length);
// console.log(center);




// let renderer0 = new Renderer(cmap0);
// renderer0.vertices.create({size: 0.025}).add(scene);
// // renderer0.vertices.add(scene);

// let renderer1 = new Renderer(cmap1);
// renderer1.vertices.create({size: 0.025}).add(scene);
// renderer1.edges.create().add(scene);
// renderer1.vertices.add(scene);


let renderer3 = new Renderer(cmap3);
// renderer3.vertices.create({size: 0.025}).add(scene);
// renderer3.edges.create().add(scene);
renderer3.volumes.create().add(scene);
// renderer3.volumes.mesh.position.set(center.x, center.y, center.z);
// renderer3.faces.create().add(scene);
let renderer_time = clock.getDelta();

let total_time = load_time + renderer_time;
console.log("total time: ", total_time);
console.log("load time: ", load_time);
console.log("renderer time: ", renderer_time);
// let renderert = new Renderer(tmap);
// renderert.vertices.create({size: 0.025}).add(scene);
// renderert.edges.create().add(scene);
// renderert.faces.create().add(scene);

// let renderer2 = new Renderer(cmap2);
// renderer2.faces.create().add(scene);

// let iterations = 100;

// let average_time_0 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap2.foreach_incident(cmap2.vertex, cmap2.volume, 0, vd => {let v = 2 * vd;});
//     average_time_0 += clock.getDelta();
// }
// average_time_0 /= iterations;

// let average_time_1 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap2.foreach_incident(cmap2.vertex, cmap2.volume, 0, vd => {let v = 2 * vd;}, true);
//     average_time_1 += clock.getDelta();
// }
// average_time_1 /= iterations;
// console.log("foreach_incident vertex to volume times : ", average_time_0, average_time_1);

// average_time_0 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap2.foreach_incident(cmap2.edge, cmap2.volume, 0, vd => {let v = 2 * vd;});
//     average_time_0 += clock.getDelta();
// }
// average_time_0 /= iterations;

// average_time_1 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap2.foreach_incident(cmap2.edge, cmap2.volume, 0, vd => {let v = 2 * vd;}, true);
//     average_time_1 += clock.getDelta();
// }
// average_time_1 /= iterations;
// console.log("foreach_incident edge to volume times : ", average_time_0, average_time_1);

// average_time_0 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap2.foreach_incident(cmap2.face, cmap2.volume, 0, vd => {let v = 2 * vd;});
//     average_time_0 += clock.getDelta();
// }
// average_time_0 /= iterations;

// average_time_1 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap2.foreach_incident(cmap2.face, cmap2.volume, 0, vd => {let v = 2 * vd;}, true);
//     average_time_1 += clock.getDelta();
// }
// average_time_1 /= iterations;
// console.log("foreach_incident face to volume times : ", average_time_0, average_time_1);

// cmap3.set_embeddings(cmap3.connex)
// cmap3.set_embeddings(cmap3.face)
// cmap3.set_embeddings(cmap3.face2)
// cmap3.set_embeddings(cmap3.edge)

// average_time_0 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap3.foreach_incident(cmap3.face, cmap3.connex, 0, vd => {let v = 2 * vd;});
//     average_time_0 += clock.getDelta();
// }
// average_time_0 /= iterations;

// average_time_1 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap3.foreach_incident(cmap3.face, cmap3.connex, 0, vd => {let v = 2 * vd;}, true);
//     average_time_1 += clock.getDelta();
// }
// average_time_1 /= iterations;
// console.log("foreach_incident face to connex times : ", average_time_0, average_time_1);

// average_time_0 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap3.foreach_incident(cmap3.vertex, cmap3.connex, 0, vd => {let v = 2 * vd;});
//     average_time_0 += clock.getDelta();
// }
// average_time_0 /= iterations;

// average_time_1 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap3.foreach_incident(cmap3.vertex, cmap3.connex, 0, vd => {let v = 2 * vd;}, true);
//     average_time_1 += clock.getDelta();
// }
// average_time_1 /= iterations;
// console.log("foreach_incident vertex to connex times : ", average_time_0, average_time_1);


function update ()
{
    // renderer3.volumes.mesh.rotation.x += 0.003125
    // renderer3.volumes.mesh.rotation.y += 0.003125
    renderer3.volumes.mesh.rotation.x += 0.003125
    renderer3.volumes.mesh.rotation.y -= 0.001875
    renderer3.volumes.mesh.rotation.z += 0.000625
    let s = Math.sin(renderer3.volumes.mesh.rotation.x / Math.PI * 4) / 5 + Math.cos(renderer3.volumes.mesh.rotation.y * 30) / 10;
    renderer3.volumes.rescale(0.8 + s)
    let s2 = Math.sin(renderer3.volumes.mesh.rotation.x / Math.PI * 2) / 10;
    renderer3.volumes.mesh.scale.set(1 + s2, 1 + s2, 1 + s2);
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
// window.renderer2 = renderer2;
window.renderer3 = renderer3;
window.cmap0 = cmap0;
window.cmap1 = cmap1;
// window.cmap2 = cmap2;
window.cmap3 = cmap3;
window.CMap0 = CMap0;