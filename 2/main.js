import * as THREE from '/three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

//Scene 
const _scene = new THREE.Scene();
_scene.background = new THREE.Color(0x000000); 
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Animation
function animate() {

	renderer.render( _scene, camera );
}

renderer.setAnimationLoop( animate );



let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

init();

function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 10;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 2.5 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    controls = new PointerLockControls( camera, document.body );

    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );

    instructions.addEventListener( 'click', function () {

        controls.lock();

    } );

    controls.addEventListener( 'lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    } );

    controls.addEventListener( 'unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    } );

    scene.add( controls.object );

    const onKeyDown = function ( event ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;

            case 'Space':
                if ( canJump === true ) velocity.y += 350;
                canJump = false;
                break;

        }

    };

    const onKeyUp = function ( event ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;

        }

    };

 //Pointlight
const _pointLight = new THREE.PointLight(0xFFFFFF, 160);
_pointLight.castShadow = true;
_pointLight.position.set(0,4,0)
_scene.add(_pointLight);


//AmbientLight
const _ambLight = new THREE.AmbientLight(0xFFFFF, .9);
_scene.add(_ambLight);

//Flooring
const _floorGeom = new THREE.PlaneGeometry(500, 500);
const _floorTexture = new THREE.TextureLoader().load('/examples/textures/grasslight-big.jpg');
_floorTexture.wrapS = THREE.RepeatWrapping;
_floorTexture.wrapT = THREE.RepeatWrapping;
_floorTexture.repeat.set(128,128);

// const _floorMat = new THREE.MeshStandardMaterial({color:0xffffff, side:THREE.DoubleSide}); //Standard materiale reagerer på lys
const _floorMat = new THREE.MeshPhongMaterial({color:0xFFFFFF, map:_floorTexture, side:THREE.DoubleSide});

const _floor = new THREE.Mesh(_floorGeom, _floorMat);
_floor.receiveShadow = true;
_floor.rotation.x = dtr(90);
_floor.position.y = -2.5;
_scene.add(_floor);


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
const cube = new THREE.Mesh( geometry, material );
_scene.add( cube );

camera.position.z = 5;

//DTR
function dtr(d) {
    return d * (Math.PI/180);
}


