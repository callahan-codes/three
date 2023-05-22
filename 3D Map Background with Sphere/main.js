import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


/* CREATE SCENE, CAMERA, RENDERER, CONTROLS, AND LIGHT */

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );
  const renderer = new THREE.WebGLRenderer( { canvas: document.querySelector('#bg'), alpha: true });
  const controls = new OrbitControls( camera, renderer.domElement );

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.render( scene, camera );


/* END SCENE, CAMERA, RENDERER, CONTROLS, AND LIGHT */


/* CREATE MESHES */

  const background = new RGBELoader();
  background.load('./models/neon_photostudio_4k.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;

  });


  const geometry = new THREE.SphereGeometry( 5, 64, 32 );
  const material = new THREE.MeshStandardMaterial( {
    color: 0x070707,
    metalness: 0,
    roughness: 0,
  } );

  const mesh = new THREE.Mesh( geometry, material );
  scene.add(mesh)

  mesh.add(camera)
  camera.position.x = 20;


/* END MESHES */



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


    mesh.rotation.y += 0.005

    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );

  }
  animate();

/* EDN ANIMATE FUNCTION */