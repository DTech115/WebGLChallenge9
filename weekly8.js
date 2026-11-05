import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ----------------------------------------------------
// Scene
// ----------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// ----------------------------------------------------
// Camera
// ----------------------------------------------------
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(20, 15, 20);

// ----------------------------------------------------
// Renderer
// ----------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

// ----------------------------------------------------
// Orbit Controls
// Allows Zoom, Pan, Orbit (Tilt/Rotate)
// ----------------------------------------------------
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 3, -2);


const loader = new THREE.TextureLoader();


// ====================================================
// GROUND
// ====================================================

const groundColor = loader.load("textures/stone/multicolored_pebble_floor_diff_1k.png");
const groundNormal = loader.load("textures/stone/multicolored_pebble_floor_nor_gl_1k.png");
const groundRoughness = loader.load("textures/stone/multicolored_pebble_floor_rough_1k.png");

[
    groundColor,
    groundNormal,
    groundRoughness
].forEach(texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
});

const groundMaterial = new THREE.MeshStandardMaterial({ 
    map: groundColor, 
    normalMap: groundNormal, 
    roughnessMap: groundRoughness
 }); // stone floor

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    groundMaterial
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ====================================================
// WALLS  (wallMaterial)
// ====================================================

const wallColor = loader.load("textures/stone/stone_wall_04_diff_1k.png");
const wallNormal = loader.load("textures/stone/stone_wall_04_nor_gl_1k.png");
const wallRoughness = loader.load("textures/stone/stone_wall_04_rough_1k.png");
[
    wallColor,
    wallNormal,
    wallRoughness
].forEach(texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
});

const wallMaterial = new THREE.MeshStandardMaterial({ 
    map: wallColor,
    color: 0xb3b3b3,
    normalMap: wallNormal,
    roughnessMap: wallRoughness
}); // walls, towers, well


// Back wall
const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(30, 8, 1.5),
    wallMaterial
);
backWall.position.set(0, 4, -12);
scene.add(backWall);

// Side walls
const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 8, 25),
    wallMaterial
);
leftWall.position.set(-14.25, 4, 1.4);
scene.add(leftWall);

const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 8, 25),
    wallMaterial
);
rightWall.position.set(14.25, 4, 1.4);
scene.add(rightWall);

// Crenellations along the top of the back wall
for (let x = -14; x <= 14; x += 4) {
    const merlon = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1.2, 1.5),
        wallMaterial
    );
    merlon.position.set(x, 8.6, -12);
    scene.add(merlon);
}

// ====================================================
// TOWERS  (wallMaterial + roofMaterial)
// ====================================================

const roofColor = loader.load("textures/stone/stacked_brick_wall_diff_1k.png");
const roofNormal = loader.load("textures/stone/stacked_brick_wall_nor_gl_1k.png");
const roofRoughness = loader.load("textures/stone/stacked_brick_wall_rough_1k.png");

const roofMaterial = new THREE.MeshStandardMaterial({ 
    map: roofColor,
    color: 0xffa3a3,
    normalMap: roofNormal,
    roughnessMap: roofRoughness
}); // tower roofs

for (const x of [-15, 15]) {
    const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(2.6, 2.6, 11, 24),
        wallMaterial
    );
    tower.position.set(x, 5.5, -12);
    scene.add(tower);

    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(3.4, 4.5, 24),
        roofMaterial
    );
    roof.position.set(x, 13.25, -12);
    scene.add(roof);
}

// ====================================================
// GATE  (gateMaterial + metalMaterial)
// ====================================================

const gateColor = loader.load("textures/wood/bark_willow_diff_1k.png");
const gateNormal = loader.load("textures/wood/bark_willow_nor_gl_1k.png");
const gateRoughness = loader.load("textures/wood/bark_willow_rough_1k.png");

const gateMaterial   = new THREE.MeshStandardMaterial({ 
    map: gateColor,
    color: 0xcfb294,
    normalMap: gateNormal,
    roughnessMap: gateRoughness
}); // gate, beams, posts


