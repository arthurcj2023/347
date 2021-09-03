import * as THREE from 'three';
import {FBXLoader, GLTFLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
let threejs;
let camera;
let scene;
let controls;
let FOV = 75;
let aspect;
let NEAR = 0.1;
let FAR = 1000.0;
let mixers = [];
let animations = [];
let previousraf = null;

async function initialize() {
  threejs = new THREE.WebGLRenderer({
    antialias: true,
  });
  threejs.shadowMap.enabled = true;
  threejs.shadowMap.type = THREE.PCFSoftShadowMap;
  threejs.setPixelRatio(window.devicePixelRatio);
  threejs.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(threejs.domElement);
  aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(FOV, aspect, NEAR, FAR);
  camera.position.set(75, 20, 0);
  scene = new THREE.Scene();
  let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
  light.position.set(20, 100, 10);
  light.target.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow.bias = -0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 500.0;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500.0;
  light.shadow.camera.left = 100;
  light.shadow.camera.right = -100;
  light.shadow.camera.top = 100;
  light.shadow.camera.bottom = -100;
  scene.add(light);
  light = new THREE.AmbientLight(0xFFFFFF, 4.0);
  scene.add(light);
  controls = new OrbitControls(camera, threejs.domElement);
  controls.target.set(0, 20, 0);
  controls.update();
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    './posx.jpg',
    './negx.jpg',
    './posy.jpg',
    './negy.jpg',
    './posz.jpg',
    './negz.jpg',
  ]);
  scene.background = texture;
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 10, 10),
    new THREE.MeshStandardMaterial({
        color: 0x202020,
    }));
  plane.castShadow = false;
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
  loadModel();
  window.addEventListener('keydown', event => {
    if (event.key == '1')
    {
      animations[0].stop();
      animations[1].stop();
      animations[2].stop();
      animations[0].play();
    }
    if (event.key == '2')
    {
      animations[0].stop();
      animations[1].stop();
      animations[2].stop();
      animations[1].play();
    }
    if (event.key == '3')
    {
      animations[0].stop();
      animations[1].stop();
      animations[2].stop();
      animations[2].play();
    }
    if (event.key == '4')
    {
      animations[0].stop();
      animations[1].stop();
      animations[2].stop();
    }
  }); 
  window.addEventListener('resize', () => {
    threejs.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
  animate();
}
function step(timeElapsed){
  const timeElapsedS = timeElapsed * 0.001;
  if (mixers) {
    mixers.map(m => m.update(timeElapsedS));
  }
}

function animate()
{
    requestAnimationFrame((t) =>{
        if (previousraf == null)
        {
            previousraf = t;
        }
        animate();
        controls.update();
        threejs.render(scene, camera);
        step(t - previousraf);
        previousraf = t;
    });
}

function loadModel()
{
  const loader = new FBXLoader();
  loader.setPath('./');
  loader.load('modelbase.fbx', (fbx) => {
    fbx.scale.setScalar(0.1);
    fbx.traverse(c => {
      c.castShadow = true;
    });

    let anim = new FBXLoader();
    anim.setPath('./');
    anim.load('modelbase.fbx', (anim) => {
      const m = new THREE.AnimationMixer(fbx);
      mixers.push(m);
      animations.push(m.clipAction(anim.animations[0]));
      animations.push(m.clipAction(anim.animations[2]));
      animations[1].setLoop(THREE.LoopOnce);
    });

    anim = new FBXLoader();
    anim.setPath('./');
    anim.load('modelbow.fbx', (anim) => {
      const m = new THREE.AnimationMixer(fbx);
      mixers.push(m);
      animations.push(m.clipAction(anim.animations[0]));
      animations[2].setLoop(THREE.LoopOnce);
    });
    
    scene.add(fbx);
  });
}

initialize();