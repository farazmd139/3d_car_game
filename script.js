import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. सीन, कैमरा, रेंडरर
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. लाइट
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// 3. ज़मीन
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 200),
    new THREE.MeshStandardMaterial({ color: 0x555555 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// 4. एक ऑब्जेक्ट बनाएँ जो हमारी कार होगी (शुरू में यह खाली रहेगा)
let car = new THREE.Object3D();
car.position.y = 0.5;
scene.add(car);

// 5. ड्रैग कंट्रोल का लॉजिक (इसमें कोई बदलाव नहीं)
let touchStartX = 0;
let steering = 0;
const steeringAmount = 0.04;
renderer.domElement.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
renderer.domElement.addEventListener('touchmove', (e) => {
    const diff = e.touches[0].clientX - touchStartX;
    steering = Math.max(-1, Math.min(1, diff / 50)) * steeringAmount;
});
renderer.domElement.addEventListener('touchend', () => { steering = 0; });

// 6. आसमान (Skybox) और कार मॉडल लोड करें
// Skybox लोडर
const skyboxLoader = new THREE.CubeTextureLoader();
skyboxLoader.load([
    'https://threejs.org/examples/textures/cube/Bridge2/posx.jpg', 'https://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/posy.jpg', 'https://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/posz.jpg', 'https://threejs.org/examples/textures/cube/Bridge2/negz.jpg',
], (texture) => {
    // जब आसमान लोड हो जाए, तो उसे बैकग्राउंड में सेट कर दो
    scene.background = texture;
});

// कार मॉडल लोडर
const modelLoader = new GLTFLoader();
modelLoader.load(
    'https://raw.githubusercontent.com/UX-Decoder/Resources/master/low_poly_car/scene.gltf',
    (gltf) => {
        // जब मॉडल लोड हो जाए, तो उसे हमारे car ऑब्जेक्ट में डाल दो
        const model = gltf.scene;
        model.scale.set(0.6, 0.6, 0.6);
        model.rotation.y = Math.PI;
        car.add(model); // खाली car ऑब्जेक्ट में मॉडल को जोड़ना
    }
);

// 7. गेम लूप (एनीमेशन)
const speed = 0.15;
function animate() {
    requestAnimationFrame(animate);
    car.rotation.y -= steering;
    car.position.x -= Math.sin(car.rotation.y) * speed;
    car.position.z -= Math.cos(car.rotation.y) * speed;
    const cameraOffset = new THREE.Vector3(0, 5, 9);
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y);
    camera.position.copy(car.position).add(cameraOffset);
    camera.lookAt(car.position);
    renderer.render(scene, camera);
}

// 8. विंडो का साइज़ बदलने पर एडजस्ट करें
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// गेम शुरू करें
animate();
