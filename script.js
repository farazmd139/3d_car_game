import * as THREE from 'three';

// 1. सीन, कैमरा, रेंडरर
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333); // गहरा ग्रे बैकग्राउंड
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. लाइट
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// 3. ज़मीन
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 200),
    new THREE.MeshStandardMaterial({ color: 0x555555 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// 4. कार (लाल क्यूब)
const car = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 2),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
car.position.y = 0.5;
scene.add(car);

// 5. ड्रैग कंट्रोल का लॉजिक
let touchStartX = 0;
let steering = 0;
const steeringAmount = 0.04;

renderer.domElement.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

renderer.domElement.addEventListener('touchmove', (e) => {
    const currentX = e.touches[0].clientX;
    const difference = currentX - touchStartX;
    
    // एक लिमिट के बाद ही घुमाएँ
    if (difference > 10) {
        steering = steeringAmount; // दाएँ
    } else if (difference < -10) {
        steering = -steeringAmount; // बाएँ
    } else {
        steering = 0;
    }
});

renderer.domElement.addEventListener('touchend', (e) => {
    steering = 0; // सीधा
});

// 6. गेम लूप (एनीमेशन)
const speed = 0.15;
function animate() {
    requestAnimationFrame(animate);

    // कार को घुमाएँ
    car.rotation.y -= steering;

    // कार को आगे बढ़ाएँ
    car.position.x -= Math.sin(car.rotation.y) * speed;
    car.position.z -= Math.cos(car.rotation.y) * speed;
        
    // कैमरे को कार के पीछे रखें
    const cameraOffset = new THREE.Vector3(0, 5, 9); // कैमरे की पोज़िशन
    cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y);
    camera.position.copy(car.position).add(cameraOffset);
    camera.lookAt(car.position);

    renderer.render(scene, camera);
}

// 7. विंडो का साइज़ बदलने पर एडजस्ट करें
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// गेम शुरू करें
animate();
