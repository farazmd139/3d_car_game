import * as THREE from 'three';
// GLTF लोडर को इम्पोर्ट करें, यह 3D मॉडल लोड करने के काम आता है
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// सीन, कैमरा, रेंडरर (कोई बदलाव नहीं)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 8);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// लाइट (कोई बदलाव नहीं)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// आसमान (Skybox) जोड़ें
const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
    'https://threejs.org/examples/textures/cube/Bridge2/posx.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/negx.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/posy.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/negy.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/posz.jpg',
    'https://threejs.org/examples/textures/cube/Bridge2/negz.jpg',
]);
scene.background = texture;

// ज़मीन (कोई बदलाव नहीं)
const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 200), new THREE.MeshStandardMaterial({ color: 0x444444 }));
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// --- यहाँ से बड़ा बदलाव है ---

// कार के लिए एक खाली ऑब्जेक्ट बनाएँ, मॉडल इसमें लोड होगा
let car = new THREE.Object3D(); 
scene.add(car);

// GLTF लोडर से कार का मॉडल लोड करें
const modelLoader = new GLTFLoader();
modelLoader.load(
    // Sketchfab से एक मुफ़्त कार मॉडल का लिंक
    'https://raw.githubusercontent.com/UX-Decoder/Resources/master/low_poly_car/scene.gltf', 
    function (gltf) {
        // मॉडल लोड होने के बाद
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5); // मॉडल का साइज़ ठीक करें
        model.rotation.y = Math.PI; // मॉडल को सीधा करें
        car.add(model); // मॉडल को हमारे कार ऑब्जेक्ट में जोड़ें
        car.position.y = 0.5;
    },
    undefined, // यहाँ हम लोडिंग प्रोग्रेस दिखा सकते हैं
    function (error) {
        console.error(error);
    }
);

camera.lookAt(car.position);

// टिल्ट कंट्रोल लॉजिक (कोई बदलाव नहीं)
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
let tilt = 0;

startButton.addEventListener('click', () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                }
            });
    } else {
        window.addEventListener('deviceorientation', handleOrientation);
    }
    startScreen.style.display = 'none';
    animate();
});

function handleOrientation(event) {
    if (event.gamma) tilt = event.gamma;
}

const speed = 0.15;
const rotationSpeed = 0.03;

function animate() {
    requestAnimationFrame(animate);
    const tiltThreshold = 5;
    if (tilt > tiltThreshold) {
        car.rotation.y -= rotationSpeed; // ध्यान दें: मॉडल के हिसाब से डायरेक्शन उल्टा हो सकता है
    } else if (tilt < -tiltThreshold) {
        car.rotation.y += rotationSpeed;
    }

    // कार को लगातार आगे बढ़ाएँ
    car.position.x += Math.sin(car.rotation.y) * speed;
    car.position.z += Math.cos(car.rotation.y) * speed;
    
    const cameraOffset = new THREE.Vector3(0, 4, -7); // कैमरा पीछे रखने के लिए माइनस z
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y);
    camera.position.copy(car.position).add(cameraOffset);
    camera.lookAt(car.position);

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
