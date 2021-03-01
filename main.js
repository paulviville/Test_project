import {CMap0} from './CMapJS/CMap/CMap.js';
import {CMap1} from './CMapJS/CMap/CMap.js';
import {CMap2} from './CMapJS/CMap/CMap.js';
import {CMap3} from './CMapJS/CMap/CMap.js';
import Renderer from './CMapJS/Rendering/Renderer.js';
import * as THREE from './CMapJS/Dependencies/three.module.js';
import {OrbitControls} from './CMapJS/Dependencies/OrbitsControls.js';
import {load_cmap2} from './CMapJS/IO/Surface_Formats/CMap2_IO.js' 
import {load_cmap3} from './CMapJS/IO/Volumes_Formats/CMap3_IO.js' 
import {tetrahedron_off, icosahedron_off, cube_off, octahedron_off, cactus_off, fertility_off, metatron_off} from './off_files.js';
import {test1_mesh, fertility, dinopet, santa, ortho3, cactus, test0_mesh, metatron} from './mesh_files.js';
import {cut_all_edges, quadrangulate_all_faces} from './CMapJS/Utils/Subdivision.js';
import {catmull_clark, catmull_clark_inter} from './CMapJS/Modeling/Subdivision/Surface/Catmull_Clark.js';
import {doo_sabin} from './CMapJS/Modeling/Subdivision/Surface/Doo_Sabin.js';

import {controllers, GUI} from './CMapJS/Dependencies/dat.gui.module.js';

import {TransformControls} from './CMapJS/Dependencies/TransformControls.js'

// let cmap0 = new CMap0();
// const dart = CMap0.dart;
// let d0 = cmap0.new_dart();
// let d1 = cmap0.new_dart();
// let d2 = cmap0.new_dart();

// // cmap0.create_embedding(cmap0.vertex);
// cmap0.set_embeddings(cmap0.vertex);

// let position = cmap0.add_attribute(cmap0.vertex, "position");
// position[cmap0.cell(cmap0.vertex, d0)] = new THREE.Vector3(0, 1, 0);
// position[cmap0.cell(cmap0.vertex, d1)] = new THREE.Vector3(-0.866, -0.5, 0);
// position[cmap0.cell(cmap0.vertex, d2)] = new THREE.Vector3(0.866, -0.5, 0);


// cmap0.delete_cell(cmap0.vertex, cmap0.cell(cmap0.vertex, d2));

// console.log(d2, cmap0.cell(cmap0.vertex, d2));
// cmap0.debug();


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
scene.background = new THREE.Color(0x222222);
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


let ambientLight = new THREE.AmbientLight(0xAAAAFF, 0.5);
scene.add(ambientLight);
let pointLight0 = new THREE.PointLight(0x3137DD, 5);
pointLight0.position.set(10,8,5);
// let pointLight1 = new THREE.PointLight(0xFFEEDD, 0.5);
// pointLight0.position.set(0, 0, 0);
// pointLight1.position.set(-10,-8,-5);
scene.add(pointLight0);
// scene.add(pointLight1);

// let renderer0 = new Renderer(cmap0);
// renderer0.vertices.create({size: 0.025}).add(scene);

let cmap2 = load_cmap2('off', icosahedron_off);
// cmap2.set_embeddings(cmap2.edge);
// cmap2.set_embeddings(cmap2.face);
let pos2 = cmap2.get_attribute(cmap2.vertex, "position");
// let vd0 = triangulate_face(cmap2, 0);
// console.log(vd0, cmap2.cell(cmap2.vertex, vd0))
// pos2[cmap2.cell(cmap2.vertex, vd0)] = new THREE.Vector3;

// let degree = 0;
// let vid = cmap2.cell(cmap2.vertex, vd0);
// pos2[vid] = new THREE.Vector3;
// cmap2.foreach_dart_of(cmap2.vertex, vd0, d => {
// 	++degree;
// 	pos2[vid].add(pos2[cmap2.cell(cmap2.vertex, cmap2.phi2[d])]);
// });
// pos2[vid].multiplyScalar(1 / degree);
// console.log(degree)
// catmull_clark(cmap2);
// catmull_clark(cmap2);
// catmull_clark(cmap2);
// catmull_clark(cmap2);
// catmull_clark(cmap2);
// doo_sabin(cmap2);
// catmull_clark(cmap2);
// catmull_clark(cmap2);
// catmull_clark(cmap2);
// catmull_clark(cmap2);
// catmull_clark(cmap2);
// doo_sabin(cmap2);
catmull_clark_inter(cmap2);
// catmull_clark_inter(cmap2);

// catmull_clark_inter(cmap2);
// catmull_clark_inter(cmap2);
// catmull_clark_inter(cmap2);
// catmull_clark_inter(cmap2);
// catmull_clark_inter(cmap2);

