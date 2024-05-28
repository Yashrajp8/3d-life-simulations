// Initialize Three.js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Set background color to black

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create spheres for atoms
const geometry = new THREE.SphereGeometry(0.2, 32, 32);
const yellowMaterial = new THREE.MeshBasicMaterial({ color: 'yellow' });
const redMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
const greenMaterial = new THREE.MeshBasicMaterial({ color: 'green' });

const yellowAtoms = createAtoms(200, yellowMaterial);
const redAtoms = createAtoms(200, redMaterial);
const greenAtoms = createAtoms(200, greenMaterial);

function createAtoms(number, material) {
  const group = new THREE.Group();
  for (let i = 0; i < number; i++) {
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
    group.add(sphere);
  }
  scene.add(group);
  return group;
}

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

// Set camera position
camera.position.z = 20;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  updateAtoms();
  renderer.render(scene, camera);
}

function updateAtoms() {
  // Implement your algorithmic life simulation logic here
  // Update positions, colors, etc. of the spheres
  yellowAtoms.children.forEach(atom => {
    atom.position.x += (Math.random() - 0.5) * 0.1;
    atom.position.y += (Math.random() - 0.5) * 0.1;
    atom.position.z += (Math.random() - 0.5) * 0.1;
  });
  redAtoms.children.forEach(atom => {
    atom.position.x += (Math.random() - 0.5) * 0.1;
    atom.position.y += (Math.random() - 0.5) * 0.1;
    atom.position.z += (Math.random() - 0.5) * 0.1;
  });
  greenAtoms.children.forEach(atom => {
    atom.position.x += (Math.random() - 0.5) * 0.1;
    atom.position.y += (Math.random() - 0.5) * 0.1;
    atom.position.z += (Math.random() - 0.5) * 0.1;
  });
}

animate();
