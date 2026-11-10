import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader }
from 'https://unpkg.com/three@0.179.1/examples/jsm/loaders/GLTFLoader.js';

import * as SkeletonUtils
from 'https://unpkg.com/three@0.179.1/examples/jsm/utils/SkeletonUtils.js';

import { RGBELoader }
from 'https://unpkg.com/three@0.179.1/examples/jsm/loaders/RGBELoader.js';

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

// OBSTACLES LIST
const obstacles = [];

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

// KEY CONTROLS
window.addEventListener(
    'keydown',
    (e) => keys[e.key] = true
);
window.addEventListener(
    'keyup',
    (e) => keys[e.key] = false
);


// TEXTURE LOADER
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
obstacles.push(backWall);

// Side walls
const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 8, 25),
    wallMaterial
);
leftWall.position.set(-14.25, 4, 1.4);
scene.add(leftWall);
obstacles.push(leftWall);

const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 8, 25),
    wallMaterial
);
rightWall.position.set(14.25, 4, 1.4);
scene.add(rightWall);
obstacles.push(rightWall);

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
    obstacles.push(tower);

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

//gate front
const gate = new THREE.Mesh(
    new THREE.BoxGeometry(4, 5, 0.4),
    gateMaterial
);
gate.position.set(0, 2.5, -11.05);
scene.add(gate);
obstacles.push(gate);
//gate back
const gateBack = new THREE.Mesh(
    new THREE.BoxGeometry(4, 5, 0.4),
    gateMaterial
);
gateBack.position.set(0, 2.5, -13.05);
scene.add(gateBack);
obstacles.push(gateBack);

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
for (const y of [1, 4]) {
    const bandBack = new THREE.Mesh(
        new THREE.BoxGeometry(4.1, 0.25, 0.1),
        metalMaterial
    );
    bandBack.position.set(0, y, -13.3);
    scene.add(bandBack);
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
    obstacles.push(crate);
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
    obstacles.push(barrel);

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
obstacles.push(wellBase);

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
// MODELS
// ----------------------------------------------------
const SHOW_HITBOXES = false; 

// adds hitbox block manually
function addHitbox(x, z, width, depth, height = 4) {
    const block = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, visible: SHOW_HITBOXES })
    );
    block.position.set(x, height / 2, z);
    scene.add(block);
    obstacles.push(block);
}

addHitbox(-5, 3, 5, 4);          // market stand
addHitbox(-17, 26, 12, 14, 8);   // inn
addHitbox(18, 29, 34, 9, 8);     // stable (covers the horses too)
addHitbox(3, -10, 1.2, 1.2);     // knight
addHitbox(-3, -10, 1.2, 1.2);    // knight
addHitbox(-13, -30, 20, 20, 6);      // market 1
addHitbox(15, -30, 20, 20, 6);      // market 2

const modelLoader = new GLTFLoader();
const clock = new THREE.Clock();
const walkers = [];
const mixers = [];
const keys = {};
const obstacleBoxes = obstacles.map(m => new THREE.Box3().setFromObject(m));
let player;
const playerSpeed = 0.08;
let king;
let kingDirection = 1;
const kingSpeed = 4;
const kingMinZ = -6;
const kingMaxZ = 10;
let kingWalkAction;
let kingWaveAction;
let kingState = 'walk';
let waveTimer = 0;
const wavePause = 1.66;
let playerMixer;
let playerIdleAction;
let playerWalkAction;
let playerCurrentAction;

// PLAYER [donkey]
modelLoader.load('models/donkey.glb', (gltf) => {
    player = gltf.scene;
    player.position.set(0, 0, 15);
    player.rotation.y = Math.PI;
    scene.add(player);

    playerMixer = new THREE.AnimationMixer(player);
    playerIdleAction = playerMixer.clipAction(gltf.animations[12]);
    playerWalkAction = playerMixer.clipAction(gltf.animations[9]);

    playerIdleAction.play();
    playerCurrentAction = playerIdleAction;
    mixers.push(playerMixer);
});

