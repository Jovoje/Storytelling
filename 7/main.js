import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'dat.gui'
import Stats from 'three/addons/libs/stats.module.js';
import { gsap } from "gsap";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


//Opsætning af GUI
const gui = new GUI();

//Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
// scene.fog = new THREE.Fog(0x000000, 0, 200); //Tilføjer fog (farve, range 0-100)

// const geometry = new THREE.PlaneGeometry(1, 1.5);
// const material = new THREE.MeshBasicMaterial({ color: 0xbaafb3 });
// const paper = new THREE.Mesh(geometry, material);
// scene.add(paper);
// paper.castShadow = true;
// paper.receiveShadow = true;
// paper.position.set(0.1, -1.6, 42.5);
// paper.rotation.set(-1.59, -0.13, -1.24);

// //Position folder
// const pfolder = gui.addFolder("Camera position");
// pfolder.add(paper.position, 'x', -50, 50, .1);
// pfolder.add(paper.position, 'y', -50, 50, .1);
// pfolder.add(paper.position, 'z', -50, 50, .1);

// //Rotation folder
// const prfolder = gui.addFolder("Camera rotation");
// prfolder.add(paper.rotation, 'x', -dtr(180), dtr(180), .01);
// prfolder.add(paper.rotation, 'y', -dtr(180), dtr(180), .01);
// prfolder.add(paper.rotation, 'z', -dtr(180), dtr(180), .01);

//Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true; //Renderer skygger

let controls;


const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

// controls

controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents( window ); // optional

//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 50;
controls.maxDistance = 500;

controls.maxPolarAngle = Math.PI / 2;


var _stats = new Stats(); //Stats FPS
document.body.appendChild(_stats.dom);

renderer.setPixelRatio(window.devicePixelRatio); //Pixel ratio loader i forhold til hvilket device der bruges
renderer.shadowMap.enabled = true; //Renderer skygger
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Amb light
const light = new THREE.AmbientLight( 0x181a4f, 0.1 ); // soft white light
scene.add( light );

//Point light
const _pointLight = new THREE.PointLight(0x3e4157, 200);
_pointLight.castShadow = true;
_pointLight.position.set(0,4,0)
scene.add(_pointLight);

const _pointLight2 = new THREE.PointLight(0xffffff, 500);
_pointLight2.castShadow = true;
_pointLight2.position.set(-20.8, 2, 10)
scene.add(_pointLight2);

const directionalLight = new THREE.DirectionalLight( 0x3477eb, 0.05 );
scene.add( directionalLight );


