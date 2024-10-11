import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

//Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);


// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 2; //Camera height above floor

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio); //Pixel ratio loader i forhold til hvilket device der bruges
renderer.shadowMap.enabled = true; //Renderer skygger
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


// PointerLockControls setup
const controls = new PointerLockControls(camera, document.body);

// Lock the pointer on click
document.addEventListener('click', () => {
  controls.lock();
});

// Movement variables
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Movement speed and direction
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const moveSpeed = 0.1;

// Keyboard event listeners for movement
document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW': // Move forward
      moveForward = true;
      break;
    case 'KeyA': // Move left
      moveLeft = true;
      break;
    case 'KeyS': // Move backward
      moveBackward = true;
      break;
    case 'KeyD': // Move right
      moveRight = true;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
      moveForward = false;
      break;
    case 'KeyA':
      moveLeft = false;
      break;
    case 'KeyS':
      moveBackward = false;
      break;
    case 'KeyD':
      moveRight = false;
      break;
  }
});

// Create a floor
const _floorGeom = new THREE.PlaneGeometry(500, 500);
const _floorTexture = new THREE.TextureLoader().load('/examples/textures/grasslight-big.jpg');
_floorTexture.wrapS = THREE.RepeatWrapping;
_floorTexture.wrapT = THREE.RepeatWrapping;
_floorTexture.repeat.set(128, 128);

const _floorMat = new THREE.MeshPhongMaterial({ map: _floorTexture, side: THREE.DoubleSide });
const _floor = new THREE.Mesh(_floorGeom, _floorMat);
_floor.rotation.x = -Math.PI / 2; // Rotate floor to be flat
scene.add(_floor);

// Create a cube for reference
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x0388fc });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Add a light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Render loop with movement logic
function animate() {
  requestAnimationFrame(animate);

  _stars.rotation.y += .00001;

  // Update movement direction based on keys pressed
  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize(); // Normalize to prevent faster diagonal movement

  // Apply movement velocity to camera
  if (moveForward || moveBackward) {
    velocity.z = direction.z * moveSpeed;
  }
  if (moveLeft || moveRight) {
    velocity.x = direction.x * moveSpeed;
  }

  // Move the camera
  controls.moveForward(velocity.z);
  controls.moveRight(velocity.x);

  // Reset velocity after applying movement
  velocity.set(0, 0, 0);

  // Render the scene
  renderer.render(scene, camera);
}

//Stjerner 
function createStars() {
    const _points = [];
    const _radius = 500;
    for (let i = 0; i < 2000; i++) {
        // Generate random spherical coordinates
        const _theta = Math.random() * Math.PI * 2;  // Random angle for x-z plane
        const _phi = Math.acos((Math.random() * 2) - 1); // Random polar angle for vertical axis

        // Convert spherical coordinates to Cartesian
        const _x = _radius * Math.sin(_phi) * Math.cos(_theta);
        const _y = _radius * Math.sin(_phi) * Math.sin(_theta);
        const _z = _radius * Math.cos(_phi);

        _points.push(new THREE.Vector3(_x, _y, _z));
    }

    const _geometry = new THREE.BufferGeometry().setFromPoints(_points);
    const _material = new THREE.PointsMaterial({ color: 0xFFFFFF, fog: false });
    const _stars = new THREE.Points(_geometry, _material);
    
    scene.add(_stars);
    return _stars;
}

var _stars = new createStars();


// Start the animation loop
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Helper function for degree-to-radian conversion
function dtr(degrees) {
  return degrees * (Math.PI / 180);
}