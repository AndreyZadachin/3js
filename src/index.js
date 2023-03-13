import './pages/index.css';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// Добавляем сцену, камеру и средство визуализации
let camera, scene, renderer;

init();
render();

function init() {
  // Контейнер для канваса
  const container = document.createElement('div');
  document.body.appendChild(container);
// Объявление камеры, где поле зрения или масштаб сцены, соотношение сторон,
// ближняя и дальняя плоскость отсечения
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 3, 8);

// Объявили сцену и добавили цвет фона
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff)
  // var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
  // const helper = new THREE.HemisphereLightHelper( light, 5 );
  // scene.add( helper );
  // scene.add(light)
  // const light = new THREE.AmbientLight( 0x404040 ); // soft white light
  // scene.add( light );
  // Добавление света
  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 0, 100, 0 );
  
  scene.add( spotLight );


  const loader = new GLTFLoader().setPath('src/models/');
  loader.load('free_porsche_911_carrera_4s.glb', function (gltf) {
    // Материал
  const texture = new THREE.TextureLoader().load( 'src/models/123.png' );
  console.log(texture)
  new THREE.MeshBasicMaterial( { map: texture } );

  // scene.add(material)

    scene.add(gltf.scene);

    render();
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); 
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0, -0.2);
  controls.update();



  window.addEventListener('resize', onWindowResize);
}

	function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();
  }

// Анимация объекта
  function animate() {
    requestAnimationFrame( animate );
    scene.rotation.z += -0.01;
    renderer.render( scene, camera );
  }
  animate();
  

  function render() {
    renderer.render(scene, camera);
  }