// Lock the pointer on click
document.addEventListener('click', () => {
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
  // var tree;
  // const gloader = new GLTFLoader().setPath('/examples/models/');
  // gloader.load('tree2.glb', function (gltf) {
  
  //     tree = gltf.scene;
  
  //     //Loop som genererer flere træer
  //     function placeTrees(numTrees, minDistance, radius) {
  //         const treePositions = [];
  
  //         for (let i = 0; i < numTrees; i++) {
  //             let newTree;
  //             let tooClose = true;
  //             let randomX, randomZ;
  
  //             while (tooClose) {
  //                 let r = Math.random() * radius; // Random radius between 0 and radius
  //                 let theta = Math.random() * Math.PI * 2; // Random angle between 0 and 2π

  //                 randomX = r * Math.cos(theta);
  //                 randomZ = r * Math.sin(theta);
  //                 tooClose = false;

  //                 for (let pos of treePositions) {
  //                     let distance = Math.sqrt(Math.pow(randomX - pos.x, 2) + Math.pow(randomZ - pos.z, 2));
  //                     if (distance < minDistance) {
  //                         tooClose = true;
  //                         break;
  //                     }
  //                 }
  //             }
  
  //             //Træ position efter afstandstjek
  //             treePositions.push({ x: randomX, z: randomZ });
  
  //             //Kloner træ
  //             newTree = tree.clone();
  
  //             //Klon str, position og rotation
  //             newTree.scale.set(10, 10, 10);
  //             newTree.position.set(randomX, 9, randomZ); //Random
  //             newTree.rotation.y = Math.random() * Math.PI * 2; //Random
  
  //             //Modtage og kaste skygger
  //             newTree.traverse(function (child) {
  //                 if (child.isMesh) {
  //                     child.castShadow = true;
  //                     child.receiveShadow = true;
  //                 }
  //             });
  
  //             //Sort
  //             newTree.traverse((object) => {
  //                 if (object.isMesh) {
  //                     object.material.color.set(0x000000);
  //                 }
  //             });
  
  //             scene.add(newTree);
  //         }
  //     }
  
  //     //(Antal træer, minimum distance i mellem, maks radius)
  //     placeTrees(30, 10, 50);
  // });

//Farvet himmel gradient
const gradientMaterial = new THREE.ShaderMaterial({
  uniforms: {
    topColor: { value: new THREE.Color(0x040026) },  //Topfarve
    bottomColor: { value: new THREE.Color(0xff6166) }, //Bundfarve
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

//Tilføjer himmel til scene
const skyGeometry = new THREE.SphereGeometry(700, 32, 15); 
const sky = new THREE.Mesh(skyGeometry, gradientMaterial);
scene.add(sky);

var crates;
  const bloader = new GLTFLoader().setPath('/examples/models/');
  bloader.load('military_crates.glb', function (gltf) {
  
      crates = gltf.scene;
      crates.scale.set(5, 5, 5);
      crates.position.set(-4, 5, 0); //Random
    scene.add(crates)
  });



  var tent;
  const tloader = new GLTFLoader().setPath('/examples/models/');
  tloader.load('camp.glb', function (gltf) {
  
      tent = gltf.scene;
      tent.scale.set(3.5, 3.5, 3.5);
      tent.position.set(-35.2, -4.3, 18.8); //Random
      tent.rotation.set(0, 1.32, 0);

      // const cfolder = gui.addFolder("Camera position");
      // cfolder.add(tent.position, 'x', -50, 50, .1);
      // cfolder.add(tent.position, 'y', -50, 50, .1);
      // cfolder.add(tent.position, 'z', -50, 50, .1);
      
      // //Rotation folder
      // const crfolder = gui.addFolder("Camera rotation");
      // crfolder.add(tent.rotation, 'x', -dtr(180), dtr(180), .01);
      // crfolder.add(tent.rotation, 'y', -dtr(180), dtr(180), .01);
      // crfolder.add(tent.rotation, 'z', -dtr(180), dtr(180), .01);
      

      scene.add(tent);
  });

  // Create the plane geometry for the floor
  const planeGeometry = new THREE.PlaneGeometry(100, 100); // A large plane, adjust size as needed
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Gray color for the floor
  
  // Create the plane mesh using geometry and material
  const floor = new THREE.Mesh(planeGeometry, planeMaterial);
  
  // Rotate the plane to be flat on the ground (by default it is vertical)
  floor.rotation.x = - Math.PI / 2; // Rotate by 90 degrees (to lie flat)
  
  // Position the plane just below the tent
  floor.position.set(0, -5, 0); // Adjust the Y position so it is below the tent
  
  // Allow the plane to receive shadows
  floor.receiveShadow = true;


  const ffolder = gui.addFolder("floor position");
  ffolder.add(floor.position, 'x', -50, 50, .1);
  ffolder.add(floor.position, 'y', -50, 50, .1);
  ffolder.add(floor.position, 'z', -50, 50, .1);
  
  const fcfolder = gui.addFolder("floor rotation");
  fcfolder.add(floor.scale, 'x', -50, 50, .1);
  fcfolder.add(floor.scale, 'y', -50, 50, .1);
  fcfolder.add(floor.scale, 'z', -50, 50, .1);

  //Rotation folder
  const frfolder = gui.addFolder("flooor rotation");
  frfolder.add(floor.rotation, 'x', -dtr(180), dtr(180), .01);
  frfolder.add(floor.rotation, 'y', -dtr(180), dtr(180), .01);
  frfolder.add(floor.rotation, 'z', -dtr(180), dtr(180), .01);
  
  
  // Add the plane to the scene
  scene.add(floor);



//Paper notes array
const notes = [];
const noteContentIds = ['note1Text', 'note2Text', 'note3Text'];

//Create paper note
function createNote(position, rotation, contentId) {
  const geometry = new THREE.PlaneGeometry(1, 1.5);
  const material = new THREE.MeshBasicMaterial({ color: 0xbaafb3 }); //Note color
  const note = new THREE.Mesh(geometry, material);
  note.castShadow = true;
  note.receiveShadow = true;
  note.position.copy(position); // Set the position
  note.rotation.set(rotation.x, rotation.y, rotation.z); // Set the rotation
  scene.add(note);
  notes.push(note); // Add to the notes array
  noteContentIds.push(contentId); // Add the content ID for this note
}

//Notes
createNote(new THREE.Vector3(0.1, -1.6, 42.5), new THREE.Euler(-1.59, -0.13, -1.24), 'note1Text');
createNote(new THREE.Vector3(15.5, -1.6, -9.9), new THREE.Euler(-1.59, -0.13, 0.63), 'note2Text');
createNote(new THREE.Vector3(-23.1, -1, -49.6), new THREE.Euler(-1.66, 0.07, 0.07), 'note3Text');

//Press E and crosshair
const interactionText = document.getElementById('pressE');
const crosshair = document.getElementById('crosshair');

//Hide pointerlock and crosshair when note display
function displayNoteContent(noteIndex) {
  //HTML note content
  const noteContent = document.getElementById(noteContentIds[noteIndex]).innerHTML;
  
  //Set the note's content in the display area
  document.getElementById('note').innerHTML = noteContent;
  document.getElementById('note').style.display = 'block';
  document.getElementById('pressE').style.display = 'none';

  //Hide the crosshair when note is displayed
  crosshair.style.display = 'none';
  
}
//Close note
function closeNote() {
  document.getElementById('note').style.display = 'none';
 


  //Crosshair display when note is closed
  crosshair.style.display = 'block';
}

window.closeNote = closeNote; 

//Sætter raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0, 0);
let intersectedNoteIndex = null;

//Note interaction
function checkInteraction() {
  mouse.x = 0;
  mouse.y = 0;

  raycaster.setFromCamera(mouse, camera);
  
  const intersects = raycaster.intersectObjects(notes); // Check all notes

  if (intersects.length > 0) {
    const intersectedNote = intersects[0].object; // Get the first intersected note
    intersectedNoteIndex = notes.indexOf(intersectedNote); // Get the index of the intersected note
    interactionText.style.display = 'block'; // Show text
  } else {
    intersectedNoteIndex = null;
    interactionText.style.display = 'none'; // Hide text
  }
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'e' && intersectedNoteIndex !== null) {
    displayNoteContent(intersectedNoteIndex); // Display content based on the index
  }
});


var _d = 0;

// Render loop with movement logic
function animate() {
  requestAnimationFrame(animate);

  _d = gsap.ticker.deltaRatio(60); 

  _stars.rotation.y += .0001;


  _pointLight.position.set(camera.position.x, 8, camera.position.z);

  _stats.update();

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