import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'dat.gui'
import Stats from 'three/addons/libs/stats.module.js';
import { gsap } from "gsap";

//Opsætning af GUI
// const gui = new GUI();

//Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 0, 200); //Tilføjer fog (farve, range 0-100)

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 2;
camera.position.x = 0;
camera.position.z = 50;

//Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true; //Renderer skygger

var _stats = new Stats(); //Stats FPS
document.body.appendChild(_stats.dom);

renderer.setPixelRatio(window.devicePixelRatio); //Pixel ratio loader i forhold til hvilket device der bruges
renderer.shadowMap.enabled = true; //Renderer skygger
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Amb light
const light = new THREE.AmbientLight( 0x181a4f, 0.1 ); // soft white light
scene.add( light );

//Point light
const _pointLight = new THREE.PointLight(0x3e4157, 300);
_pointLight.castShadow = true;
_pointLight.position.set(0,4,0)
scene.add(_pointLight);


// PointerLockControls setup
const controls = new PointerLockControls(camera, document.body);

// Lock the pointer on click
document.addEventListener('click', () => {
  controls.lock();
});

//Terrain loader
var terrain;
const loader = new OBJLoader();
loader.load('/examples/textures/desert.obj',function ( object ) {
  terrain = object;

  object.scale.set(20, 20, 20); //Str
  object.position.set(0,-5,0);

  terrain.traverse(function (child) {
    if(child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
    }
});

  scene.add( terrain );
  },);

//Træer
  var tree;
  const gloader = new GLTFLoader().setPath('/examples/models/');
  gloader.load('tree2.glb', function (gltf) {
  
      tree = gltf.scene;
  
      //Loop som genererer flere træer
      function placeTrees(numTrees, minDistance, radius) {
          const treePositions = [];
  
          for (let i = 0; i < numTrees; i++) {
              let newTree;
              let tooClose = true;
              let randomX, randomZ;
  
              while (tooClose) {
                  let r = Math.random() * radius; // Random radius between 0 and radius
                  let theta = Math.random() * Math.PI * 2; // Random angle between 0 and 2π

                  randomX = r * Math.cos(theta);
                  randomZ = r * Math.sin(theta);
                  tooClose = false;

                  for (let pos of treePositions) {
                      let distance = Math.sqrt(Math.pow(randomX - pos.x, 2) + Math.pow(randomZ - pos.z, 2));
                      if (distance < minDistance) {
                          tooClose = true;
                          break;
                      }
                  }
              }
  
              //Træ position efter afstandstjek
              treePositions.push({ x: randomX, z: randomZ });
  
              //Kloner træ
              newTree = tree.clone();
  
              //Klon str, position og rotation
              newTree.scale.set(10, 10, 10);
              newTree.position.set(randomX, 9, randomZ); //Random
              newTree.rotation.y = Math.random() * Math.PI * 2; //Random
  
              //Modtage og kaste skygger
              newTree.traverse(function (child) {
                  if (child.isMesh) {
                      child.castShadow = true;
                      child.receiveShadow = true;
                  }
              });
  
              //Sort
              newTree.traverse((object) => {
                  if (object.isMesh) {
                      object.material.color.set(0x000000);
                  }
              });
  
              scene.add(newTree);
          }
      }
  
      //(Antal træer, minimum distance i mellem, maks radius)
      placeTrees(30, 10, 50);
  });

//Farvet himmel gradient
const gradientMaterial = new THREE.ShaderMaterial({
  uniforms: {
    topColor: { value: new THREE.Color(0x040026) },  //Topfarve
    bottomColor: { value: new THREE.Color(0x9257e6) }, //Bundfarve
    offset: { value: 100 },
    exponent: { value: 0.2 }
  },
  vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
      float h = normalize( vWorldPosition + offset ).y;
      gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max(h, 0.0), exponent), 0.0 ) ), 1.0 );
    }
  `,
  side: THREE.BackSide //Renderer inderside
});

const skyGeometry = new THREE.SphereGeometry(700, 32, 15); 
const sky = new THREE.Mesh(skyGeometry, gradientMaterial);
scene.add(sky);

//Paper notes
const geometry = new THREE.PlaneGeometry(1, 1.5);
const material = new THREE.MeshBasicMaterial({ color: 0xbaafb3 });
const note = new THREE.Mesh(geometry, material);
scene.add(note);
note.castShadow = true;
note.receiveShadow = true;
note.position.set(0.1, -1.6, 42.5);
note.rotation.set(-1.59, -0.13, -1.24);

window.onload = function() {
  //Display:none så noten ikke er synlig når siden loades
  document.getElementById('note').style.display = 'none';
}

//Slår pointerlock fra når note vises
function displayNoteContent() {
  document.getElementById('note').style.display = 'block';
  controls.unlock();
  crosshair.style.display = 'none'; //Crosshair vises ikke når interaktion er i gang
}
window.closeNote = closeNote; 

//Lukker note og går til pointerlock igen
function closeNote() {
  document.getElementById('note').style.display = 'none';
  controls.lock();
  crosshair.style.display = 'block'; //Crosshair vises igen
}

//Sætter raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0, 0);
let isIntersectingNote = false;
const crosshair = document.getElementById('crosshair');

//Note interaction
function checkInteraction() {
  //Raycaster caster fra point 0, ved crosshairet
  mouse.x = 0;
  mouse.y = 0;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  isIntersectingNote = false;

  intersects.forEach(intersect => {
    if (intersect.object === note) {
      isIntersectingNote = true;
    }
  });

  if (isIntersectingNote) {
    itext.style.display = 'block'; // Show text
  } else {
    itext.style.display = 'none'; // Hide text
  }
}

//Tryk E for interaction med note
document.addEventListener('keydown', function(event) {
  if (event.key === 'e' && isIntersectingNote) {
    displayNoteContent();
  }  
});

const itext = document.getElementById('pressE');

//Movement
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

//Speed og retning
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let moveSpeed = 0.2;

//Eventlisteners til keys
document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW': 
      moveForward = true;
      break;
    case 'KeyA': 
      moveLeft = true;
      break;
    case 'KeyS': 
      moveBackward = true;
      break;
    case 'KeyD': 
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

var _d = 0;

// Render loop with movement logic
function animate() {
  requestAnimationFrame(animate);

  _d = gsap.ticker.deltaRatio(60); 

  _stars.rotation.y += .0001;

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

  _pointLight.position.set(camera.position.x, 8, camera.position.z);

  _stats.update();

  // Move the camera
  controls.moveForward(velocity.z);
  controls.moveRight(velocity.x);

  // Reset velocity after applying movement
  velocity.set(0, 0, 0);

  checkInteraction();

  // Render the scene
  renderer.render(scene, camera);
}

//Stjerner 
function createStars() {
    const _points = [];
    const _radius = 600;
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


//Animation loop
animate();

//Window size
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//Degrees to radians
function dtr(degrees) {
  return degrees * (Math.PI / 180);
}