const gate = new THREE.Mesh(
    new THREE.BoxGeometry(4, 5, 0.4),
    gateMaterial
);
gate.position.set(0, 2.5, -11.05);
scene.add(gate);

// Iron bands

const metalColor = loader.load("textures/metal/metal_plate_02_diff_1k.png");
const metalNormal = loader.load("textures/metal/metal_plate_02_nor_gl_1k.png");
const metalRoughness = loader.load("textures/metal/metal_plate_02_rough_1k.png");

const metalMaterial = new THREE.MeshStandardMaterial({ 
    map: metalColor,
    normalMap: metalNormal,
    roughnessMap: metalRoughness,
    metalness: 1
}); // bands, hoops
for (const y of [1, 4]) {
    const band = new THREE.Mesh(
        new THREE.BoxGeometry(4.1, 0.25, 0.1),
        metalMaterial
    );
    band.position.set(0, y, -10.8);
    scene.add(band);
}

// ====================================================
// BANNERS  (bannerMaterial + gateMaterial for the rod)
// ====================================================

const bannerColor = loader.load("textures/fabric/quatrefoil_jacquard_fabric_diff_1k.png");
const bannerNormal = loader.load("textures/fabric/quatrefoil_jacquard_fabric_nor_gl_1k.png");
const bannerRoughness = loader.load("textures/fabric/quatrefoil_jacquard_fabric_rough_1k.png");

const bannerMaterial = new THREE.MeshStandardMaterial({ 
    map: bannerColor,
    normalMap: bannerNormal,
    roughnessMap: bannerRoughness,
    side: THREE.DoubleSide 
});       // banners

for (const x of [-6.5, 6.5]) {
    const banner = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 4),
        bannerMaterial
    );
    banner.position.set(x, 5, -11.2);
    scene.add(banner);

    const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 2.4, 12),
        gateMaterial
    );
    rod.rotation.z = Math.PI / 2;
    rod.position.set(x, 7.1, -11.15);
    scene.add(rod);
}

// ====================================================
// TORCHES  (gateMaterial stick)
// ====================================================
const flameMaterial  = new THREE.MeshStandardMaterial({ color: 0xff8a2a, emissive: 0xff6a10, emissiveIntensity: 2 }); // torches
for (const x of [-3.5, 3.5]) {
    const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 1, 10),
        gateMaterial
    );
    stick.position.set(x, 3.5, -11);
    scene.add(stick);

    const flame = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 12, 12),
        flameMaterial
    );
    flame.position.set(x, 4.2, -11);
    scene.add(flame);

    const torchLight = new THREE.PointLight(0xff8a3a, 20, 14);
    torchLight.position.set(x, 4.3, -10.7);
    scene.add(torchLight);
}

// ====================================================
// CRATES  (crateMaterial)
// ====================================================
const crateColor = loader.load("textures/wood/wooden_barrel_diff_1k.png");
const crateNormal = loader.load("textures/wood/wooden_barrel_nor_gl_1k.png");
const crateRoughness = loader.load("textures/wood/wooden_barrel_rough_1k.png");

const crateMaterial  = new THREE.MeshStandardMaterial({ 
    map: crateColor,
    color: 0xfce5c9,
    normalMap: crateNormal,
    roughnessMap: crateRoughness
}); // crates

const cratePositions = [
    [-10.5, 0.7, -9.5],
    [-8.5, 0.6, -9.8],
    [-9.8, 1.9, -9.6],   // stacked on top
    [11.2, 0.65, 6],
    [9.6, 0.5, 6.8]
];

for (const [x, y, z] of cratePositions) {
    const size = y * 2;
    const crate = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        crateMaterial
    );
    crate.position.set(x, y, z);
    scene.add(crate);
}

// ====================================================
// BARRELS  (crateMaterial + metalMaterial for hoops)
// ====================================================

