import * as THREE from 'three';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';



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