// doo_sabin(cmap2);
// doo_sabin(cmap2);

// loop(cmap2);
// loop(cmap2);
// loop(cmap2);
// loop(cmap2);
// loop(cmap2);
// loop(cmap2);
// loop(cmap2);
// loop(cmap2);

// sqrt3(cmap2);
// sqrt3(cmap2);
// sqrt3(cmap2);
// sqrt3(cmap2);
// sqrt3(cmap2);
// sqrt3(cmap2);
// sqrt3(cmap2);
// sqrt3(cmap2);
// sqrt3(cmap2);
// sqrt3(cmap2);
// sqrt3(cmap2);
// catmull_clark(cmap2);

// let p2_1 = pos2[cmap2.cell(cmap2.vertex, 0)];
// let p2_2 = pos2[cmap2.cell(cmap2.vertex, cmap2.phi2[0])];
// let v2 = cmap2.cut_edge(0, true);
// pos2[cmap2.cell(cmap2.vertex, v2)] = (new THREE.Vector3()).add(p2_1).add(p2_2).multiplyScalar(0.5);


let cmap2_base = load_cmap2('off', icosahedron_off);
let renderer2_base = new Renderer(cmap2_base);
renderer2_base.edges.create({size: 4}).add(scene);
// renderer2_base.vertices.create({size: 0.0125}).add(scene);

let renderer2 = new Renderer(cmap2);
renderer2.vertices.create({size: 0.0015625 * 8}).add(scene);
renderer2.edges.create({size: 1, color: 0x0055DD}).add(scene);
// renderer2.faces.create({}).add(scene);

function onMouseMove(event)
{

}

function onMouseUp(event)
{
    window.removeEventListener( 'mousemove', onMouseMove, false );
    window.removeEventListener( 'mouseup', onMouseUp, false );
}

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let id = null;
let mesh = null;
function onMouseDown(event)
{
	console.log(event.detail)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
	let intersections = raycaster.intersectObject(renderer2.vertices.mesh);
    
	if(id != null) { 
		mesh.setColorAt(id, new THREE.Color(0xFF0000));
		id = null;
		mesh.instanceColor.needsUpdate = true;
	}

	if(intersections.length) {
        id = intersections[0].instanceId;
		mesh = renderer2.vertices.mesh;
        mesh.setColorAt(id, new THREE.Color(0x00FF00))
        mesh.instanceColor.needsUpdate = true;
    }
    else {
		intersections = raycaster.intersectObject(renderer2.edges.mesh);
		if(intersections.length) {
			id = intersections[0].instanceId;
			mesh = renderer2.edges.mesh;
			mesh.setColorAt(id, new THREE.Color(0x00FF00))
			mesh.instanceColor.needsUpdate = true;
		}
		else {
			// intersections = raycaster.intersectObject(renderer2.edges.mesh);
		}
    }
}

window.addEventListener( 'pointerdown', onMouseDown, false );
let transcontrols = new TransformControls(camera, renderer.domElement);
transcontrols.addEventListener( 'dragging-changed', function ( event ) {
	orbit_controls.enabled = ! event.value;
} );
transcontrols.attach(renderer2.vertices.mesh)
scene.add(transcontrols)

// function test({cache = undefined, indices = false}){
//     console.log(cache, indices);
// }



// let cmap3 = load_cmap3("mesh", test1_mesh);
// let pos3 = cmap3.get_attribute(cmap3.vertex, "position");

// // let cache_ed = cmap3.cache(cmap3.edge);
// // console.log(cache_ed)
// // cmap3.foreach(cmap3.edge, ed => {
// //     let p1 = pos3[cmap3.cell(cmap3.vertex, ed)];
// //     let p2 = pos3[cmap3.cell(cmap3.vertex, cmap3.phi2[ed])];
// //     let v3 = cmap3.cut_edge(ed, true);
// //     pos3[cmap3.cell(cmap3.vertex, v3)] = (new THREE.Vector3()).add(p1).add(p2).multiplyScalar(0.5);
    
// // }, cache_ed);

// // cmap3.cut_face(cmap3.phi1[0], cmap3.phi_1[0], true)
// // let c3d0 = cmap3.phi2[0];
// // let c3d1 = cmap3.phi1[cmap3.phi1[c3d0]];
// // console.log(c3d0, c3d1)
// // cmap3.cut_face(c3d0, c3d1, true)
// // c3d0 = cmap3.phi1[cmap3.phi2[c3d1]];
// // c3d1 = cmap3.phi1[cmap3.phi1[c3d0]];
// // cmap3.cut_face(c3d0, c3d1, true)
// // let c3ed = cmap3.phi1[0];
// // let path_d = [c3ed];
// // path_d.push(cmap3.phi1[cmap3.phi2[cmap3.phi1[c3ed]]]);
// // path_d.push(cmap3.phi_1[cmap3.phi2[cmap3.phi_1[c3ed]]]);
// // cmap3.cut_volume(path_d, true);

