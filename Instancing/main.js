import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


/* CREATE SCENE, CAMERA, RENDERER, CONTROLS, AND LIGHT */

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );
  const renderer = new THREE.WebGLRenderer( { canvas: document.querySelector('#bg') });
  const controls = new OrbitControls( camera, renderer.domElement );
  // controls.enableRotate = false;
  // controls.enableZoom = false;
  // scene.background = new THREE.Color(0x808080);

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  camera.position.setZ(0);
  camera.position.setX(900);
  camera.position.setY(-20);

  renderer.render( scene, camera );

  const pointLight = new THREE.PointLight(0xfffff, 1);
  pointLight.position.set( 1, 1, 1);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight(0xfffff);
  pointLight2.position.set( 825, 1, 1);
  scene.add(pointLight2)

/* END SCENE, CAMERA, RENDERER, CONTROLS, AND LIGHT */


/* CREATE MESHES */

  const matrix = new THREE.Matrix4();
  const triGeo = new THREE.RingGeometry( 1, 5, 3 ); 
  const triMat = new THREE.MeshPhongMaterial({ color: 0xFF6347, wireframe: false, side: THREE.DoubleSide });
  const triangle = new THREE.InstancedMesh( triGeo, triMat, 10000 );
  scene.add( triangle );
  const triDummy = new THREE.Object3D();
  for( let i = 0; i < 10000; i++){

        triDummy.position.x = Math.random() * 800 - 20;
        triDummy.position.z = -375 + (Math.random() * 800 - 20);
        triDummy.position.y = -350 + (Math.random() * 800 - 20);

        triDummy.updateMatrix();
        triangle.setMatrixAt(i, triDummy.matrix);
  }

  const icoGeo = new THREE.IcosahedronGeometry( 30, 0 );
  const icoMat = new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    metalness: .7,
    roughness: 0,
  } );
  const ico = new THREE.Mesh( icoGeo, icoMat );
  ico.position.x = 750;
  scene.add( ico );

/* END MESHES */


/* CREATE WINDOW RESIZE FUNCTION */

  window.addEventListener('resize', onWindowResize, false)
  function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      animation()
  }

/* END WINDOW RESIZE FUNCTION */


let dxPerFrame = 3;
function animate() {

  //Rotate Each instance of "Box"
    for( let i = 0; i < 10000; i++){
      triangle.getMatrixAt(i, matrix);
      matrix.decompose(triDummy.position, triDummy.rotation, triDummy.scale);
      
      triDummy.rotation.x += 0.005;

      triDummy.updateMatrix();
      triangle.setMatrixAt(i, triDummy.matrix);
    }
    triangle.instanceMatrix.needsUpdate = true;

  pointLight.position.x += dxPerFrame;
  if(pointLight.position.x >  900) dxPerFrame = -3;
  if(pointLight.position.x < 0) dxPerFrame =  3; 

  ico.rotation.x += 0.005;
  ico.rotation.y += 0.005;
  ico.rotation.z += 0.005;

  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );
}
animate();