// Market Stand
modelLoader.load('models/marketStand.glb', (gltf) => {
    const marketStand = gltf.scene;
    marketStand.position.set(-5, 0, 3);
    marketStand.scale.set(6, 6, 6);
    scene.add(marketStand);
    // obstacles.push(marketStand);
});

// Idle Knights
modelLoader.load('models/knight.glb', (gltf) => {
    const knightPositions = [[3, -10], [-3, -10]];

    knightPositions.forEach(([x, z]) => {
        const knight = SkeletonUtils.clone(gltf.scene);
        knight.position.set(x, 0, z);
        knight.scale.set(0.3, 0.3, 0.3);
        scene.add(knight);
        // obstacles.push(knight);

        const mixer = new THREE.AnimationMixer(knight);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
        mixers.push(mixer);
    });
});

// King walking
modelLoader.load('models/king.glb', (gltf) => {
    king = gltf.scene;
    king.position.set(0, 0, kingMinZ);
    king.rotation.y = kingDirection > 0 ? 0 : Math.PI;
    king.scale.set(2.2, 2.2, 2.2);
    scene.add(king);


    const mixer = new THREE.AnimationMixer(king);

    kingWalkAction = mixer.clipAction(gltf.animations[22]);
    const waveClip = gltf.animations[23];
    kingWaveAction = mixer.clipAction(waveClip);
    kingWalkAction.play();
    mixers.push(mixer);
});

// witch stand
modelLoader.load('models/witch.glb', (gltf) => {
    const witch = gltf.scene;
    witch.position.set(-8.5, 0, 3);
    witch.rotation.y = Math.PI / 2;
    witch.scale.set(2.2, 2.2, 2.2);
    scene.add(witch);

    const mixer = new THREE.AnimationMixer(witch);
    const action = mixer.clipAction(gltf.animations[23]);
    action.play();
    mixers.push(mixer);
});

// witch walker
modelLoader.load('models/witch.glb', (gltf) => {
    const spawns = [[-8.5, 0, 5], [-8.5, 0, 2]];

    spawns.forEach(([x, z]) => {
        const witch = SkeletonUtils.clone(gltf.scene);
        witch.position.set(x, 0, z);
        witch.rotation.y = Math.random() * Math.PI * 2;
        witch.scale.set(2.2, 2.2, 2.2);
        scene.add(witch);

        const mixer = new THREE.AnimationMixer(witch);
        const action = mixer.clipAction(gltf.animations[22]);
        action.time = Math.random() * action.getClip().duration;
        action.play();
        mixers.push(mixer);

        addWalker(witch, 3, 1.2)   // model, speed, hitbox size
    })
});

// SHREK
modelLoader.load('models/shrekToothlessDance.glb', (gltf) => {
    const shrek = gltf.scene;
    shrek.position.set(0, 7, -12);
    shrek.scale.set(2, 2, 2);
    scene.add(shrek);

    const mixer = new THREE.AnimationMixer(shrek);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
    mixers.push(mixer);
});

// adventurers walking
modelLoader.load('models/adventurer.glb', (gltf) => {
    const spawns = [[3, 0], [-2, 8], [9, -5], [-18, 10], [28, 23], [0, 0]];

    spawns.forEach(([x, z]) => {
        const adventurer = SkeletonUtils.clone(gltf.scene);
        adventurer.position.set(x, 0, z);
        adventurer.rotation.y = Math.random() * Math.PI * 2;
        adventurer.scale.set(2.2, 2.2, 2.2);
        scene.add(adventurer);

        const mixer = new THREE.AnimationMixer(adventurer);
        const action = mixer.clipAction(gltf.animations[22]);
        action.time = Math.random() * action.getClip().duration;
        action.play();
        mixers.push(mixer);

        addWalker(adventurer, 3, 1.2)   // model, speed, hitbox size
    })
});