const barrelPositions = [
    [-12, -6],
    [-11, -4.8],
    [12, -9.5],
    [10.6, -10.4],
    [12.3, 8.5]
];

for (const [x, z] of barrelPositions) {
    const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 1.3, 20),
        crateMaterial,
    );
    barrel.position.set(x, 0.65, z);
    scene.add(barrel);

    for (const y of [0.3, 1.0]) {
        const hoop = new THREE.Mesh(
            new THREE.CylinderGeometry(0.58, 0.58, 0.08, 20),
            metalMaterial
        );
        hoop.position.set(x, y, z);
        scene.add(hoop);
    }
}

// ====================================================
// WELL  (wallMaterial + waterMaterial + gateMaterial)
// ====================================================
const wellBase = new THREE.Mesh(
    new THREE.CylinderGeometry(1.3, 1.3, 1.1, 24),
    wallMaterial
);
wellBase.position.set(6.5, 0.55, 1.5);
scene.add(wellBase);

const waterColor = loader.load("textures/water/water 0342.jpg");
const waterNormal = loader.load("textures/water/water 0342normal.jpg");

const waterMaterial  = new THREE.MeshStandardMaterial({ 
    map: waterColor,
    normalMap: waterNormal,
    roughness: 0.1
}); // well water

const water = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 0.05, 24),
    waterMaterial
);
water.position.set(6.5, 1.12, 1.5);
scene.add(water);

for (const dx of [-1.1, 1.1]) {
    const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 2.5, 0.2),
        gateMaterial
    );
    post.position.set(6.5 + dx, 2.3, 1.5);
    scene.add(post);
}

const beam = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 0.2, 0.2),
    gateMaterial
);
beam.position.set(6.5, 3.5, 1.5);
scene.add(beam);

// ====================================================
// ROCKS  (rockMaterial)
// ====================================================

const rockColor = loader.load("textures/stone/rock_face_04_diff_1k.png");
const rockNormal = loader.load("textures/stone/rock_face_04_nor_gl_1k.png");
const rockRoughness = loader.load("textures/stone/rock_face_04_rough_1k.png");

const rockMaterial   = new THREE.MeshStandardMaterial({ 
    map: rockColor,
    normalMap: rockNormal,
    roughnessMap: rockRoughness
}); // rocks

const rockData = [
    [-12, 2, 0.9],
    [-11, 3.4, 0.5],
    [12.5, -3, 0.8],
    [-3.5, 9, 0.4]
];

for (const [x, z, s] of rockData) {
    const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1),
        rockMaterial
    );
    rock.scale.set(s, s * 0.7, s);
    rock.position.set(x, s * 0.5, z);
    scene.add(rock);
}

// ----------------------------------------------------
// Shadows: every mesh casts and receives
// ----------------------------------------------------
scene.traverse((obj) => {
    if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
    }
});

// ----------------------------------------------------
// Ambient Light
// ----------------------------------------------------
const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.6
);

scene.add(ambientLight);

// ----------------------------------------------------
// Directional Light
// ----------------------------------------------------
const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    2
);

directionalLight.position.set(20, 30, 10);
directionalLight.castShadow = true;

// widen the shadow area so the whole courtyard is covered
directionalLight.shadow.camera.left = -35;
directionalLight.shadow.camera.right = 35;
directionalLight.shadow.camera.top = 35;
directionalLight.shadow.camera.bottom = -35;
directionalLight.shadow.mapSize.set(2048, 2048);

scene.add(directionalLight);

// ----------------------------------------------------
// Toggle Lights
// ----------------------------------------------------
let lightsOn = true;

document
    .getElementById("toggleButton")
    .addEventListener("click", () => {

        lightsOn = !lightsOn;

        ambientLight.visible = lightsOn;
        directionalLight.visible = lightsOn;
    });

// ----------------------------------------------------
// Window Resize
// ----------------------------------------------------
window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

// ----------------------------------------------------
// Animation Loop
// ----------------------------------------------------
function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();