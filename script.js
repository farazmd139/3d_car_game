import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. बेसिक सेटअप
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.appendChild(renderer.domElement);

// 2. लाइट (सरल और तेज़)
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(0, 10, 5);
scene.add(dirLight);

// 3. कैमरे की पोज़िशन (ऐसी जगह जहाँ से सीन ज़रूर दिखे)
camera.position.set(0, 4, 8);
camera.lookAt(0, 1, 0); // कैमरे को थोड़ा ऊपर की ओर दिखाना

// 4. कार और रोड के वैरिएबल
let car;
const roadSpeed = 0.3;
const roadWidth = 8;
let targetX = 0; // कार को कहाँ जाना है

// 5. रोड (असली रोड की इमेज के साथ)
const textureLoader = new THREE.TextureLoader();
const roadTexture = textureLoader.load('https://raw.githubusercontent.com/UX-Decoder/Resources/master/road_texture.jpg', (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 10); // इमेज को 10 बार रिपीट करना
});
const road = new THREE.Mesh(
    new THREE.PlaneGeometry(roadWidth, 200),
    new THREE.MeshStandardMaterial({ map: roadTexture })
);
road.rotation.x = -Math.PI / 2;
road.position.z = -100; // रोड को बहुत पीछे से शुरू करना
scene.add(road);

// 6. कार मॉडल लोड करना (एक नया, भरोसेमंद मॉडल)
const loader = new GLTFLoader();
loader.load(
    'https://raw.githubusercontent.com/UX-Decoder/Resources/master/police_car/scene.gltf',
    (gltf) => {
        car = gltf.scene;
        car.scale.set(1.5, 1.5, 1.5);
        car.position.y = 0.5; // कार को ज़मीन पर रखना
        scene.add(car);
        console.log('Police car loaded!'); // यह मैसेज बताएगा कि कार लोड हुई
    },
    undefined,
    (error) => {
        console.error('Car loading error:', error);
    }
);

// 7. कंट्रोल
function handleTouch(event) {
    // टच की पोज़िशन को -1 (लेफ्ट) से 1 (राइट) के बीच लाना
    const touchX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    targetX = touchX * (roadWidth / 2.5);
}
renderer.domElement.addEventListener('touchstart', handleTouch, { passive: true });
renderer.domElement.addEventListener('touchmove', handleTouch, { passive: true });

// 8. गेम लूप
function animate() {
    requestAnimationFrame(animate);

    // रोड को कैमरे की तरफ़ चलाना
    road.position.z += roadSpeed;
    if (road.position.z > 0) { // अगर रोड कैमरे के पीछे चला जाए
        road.position.z = -100; // तो उसे वापस पीछे भेज दो
    }

    if (car) {
        // कार को स्मूथ तरीके से कंट्रोल करना
        car.position.x += (targetX - car.position.x) * 0.1;

        // मुड़ते समय कार को झुकाना
        car.rotation.z = (targetX - car.position.x) * -0.1;
        car.rotation.y = Math.PI + (targetX - car.position.x) * -0.05;
    }

    renderer.render(scene, camera);
}

// 9. स्क्रीन रोटेशन को हैंडल करना
const rotateScreenDiv = document.getElementById('rotate-screen');
function checkOrientation() {
    if (window.matchMedia("(orientation: portrait)").matches) {
        rotateScreenDiv.style.display = 'flex';
    } else {
        rotateScreenDiv.style.display = 'none';
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', checkOrientation);

// सब कुछ शुरू करना
checkOrientation();
animate();