// chickens!!!
modelLoader.load('models/chicken.glb', (gltf) => {
    const spawns = [[3, 2], [-1, 3], [5, -5], [-1, 4]];

    spawns.forEach(([x, z]) => {
        const chicken = new THREE.Group();
        chicken.position.set(x, 1, z);
        chicken.rotation.y = Math.random() * Math.PI * 2;

        const chickenModel = SkeletonUtils.clone(gltf.scene);
        chickenModel.rotation.y = Math.PI / 2;
        chickenModel.scale.set(0.5, 0.5, 0.5);
        chicken.add(chickenModel);
        scene.add(chicken);

        addWalker(chicken, 3, 1.2)   // model, speed, hitbox size
    })
});

// waffle
modelLoader.load('models/waffle.glb', (gltf) => {
    const waffle = gltf.scene;
    waffle.position.set(15.5, 0.8, 0);
    waffle.rotation.z = -Math.PI / 3;
    scene.add(waffle);
});

// stable
modelLoader.load('models/stable.glb', (gltf) => {
    const stable = gltf.scene;
    stable.position.set(18, 0, 28);
    stable.rotation.y = -Math.PI / 2;
    stable.scale.set(3, 3, 3);
    scene.add(stable);
    // obstacles.push(stable);
});

// inn
modelLoader.load('models/inn.glb', (gltf) => {
    const inn = gltf.scene;
    inn.position.set(-17, 0, 26);
    inn.rotation.y = -Math.PI / 2;
    inn.scale.set(5, 5, 5);
    scene.add(inn);
    // obstacles.push(inn);
});

// market stalls
modelLoader.load('models/marketstalls.glb', (gltf) => {
    const stalls = gltf.scene;
    stalls.position.set(-13, 0, -30);
    stalls.scale.set(10, 10, 10);
    scene.add(stalls);
});
modelLoader.load('models/marketstalls.glb', (gltf) => {
    const stalls = gltf.scene;
    stalls.position.set(15, 0, -30);
    stalls.rotation.y = -Math.PI / 2;
    stalls.scale.set(10, 10, 10);
    scene.add(stalls);
});

// horses for stable
function spawnStableHorses(file, positions) {
    modelLoader.load(file, (gltf) => {
        const idleIDs = [10, 11, 12];

        positions.forEach(([x, z]) => {
            const horse = SkeletonUtils.clone(gltf.scene);
            horse.position.set(x, 0, z);
            horse.rotation.y = Math.random() < 0.5 ? 0 : Math.PI;
            scene.add(horse);
            // obstacles.push(horse);

            const mixer = new THREE.AnimationMixer(horse);
            const pick = idleIDs[Math.floor(Math.random() * idleIDs.length)];
            const action = mixer.clipAction(gltf.animations[pick]);
            action.time = Math.random() * action.getClip().duration;
            action.play();
            mixers.push(mixer);
        });
    });
}

spawnStableHorses('models/horse.glb', [[23, 28], [5, 28]]);
spawnStableHorses('models/whiteHorse.glb', [[31, 28], [13, 28]]);

//function for walking peoples, add once per model after loading
function addWalker(model, speed = 1.5, size = 1) {
    walkers.push({
        model, speed,
        box: new THREE.Box3(),
        size: new THREE.Vector3(size, 2, size),
        wanderTimer: 1 + Math.random() * 3
    })
}

const nextPos = new THREE.Vector3();
const center = new THREE.Vector3();
const mapLimit = 40;

