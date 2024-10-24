import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

const container = document.getElementById('brain-container')!;

const scene = new Scene();

const camera = new PerspectiveCamera(75, 1, 0.1, 1000);

const renderer = new WebGLRenderer();

const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

renderer.setSize(500, 500);
container.appendChild(renderer.domElement);

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