// let renderer3 = new Renderer(cmap3);
// renderer3.volumes.create().add(scene).rescale(0.85);
// renderer3.vertices.create({size: 0.05}).add(scene);
// renderer3.edges.create().add(scene);





let clock = new THREE.Clock();
clock.start();

let cmap3 = load_cmap3("mesh", test0_mesh);
let load_time = clock.getDelta();
cmap3.set_embeddings(cmap3.edge);
let load_time2 = clock.getDelta();
console.log("load time: ", load_time);

let integrity = true;
cmap3.foreach_dart(d => {
	integrity &= cmap3.phi_1[cmap3.phi1[d]] == d;
	integrity &= cmap3.phi1[cmap3.phi_1[d]] == d;
	integrity &= cmap3.phi2[d] != d;
	integrity &= cmap3.phi2[cmap3.phi2[d]] == d;
	integrity &= cmap3.phi3[d] != d;
	integrity &= cmap3.phi3[cmap3.phi3[d]] == d;
});

console.log("integrity", integrity);

// cmap3.foreach_incident(cmap3.vertex2, cmap3.volume, 0, v2d => {
// 	cmap3.foreach_dart_of(cmap3.vertex2, v2d, d => {console.log("v2d", cmap3.cell(5, d))});
// });

// cmap3.foreach_incident(cmap3.vertex2, cmap3.volume, cmap3.phi3[0], v2d => {
// 	cmap3.foreach_dart_of(cmap3.vertex2, v2d, d => {console.log("3 v2d", cmap3.cell(5, d))});
// });

// cmap3.foreach(5, vd => {
// 	cmap3.foreach_dart_of(5, vd, d => {console.log(cmap3.cell(5, d))});
// })

let renderer3 = new Renderer(cmap3);
// renderer3.volumes.create().add(scene);
// renderer3.faces.create().add(scene);
// renderer3.edges.create().add(scene);
// renderer3.vertices.create({size: 0.05}).add(scene);
let renderer_time = clock.getDelta();

let total_time = load_time + renderer_time;
console.log("total time: ", total_time);
console.log("load time: ", load_time);
console.log("renderer time: ", renderer_time);

let iterations = 100;
let v;
let average_time_0 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap2.foreach_incident(cmap2.vertex, cmap2.volume, 0, vd => {let v = 2 * vd;});
//     average_time_0 += clock.getDelta();
// }
// average_time_0 /= iterations;

let average_time_1 = 0;
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
//     cmap3.foreach_incident(cmap3.face, cmap3.connex, 0, vd => {v = 2 * vd;});
//     average_time_0 += clock.getDelta();
// }
// average_time_0 /= iterations;

// average_time_1 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap3.foreach_incident(cmap3.face, cmap3.connex, 0, vd => {v = 2 * vd;}, true);
//     average_time_1 += clock.getDelta();
// }
// average_time_1 /= iterations;
// console.log("foreach_incident face to connex times : ", average_time_0, average_time_1);

// average_time_0 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap3.foreach_incident(cmap3.vertex, cmap3.connex, 0, vd => {v = 2 * vd;});
//     average_time_0 += clock.getDelta();
// }
// average_time_0 /= iterations;

// average_time_1 = 0;
// clock.getDelta();
// for(let i = 0; i < iterations; ++i){
//     cmap3.foreach_incident(cmap3.vertex, cmap3.connex, 0, vd => {v = 2 * vd;}, true);
//     average_time_1 += clock.getDelta();
// }
// average_time_1 /= iterations;
// console.log("foreach_incident vertex to connex times : ", average_time_0, average_time_1);

    // renderer3.volumes.rescale(0.85)

function update ()
{
    // renderer3.volumes.mesh.rotation.x += 0.003125
    // renderer3.volumes.mesh.rotation.y -= 0.001875
    // renderer3.volumes.mesh.rotation.z += 0.000625
    // let s = Math.sin(renderer3.volumes.mesh.rotation.x / Math.PI * 4) / 5 + Math.cos(renderer3.volumes.mesh.rotation.y * 30) / 10;
    // renderer3.volumes.rescale(0.8 + s)
    // let s2 = Math.sin(renderer3.volumes.mesh.rotation.x / Math.PI * 2) / 10;
    // renderer3.volumes.mesh.scale.set(1 + s2, 1 + s2, 1 + s2);

    // pointLight0.color.b = 0.8 + s ;
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

// export {cmap0};
// window.renderer2 = renderer2;
window.renderer3 = renderer3;
window.light0 = pointLight0;
// window.cmap0 = cmap0;
window.cmap1 = cmap1;
window.cmap2 = cmap2;
window.cmap3 = cmap3;
window.CMap0 = CMap0;
