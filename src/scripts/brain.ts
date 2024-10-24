import { Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, WebGLRenderer } from 'three';

const container = document.getElementById('brain-container')!;

const scene = new Scene();
const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new WebGLRenderer();

renderer.setSize(500, 500);
container.appendChild(renderer.domElement);

// Create the nucleus
const nucleusGeometry = new SphereGeometry(1, 32, 32);
const nucleusMaterial = new MeshBasicMaterial({ color: 0xff0000 });
const nucleus = new Mesh(nucleusGeometry, nucleusMaterial);
scene.add(nucleus);

// Create electrons
const electronGeometry = new SphereGeometry(0.2, 32, 32);
const electronMaterial = new MeshBasicMaterial({ color: 0x0000ff });

const electrons: Mesh[] = [];
for (let i = 0; i < 3; i++) {
  const electron = new Mesh(electronGeometry, electronMaterial);
  electrons.push(electron);
  scene.add(electron);
}

// Position the camera
camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate electrons
  electrons.forEach((electron, index) => {
    const angle = Date.now() * 0.001 + (index * Math.PI * 2) / electrons.length;
    electron.position.x = Math.cos(angle) * 2;
    electron.position.z = Math.sin(angle) * 2;
  });

  renderer.render(scene, camera);
}

animate();
