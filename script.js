import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// सीन, कैमरा, और रेंडरर
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10); // कैमरे की शुरुआती सुरक्षित पोज़िशन
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// लाइट
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// आसमान (Skybox)
const skyboxLoader = new THREE.CubeTextureLoader();
const skyboxTexture = skyboxLoader.load([
    'https://threejs.org/examples/textures/cube/Bridge2/posx.jpg', 'https://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/posy.jpg', 'https://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/posz.jpg', 'https://threejs.org/examples/textures/cube/Bridge2/negz.jpg',
]);
scene.background = skyboxTexture;

// ज़मीन
const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 200), new THREE.MeshStandardMaterial({ color: 0x444444 }));
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// कार वैरिएबल पहले से बना लें
let car;

// --- ड्रैग कंट्रोल का लॉजिक ---
let touchStartX = 0;
let steering = 0;
const steeringAmount = 0.04;

renderer.domElement.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
renderer.domElement.addEventListener('touchmove', (e) => {
    const diff = e.touches[0].clientX - touchStartX;
    steering = Math.max(-1, Math.min(1, diff / 50)) * steeringAmount;
});
renderer.domElement.addEventListener('touchend', () => { steering = 0; });

// --- गेम लूप ---
const speed = 0.15;
function animate() {
    requestAnimationFrame(animate);

    if (car) { // यह सुनिश्चित करता है कि कार लोड होने के बाद ही यह कोड चले
        // कार का घूमना
        car.rotation.y += steering;

        // कार का आगे बढ़ना
        car.position.x += Math.sin(car.rotation.y) * speed;
        car.position.z += Math.cos(car.rotation.y) * speed;
        
        // कैमरे को कार के पीछे रखना
        const cameraOffset = new THREE.Vector3(0, 4, -8);
        cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y);
        camera.position.copy(car.position).add(cameraOffset);
        camera.lookAt(car.position);
    }

    renderer.render(scene, camera);
}

// --- मॉडल लोडर ---
const modelLoader = new GLTFLoader();
modelLoader.load(
    'https://raw.githubusercontent.com/UX-Decoder/Resources/master/low_poly_car/scene.gltf', 
    function (gltf) {
        car = gltf.scene;
        car.scale.set(0.6, 0.6, 0.6);
        car.rotation.y = Math.PI;
        car.position.y = 0.5;
        scene.add(car);
    },
    undefined,
    function (error) {
        console.error('An error happened while loading the model:', error);
    }
);

// विंडो का साइज़ बदलने पर एडजस्ट करें
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// गेम लूप को तुरंत शुरू कर दें
animate();
```3.  पेज के नीचे जाकर **`Commit changes`** बटन दबा दें।
