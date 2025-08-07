import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// बेसिक सेटअप
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// कैमरे की पोज़िशन
camera.position.set(0, 3, 6);
camera.lookAt(0, 0, 0);

// लाइट
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// कार वैरिएबल
let car;

// ----- गेम लॉजिक -----
const roadWidth = 10;
const speed = 0.2;
let targetX = 0; // कार को कहाँ जाना है (बाएँ/दाएँ)

// रोड बनाना
const textureLoader = new THREE.TextureLoader();
const roadTexture = textureLoader.load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');
roadTexture.wrapS = THREE.RepeatWrapping;
roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(4, 12); // टेक्सचर को रिपीट करना

const road = new THREE.Mesh(
    new THREE.PlaneGeometry(roadWidth, 100),
    new THREE.MeshStandardMaterial({ map: roadTexture })
);
road.rotation.x = -Math.PI / 2;
road.position.z = -40; // रोड को कैमरे के आगे रखना
scene.add(road);

// कार मॉडल लोड करना
const loader = new GLTFLoader();
loader.load(
    'https://raw.githubusercontent.com/UX-Decoder/Resources/master/low_poly_car/scene.gltf',
    (gltf) => {
        car = gltf.scene;
        car.scale.set(0.5, 0.5, 0.5);
        car.rotation.y = Math.PI; // कार को सीधा करना
        scene.add(car);
    }
);

// ----- कंट्रोल -----
renderer.domElement.addEventListener('touchmove', (e) => {
    // टच की पोज़िशन -1 (लेफ्ट) से 1 (राइट) के बीच में निकालना
    let touchX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
    targetX = touchX * (roadWidth / 2.5); // कार को रोड के अंदर रखना
});

renderer.domElement.addEventListener('touchend', (e) => {
    targetX = 0; // टच छोड़ने पर कार बीच में आने लगेगी
});

// ----- गेम लूप -----
function animate() {
    requestAnimationFrame(animate);
    
    // रोड को पीछे चलाना
    road.position.z += speed;
    if (road.position.z > 10) {
        road.position.z = -40; // रोड को लूप करना
    }

    if (car) {
        // कार को स्मूथली बाएँ-दाएँ करना
        car.position.x += (targetX - car.position.x) * 0.1;

        // कार को थोड़ा सा झुकाना जब वह मुड़े
        car.rotation.z = (targetX - car.position.x) * -0.1;
        car.rotation.y = Math.PI + (targetX - car.position.x) * -0.05;
    }

    renderer.render(scene, camera);
}

// ----- रोटेशन हैंडलिंग -----
const rotateScreenDiv = document.getElementById('rotate-screen');
function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        // फ़ोन सीधा है (Portrait)
        rotateScreenDiv.style.display = 'flex';
    } else {
        // फ़ोन लेटा हुआ है (Landscape)
        rotateScreenDiv.style.display = 'none';
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', checkOrientation);

checkOrientation();
animate();
