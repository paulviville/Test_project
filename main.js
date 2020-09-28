import {CMap0} from './CMapJS/CMap/CMap.js';
import {CMap1} from './CMapJS/CMap/CMap.js';
import {CMap2} from './CMapJS/CMap/CMap.js';
import {CMap3} from './CMapJS/CMap/CMap.js';
import Renderer from './CMapJS/Renderer.js';
import * as THREE from './CMapJS/three.module.js';
import {OrbitControls} from './CMapJS/OrbitsControls.js';
import {load_cmap2} from './CMapJS/IO/Surface_Formats/CMap2_IO.js' 
import {tetrahedron_off} from './off_files.js';

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

cmap0.foreach(1,
	d => {
		cmap0.foreach_dart_of(1, d, d1 => console.log(cmap0.cell(1, d), d1));
	})

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

let cmap2 = load_cmap2('off', tetrahedron_off);

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
let pointLight = new THREE.PointLight(0xFFEEDD, 0.8);
pointLight.position.set(10,10,10);
scene.add(pointLight);



let renderer0 = new Renderer(cmap0);
renderer0.vertices.create({size: 0.025}).add(scene);
// renderer0.vertices.add(scene);

let renderer1 = new Renderer(cmap1);
renderer1.vertices.create({size: 0.025}).add(scene);
renderer1.edges.create().add(scene);
// renderer1.vertices.add(scene);

let renderer2 = new Renderer(cmap2);
renderer2.vertices.create({size: 0.025}).add(scene);
renderer2.edges.create().add(scene);
renderer2.faces.create().add(scene);

function update ()
{

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
window.renderer0 = renderer0;
window.cmap0 = cmap0;
window.CMap0 = CMap0;