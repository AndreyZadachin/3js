var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      var renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true, antialias: true, alpha: true });
      var orbitControl = new OrbitControls(camera, renderer.domElement);

      var raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2();

      raycaster.layers.set(0)

      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );

      var loader = new GLTFLoader();
      loader.load('./DamagedHelmet.glb',
      (gltf) => {
        scene.add(gltf.scene)
      })
      loader.load('./DamagedHelmet.glb',
        (gltf) => {
          gltf.scene.position.set(2, 2, 2)
          scene.add(gltf.scene)
        })

      scene.background = new THREE.Color(0xffffff)
      var light = new THREE.HemisphereLight(0xffffff)
      scene.add(light)


      camera.position.z = 25;
      camera.layers.enable(1);

      var draggableObjects = scene.children
      var dragControl = new DragControls(draggableObjects, camera, renderer.domElement );
      dragControl.addEventListener('drag', function (event) {
        event.object.material.emissive.set(0xaaaaaa)
      })
      dragControl.addEventListener('dragend', function () {
        orbitControl.enabled = true
      })
      dragControl.addEventListener('dragstart', function () {
        orbitControl.enabled = false
      })
      function render() {
        window.addEventListener( 'pointermove', function (event) {
          pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
          // eslint-disable-next-line no-mixed-spaces-and-tabs
          //eslint-disable-next-line no-mixed-spaces-and-tabs
          pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        });
        window.requestAnimationFrame( render );
        raycaster.setFromCamera(pointer, camera)
        orbitControl.update();

        var arView = new ARView(vrDisplay, renderer);
        var camera = new ARPerspectiveCamera(vrDisplay, 60, window.innerWidth / window.innerHeight, vrDisplay.depthNear, vrDisplay.depthFar);
        var vrControls = new VRControls(camera);

        update();

        function update() {
          // Update our controls/camera, the ARView rendering,
          // and our three.js scene
          vrControls.update();
          arView.render();
          renderer.clearDepth();
          renderer.render(scene, camera);
          vrDisplay.requestAnimationFrame(update);
        }
        renderer.render( scene, camera );
      }
      render();

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.set(0, 3, 8);
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      // var controls = new THREE.OrbitControls(camera, renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 1.0));

      var sizeBound = new THREE.Vector3(4, 4, 4);

      var b = new THREE.Mesh(new THREE.BoxBufferGeometry(sizeBound.x, sizeBound.y, sizeBound.z), new THREE.MeshBasicMaterial());
      var boxHelper = new THREE.BoxHelper(b);
      scene.add(boxHelper);

      var loader = new GLTFLoader();
      loader.load("https://raw.githack.com/AR-js-org/AR.js/master/aframe/examples/image-tracking/nft/trex/scene.gltf", (gltf) => {

        scaleToFit(gltf.scene, sizeBound); // умещаем в заданные размеры

        let b = new THREE.Box3().setFromObject(gltf.scene);
        gltf.scene.position.sub(b.getCenter()); // центрируем
        gltf.scene.position.y -= (sizeBound.y - b.getSize().y) * 0.5; // опускаем к "полу"

        scene.add(gltf.scene); // добавляем в сцену
      });



function scaleToFit(obj, bound) {
  let box = new THREE.Box3().setFromObject(obj);
  let size = new THREE.Vector3();
  box.getSize(size);
  let vScale = new THREE.Vector3().copy(bound).divide(size);
  let scale = Math.min(vScale.x, Math.min(vScale.y, vScale.z));
  obj.scale.setScalar(scale);
}

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
});