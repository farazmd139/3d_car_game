import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// सीन, कैमरा, और रेंडरर
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// कैमरे की पोज़िशन फिक्स कर दी है ताकि कार हमेशा दिखे
camera.position.set(0, 10, 12); 
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

// कार का मॉडल
let car; // कार को बाद में डिफाइन करेंगे
const modelLoader = new GLTFLoader();
modelLoader.load(
    'https://raw.githubusercontent.com/UX-Decoder/Resources/master/low_poly_car/scene.gltf', 
    function (gltf) {
        car = gltf.scene; // अब कार मॉडल यहाँ लोड हो रहा है
        car.scale.set(0.6, 0.6, 0.6);
        car.rotation.y = Math.PI;
        car.position.y = 0.5;
        scene.add(car);
        camera.lookAt(car.position); // कैमरा कार की तरफ देखेगा
        animate(); // मॉडल लोड होने के बाद ही गेम शुरू होगा
    }
);

// --- नया अंगूठे वाला ड्रैग कंट्रोल ---
let touchStartX = 0;
let steering = 0; // -1 (बाएँ) से +1 (दाएँ) तक
const steeringAmount = 0.04; // कार कितनी तेज़ी से मुड़ेगी

// जब स्क्रीन पर टच शुरू हो
renderer.domElement.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
});

// जब अंगूठा स्क्रीन पर घूमे
renderer.domElement.addEventListener('touchmove', (event) => {
    const currentX = event.touches[0].clientX;
    const difference = currentX - touchStartX;
    
    // एक लिमिट के बाद ही घुमाएँ
    if (difference > 20) {
        steering = steeringAmount; // दाएँ घुमाएँ
    } else if (difference < -20) {
        steering = -steeringAmount; // बाएँ घुमाएँ
    } else {
        steering = 0;
    }
});

// जब अंगूठा स्क्रीन से उठे
renderer.domElement.addEventListener('touchend', (event) => {
    steering = 0; // घूमना बंद करें
});


// गेम लूप
const speed = 0.15;
function animate() {
    requestAnimationFrame(animate);

    if (car) { // अगर कार लोड हो चुकी है
        // कार का घूमना
        car.rotation.y += steering;

        // कार का आगे बढ़ना
        car.position.x += Math.sin(car.rotation.y) * speed;
        car.position.z += Math.cos(car.rotation.y) * speed;
        
        // कैमरे को कार के पीछे रखना
        const cameraOffset = new THREE.Vector3(0, 5, -9);
        cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y);
        camera.position.copy(car.position).add(cameraOffset);
        camera.lookAt(car.position);
    }

    renderer.render(scene, camera);
}

// विंडो का साइज़ बदलने पर एडजस्ट करें
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
