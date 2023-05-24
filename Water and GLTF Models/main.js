import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

/* CREATE SCENE, CAMERA, RENDERER, CONTROLS, AND LIGHT */

  let ship;
  let water, sun;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );
  const renderer = new THREE.WebGLRenderer( { canvas: document.querySelector('#bg'), alpha: true });
  const controls = new OrbitControls( camera, renderer.domElement ); 
  camera.position.set(50, 15, 1); 

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.render( scene, camera );

  scene.add( camera );

/* END SCENE, CAMERA, RENDERER, CONTROLS, AND LIGHT */

/* CREATE ENVIRONMENT */

  sun = new THREE.Vector3();
  const waterGeometry = new THREE.PlaneGeometry( 50000, 50000 );
  water = new Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load('./textures/waternormals.jpg', function ( texture ) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      } ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 1,
    }
  );
  water.rotation.x = - Math.PI / 2;
  scene.add( water );

  const sky = new Sky();
  sky.scale.setScalar( 50000 );
  scene.add( sky );

  const parameters = {
    elevation: 0,
    azimuth: 90,
  };

  const pmremGenerator = new THREE.PMREMGenerator( renderer );
  let renderTarget;

  function updateSun() {

    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    if ( renderTarget !== undefined ) renderTarget.dispose();

    renderTarget = pmremGenerator.fromScene( sky );

    scene.environment = renderTarget.texture;

  }
  updateSun();


/* END ENVIRONMENT */

/* CREATE MODELS */

  const characterLoader = new GLTFLoader();
  characterLoader.load('./models/astronaut/scene.gltf', (gltf) => {
    gltf.scene.scale.set( 1, 1, 1 );
    scene.add(gltf.scene);
    gltf.scene.position.y = -2;
    gltf.scene.rotation.y = (Math.PI / 2);
  });

  const shipLoader = new GLTFLoader();
  shipLoader.load('./models/spaceship/scene.gltf', (gltf) => {
    gltf.scene.scale.set( 1, 1, 1 );
    scene.add(gltf.scene);
    gltf.scene.position.y = 150;
    gltf.scene.position.z = -1000;
    gltf.scene.position.x = 500;
    ship = gltf.scene;
  });

/* END MODELS */

/* CREATE WINDOW RESIZE FUNCTION */

  window.addEventListener('resize', onWindowResize, false)
  function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      animate()
  }

/* END WINDOW RESIZE FUNCTION */

/* CREATE ANIMATE FUNCTION */

  function animate() {

    const time = performance.now() * 0.0001;
    water.material.uniforms[ 'time' ].value += 1.0 / 120.0;

    ship.position.z += 1;

    if(ship.position.z >= 1000){
      ship.position.set(500, 150, -1000)
    }

    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );

  }
  animate();

/* EDN ANIMATE FUNCTION */