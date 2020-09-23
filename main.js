import CMap_Base from './CMapJS/CMap_Base.js';
import CMap0 from './CMapJS/CMap0.js';
import Renderer from './CMapJS/Renderer.js';
import * as THREE from './CMapJS/three.module.js';
import {OrbitControls} from './CMapJS/OrbitsControls.js'

let cmb = new CMap_Base;

console.log(cmb)
cmb.delete_map();
console.log(cmb)

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
renderer0.vertices.create({size: 0.025});
renderer0.vertices.add(scene);
// renderer0.create_points({size : 0.025});
// renderer0.add_points(scene);
// console.log(renderer0.points);

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