// updates for walking direction/angle/hitbox
function updateWalker(walker, dt) {

    // nudge heading every few seconds
    walker.wanderTimer -= dt;
    if (walker.wanderTimer <= 0) {
        walker.model.rotation.y += (Math.random() - 0.5) * 1.2;
        walker.wanderTimer = 2 + Math.random() * 4;
    }

    // where would I be next frame?
    const angle = walker.model.rotation.y;
    nextPos.set(
        walker.model.position.x + Math.sin(angle) * walker.speed * dt,
        walker.model.position.y,
        walker.model.position.z + Math.cos(angle) * walker.speed * dt
    );

    //hitbox around there
    center.copy(nextPos).setY(nextPos.y + 1);
    walker.box.setFromCenterAndSize(center, walker.size);

    //if blocked or map limit, turn around
    const outOfBounds = Math.abs(nextPos.x) > mapLimit || Math.abs(nextPos.z) > mapLimit;

    if (outOfBounds || obstacleBoxes.some(b => walker.box.intersectsBox(b))) {
        walker.model.rotation.y += Math.PI + (Math.random() - 0.5) * 0.8;
    } else {
        walker.model.position.copy(nextPos);
    }
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


const playerBox = new THREE.Box3();
const kingBox = new THREE.Box3();
let obstacleBox = new THREE.Box3();

// helper function
function playerCollision() {
    playerBox.setFromObject(player);

    for (const obstacle of obstacles) {
        obstacleBox.setFromObject(obstacle);
        if (playerBox.intersectsBox(obstacleBox)) {
            return true;
        }
    }
    return false;
}

// for animation changes
function setAction(next) {
    if (next === playerCurrentAction) {
        return;
    }
    next.reset().fadeIn(0.2).play();
    playerCurrentAction.fadeOut(0.2);
    playerCurrentAction = next;
}

// ----------------------------------------------------
// Animation Loop
// ----------------------------------------------------
function animate() {

    requestAnimationFrame(animate);

    controls.update();

    const delta = clock.getDelta();
    for (const mixer of mixers) {
        mixer.update(delta);
    }

    const dt = Math.min(delta, 0.1);
    walkers.forEach(walker => updateWalker(walker, dt));

    if (king) {
        if (kingState === 'walk') {
            king.position.z += kingDirection * kingSpeed * delta;
            
            kingBox.setFromObject(king);

            for (const obstacle of obstacles) {
                obstacleBox.setFromObject(obstacle);
                obstacleBox.expandByScalar(-5);

                if (kingBox.intersectsBox(obstacleBox)) {
                    kingDirection *= -1;
                    king.rotation.y = kingDirection > 0 ? 0 : Math.PI;
                    break;
                }
            }

            const end = kingDirection > 0 && king.position.z >= kingMaxZ;
            const start = kingDirection < 0 && king.position.z <= kingMinZ;

            if (end || start) {
                king.position.z = end ? kingMaxZ : kingMinZ;
                
                kingWalkAction.fadeOut(0.2);
                kingWaveAction.reset().fadeIn(0.2).play();

                kingState = "wave";
                waveTimer = wavePause;
            }
        } else if (kingState === 'wave') {
            waveTimer -= delta;

            if (waveTimer <= 0) {
                kingWaveAction.fadeOut(0.2);
                kingWalkAction.reset().fadeIn(0.2).play();
                kingDirection *= -1;
                king.rotation.y = kingDirection > 0 ? 0 : Math.PI;
                kingState = 'walk';
            }
        }
    }

    if (player) {
        // let dx = 0;
        // let dz = 0;
        
        if(keys["ArrowLeft"])
        {
            player.rotation.y += 2.5 * delta;
        }
        if(keys["ArrowRight"])
        {
            player.rotation.y -= 2.5 * delta;
        }
        
        const forward = (keys['ArrowUp'] ? 1 : 0) - (keys['ArrowDown'] ? 1 : 0);
        const dx = Math.sin(player.rotation.y) * playerSpeed * forward;
        const dz = Math.cos(player.rotation.y) * playerSpeed * forward;
    

        player.position.x += dx;
        if (dx !== 0 && playerCollision()) {
            player.position.x -= dx;
        }

        player.position.z += dz;
        if (dz !== 0 && playerCollision()) {
            player.position.z -= dz;
        }

        const turning = keys['ArrowLeft'] || keys['ArrowRight'];
        const moving = forward !== 0 || !!turning;

        const pureTurn = forward === 0 && turning;
        playerWalkAction.timeScale = (forward < 0 ? -1 : 1) * (pureTurn ? 0.5 : 1);
        setAction(moving ? playerWalkAction : playerIdleAction);
    }


    renderer.render(scene, camera);
}

animate();