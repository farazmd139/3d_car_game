import * as THREE from 'three';

// सीन, कैमरा, रेंडरर (कोई बदलाव नहीं)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 8); // कैमरा थोड़ा नज़दीक
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// लाइट (कोई बदलाव नहीं)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// ऑब्जेक्ट्स (कोई बदलाव नहीं)
const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 200), new THREE.MeshStandardMaterial({ color: 0x444444 })); // ट्रैक को लम्बा कर दिया
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const car = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 2), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
car.position.y = 0.5;
scene.add(car);
camera.lookAt(car.position);

// --- नया टिल्ट कंट्रोल लॉजिक ---

const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
let tilt = 0; // फ़ोन के झुकाव को स्टोर करेगा

// स्टार्ट बटन पर क्लिक करने पर गेम शुरू होगा
startButton.addEventListener('click', () => {
    // iPhone (iOS 13+) पर मोशन सेंसर की अनुमति माँगना
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                } else {
                    alert('Tilt controls require sensor permission.');
                }
            })
            .catch(console.error);
    } else {
        // Android या अन्य डिवाइस पर सीधे लिस्नर जोड़ें
        window.addEventListener('deviceorientation', handleOrientation);
    }

    // स्टार्ट स्क्रीन को छिपा दें और गेम शुरू करें
    startScreen.style.display = 'none';
    animate();
});

// यह फंक्शन फ़ोन के झुकने पर डेटा देगा
function handleOrientation(event) {
    // event.gamma फ़ोन का बाएँ-दाएँ झुकाव (-90 से 90) बताता है
    if (event.gamma) {
        tilt = event.gamma;
    }
}

// कार की स्पीड और घूमने की स्पीड
const speed = 0.15; // कार की स्पीड थोड़ी बढ़ा दी
const rotationSpeed = 0.03;

function animate() {
    requestAnimationFrame(animate);

    // 1. कार को लगातार आगे बढ़ाएँ
    car.position.x -= Math.sin(car.rotation.y) * speed;
    car.position.z -= Math.cos(car.rotation.y) * speed;

    // 2. टिल्ट के हिसाब से कार को घुमाएँ
    const tiltThreshold = 5; // कम से कम इतना झुकने पर कार मुड़ेगी
    if (tilt > tiltThreshold) {
        car.rotation.y += rotationSpeed; // दाएँ घुमाएँ
    } else if (tilt < -tiltThreshold) {
        car.rotation.y -= rotationSpeed; // बाएँ घुमाएँ
    }

    // कैमरे को कार के पीछे रखें
    const cameraOffset = new THREE.Vector3(0, 4, 7); // कैमरा थोड़ा और पास
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

// ध्यान दें: animate() अब स्टार्ट बटन क्लिक होने पर ही कॉल होगा।
