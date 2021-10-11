/* Prac 5: Texturas en Threejs  */

// Objetos estándar
var renderer, orbitCamera, orbitCameraControls, cenitCamera, scene;
var L = 100// Semilado de la caja ortográfica

// Globales
var robot, base, brazo, antebrazo, mano, angulo, pinzaIzq, pinzaDer;
var xSpeed = 8;
var ySpeed = 8;
// GUI
var effectController;

//Acciones
init();
setupGUI();
loadScene();
render();

// Función de inicialización
function setupGUI(){
    
    effectController = {
        giroBase: 0.0,
        giroBrazo: 0.0,
        giroAntebrazoY: 0.0,
        giroAntebrazoZ: 0.0,
        giroPinza: 0.0,
        separacionPinza: 7
    }

    var gui = new dat.GUI();
    var carpeta = gui.addFolder("Control robot");
    carpeta.add(effectController, "giroBase", -180, 180, 1).name("Giro Base");
    carpeta.add(effectController, "giroBrazo", -45, 45, 1).name("Giro Brazo");
    carpeta.add(effectController, "giroAntebrazoY", -180, 180, 1).name("GiroY Antebrazo");
    carpeta.add(effectController, "giroAntebrazoZ", -90, 90, 1).name("GiroZ Antebrazo");
    carpeta.add(effectController, "giroPinza", -40, 220, 1).name("Giro Pinza");
    carpeta.add(effectController, "separacionPinza", 0, 15, 1).name("Separación inza");
}

function init(){
    
    // Instanciar el motor, canvas, escena y camara

    // Motor
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( new THREE.Color(0xFFFFFF));
    renderer.shadowMap.enabled = true;
    // Añadimos el canvas del renderer al container del html
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Camaras
    ar = window.innerWidth/window.innerHeight
    initCameras(ar)

    // Impedimos que render borre automaticamente lo que hay dibujado
    renderer.autoClear = false;

    window.addEventListener("resize", updateAspectRatio);
    document.addEventListener("keydown", onDocumentKeyDown, false);

}

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 37) {
        base.position.z += ySpeed;
    } else if (keyCode == 39) {
        base.position.z -= ySpeed;
    } else if (keyCode == 38) {
        base.position.x -= xSpeed;
    } else if (keyCode == 40) {
        base.position.x += xSpeed;
    }
}

function initCameras(ar){
    
    //
    // Inicializamos la cámara cenital
    // 
    if(ar > 1){//El eje y no se modifica pues es el pequeño
        cenitCamera = new THREE.OrthographicCamera(-L, L, L, -L, -500, 500); 
    }else{ // Al reves, ahora dividimos para hacer mas gránde el eje y
        cenitCamera = new THREE.OrthographicCamera(-L, L, L, -L , -500, 500);
    }
    // Colocamos la cámara cenital
    cenitCamera.position.set(0,L,0);
    // Rotamos la cámara cenital
    // La camara cenital apunta al origen de coordenadas
    cenitCamera.lookAt(0,0,0);
    // Hay que modificar también el vector up
    cenitCamera.up = new THREE.Vector3(0,0,-1);
    // La añadimos a la escena
    scene.add(cenitCamera)


    //
    // Inicializamos la cámara con movimiento orbit
    //
    orbitCamera = new THREE.PerspectiveCamera(75, ar, 0.1, 1000);
    orbitCamera.position.set(250, 280, 250);
    // Añadimos cameraControls a la cámara perspectiva
    orbitCameraControls = new THREE.OrbitControls(orbitCamera, renderer.domElement);
    // La cámara apunta al origen de coordenadas
    orbitCameraControls.target.set(0,0,0)
    // La añadimos a la escena
    scene.add(orbitCamera)
    // Disable controls to use them to move robot
    orbitCameraControls.enableKeys = false;

    // Luces
    
    var luzAmbiente = new THREE.AmbientLight(0xFFFFFF,0.7);
    scene.add(luzAmbiente);

    var luzPuntual = new THREE.PointLight(0xFFFFFF,0.5);
    luzPuntual.position.set(-100,200,-100);
    //scene.add(luzPuntual);

    var luzFocal = new THREE.SpotLight(0xFFFFFF,1);
    luzFocal.position.set(400,500,400);
    luzFocal.target.position.set(0,0,0);
    luzFocal.angle = Math.PI / 10;
    luzFocal.penumbra = 0.2;
    luzFocal.castShadow = true;
    luzFocal.shadow.camera.near = 0.5;
    luzFocal.shadow.camera.far = 2000;
    scene.add(luzFocal);

}

function updateAspectRatio(){
    
    // Le informamos al renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Le informamos a la cámara principal del nuevo ar
    var ar = window.innerWidth / window.innerHeight;
    orbitCamera.aspect = ar;
    // Necesitamos updatear la matriz de la cámara principal
    orbitCamera.updateProjectionMatrix(); 

}

function loadScene(){
    
    // Añadimos axes helper
    scene.add(new THREE.AxesHelper(2000));
    
    // Path principal de texturas
    var path = "../images/";

    // Creamos un material común a todas los objetos de la escena
    var material = new THREE.MeshBasicMaterial({color: 'red', wireframe: true});

    // Añadimos el suelo a la escena
    // Creamos la textura del suelo
    var txsuelo = new THREE.TextureLoader().load(path+"pisometalico_1024.jpg");
    var matsuelo = new THREE.MeshLambertMaterial({ color: 'white', map: txsuelo});
    // Creamos la geometria
    var geometriaSuelo = new THREE.PlaneGeometry(1000,1000,100,100);
    var suelo = new THREE.Mesh(geometriaSuelo, matsuelo);
    suelo.rotation.x = -Math.PI / 2;
    // Añadimos sombra al suelo
    suelo.receiveShadow = true;
    scene.add(suelo);

    
    // Creamos un objeto que contendrá todas las partes del robot
    robot = new THREE.Object3D();

    // Creamos la base del robot
    // Creamos el material
    var txbase = new THREE.TextureLoader().load(path+"metal_128x128.jpg");
    var matbase = new THREE.MeshLambertMaterial({color:'grey',map:txbase});
    // Creamos la geometria
    var geometriaBase = new THREE.CylinderGeometry(50,50,15, 30, 1);
    base = new THREE.Mesh(geometriaBase, matbase)
    // Añadimos sombras
    base.receiveShadow = true;
    base.castShadow = true;
    // Añadimos la base al robot
    robot.add(base);

    // Creamos el brazo del robot
    brazo = new THREE.Object3D();
    // Añadimos el brazo al robot
    base.add(brazo)
    
    // Creamos el esparrago (cilindro cerca de la base)
    // Creamos la geometria
    var geometriaEsparrago = new THREE.CylinderGeometry(20, 20, 18, 15, 1);
    var esparrago = new THREE.Mesh(geometriaEsparrago, matbase);
    // Añadimos sombras
    esparrago.castShadow = true;
    esparrago.receiveShadow = true;
    // Rotamos el esparrago
    esparrago.rotation.x = Math.PI / 2;
    // Añadimos esparrago al brazo
    brazo.add(esparrago);

    // Creamos la rotula (esfera encima de la base)
    // Creamos la textura
    var paredes = [ path+"posx.jpg", path+"negx.jpg",
                    path+"posy.jpg", path+"negy.jpg",
                    path+"posz.jpg", path+"negz.jpg"];   
    var txmapaEntorno = new THREE.CubeTextureLoader().load(paredes);
    var matEntorno = new THREE.MeshPhongMaterial({color:'white',
                                                specular:'white',
                                                shininess: 20,
                                                envMap: txmapaEntorno});
    var geometriaRotula = new THREE.SphereGeometry(20, 10, 10);
    var rotula = new THREE.Mesh(geometriaRotula, matEntorno);
    // Trasladamos la rotula para que este 120 hacia arriba (eje y)
    rotula.position.set(0, 120, 0);
    // Añadimos sombras
    rotula.castShadow = true;
    rotula.receiveShadow = true;
    brazo.add(rotula)

    // Creamos un eje que conecte esparrago y rotula
    var geometriaEje = new THREE.BoxGeometry(18,120,12);
    var eje = new THREE.Mesh(geometriaEje, matbase);
    // Trasladamos la conexion 60 hacía arriba (eje y)
    eje.position.set(0,60,0);
    // Añadimos sombras
    eje.castShadow = true;
    eje.receiveShadow = true;
    // Añadimos eje al brazo
    brazo.add(eje);

    // Creamos el antebrazo del robot
    antebrazo = new THREE.Object3D();
    // Añadimos el antebrazo al brazo
    brazo.add(antebrazo)

    // Creamos el cilindro que está a la altura del codo
    // Creamos la textura
    var matdisco = new THREE.MeshPhongMaterial({color:'grey',
                                                specular:'grey',
                                                shininess: 50,
                                                map: txbase});
    var geometriaDisco = new THREE.CylinderGeometry(22,22,6,40,2)
    var disco = new THREE.Mesh(geometriaDisco, matdisco);
    // Añadimos sombras
    disco.castShadow = true;
    disco.receiveShadow = true;
    // Añadimos el disco al antebrazo
    antebrazo.add(disco)
    
    // Creamos el cilindro que hace de mano
    // Creamos la textura
    var matmano = new THREE.MeshLambertMaterial({color:'red',map:txbase});
    var geometriaMano = new THREE.CylinderGeometry(15,15,40,20,1);
    mano = new THREE.Mesh(geometriaMano, matmano);
    // Trasladamos la mano para que esté por encima del codo (eje y 120+80)
    mano.position.set(0,80,0);
    // Rotamos la mano
    mano.rotation.x = Math.PI / 2;
    // Añadimos sombras
    mano.castShadow = true;
    mano.receiveShadow = true;
    // Añadimos la mano al antebrazo
    antebrazo.add(mano)
    
    // Añadimos los nervios entre el disco y la mano
    // Primero creamos un objeto que contendrá las 4 conexiones
    var nervios = new THREE.Object3D();
    // Creamos la geometria y las 4 conexiones, traslandolas de manera simétrica
    var geometriaNervios = new THREE.BoxGeometry(4,80,4);
    var nervio1 = new THREE.Mesh(geometriaNervios, matdisco);
    nervio1.position.set(8,0,8);
    var nervio2 = new THREE.Mesh(geometriaNervios, matdisco);
    nervio2.position.set(8,0,-8);
    var nervio3 = new THREE.Mesh(geometriaNervios, matdisco);
    nervio3.position.set(-8,0,-8);
    var nervio4 = new THREE.Mesh(geometriaNervios, matdisco);
    nervio4.position.set(-8,0,8);
    // Añadimos los 4 nervios
    nervios.add(nervio1);
    nervios.add(nervio2);
    nervios.add(nervio3);
    nervios.add(nervio4);
    // Trasladamos todas las conexiones hacia arriba (eje y 120 + 80/2)
    nervios.position.set(0,40,0);
    // Añadimos sombra a los 4 nervios
    nervio1.castShadow = true;
    nervio2.castShadow = true;
    nervio3.castShadow = true;
    nervio4.castShadow = true;
    nervio1.receiveShadow = true;
    nervio2.receiveShadow = true;
    nervio3.receiveShadow = true;
    nervio4.receiveShadow = true;
    // Añadimos los nervios al antebrazo
    antebrazo.add(nervios)

    // Colocamos el antebrazo en la posición correcta
    antebrazo.position.set(0,120,0);
    
    // Creación de la pinza
    var pinzaGeo = new THREE.Geometry();
    var coordenadasPinza = [
       0,0,0,
       0,0,4,
       0,20,4,
       0,20,0,
       19,0,0,
       19,0,4,
       19,20,4,
       19,20,0,
       38,4,0,
       38,4,2,
       38,16,2,
       38,16,0
    ];

    var indicesPinza = [
        0,1,2,
        0,2,3,
        1,5,6,
        1,6,2,
        2,6,3,
        6,7,3,
        4,0,7,
        0,3,7,
        0,4,5,
        0,5,1,
        5,9,10,
        5,10,6,
        10,11,7,
        10,7,6,
        8,4,11,
        4,7,11,
        4,8,9,
        4,9,5,
        9,8,11,
        9,11,10
    ];

    // Construye vertices y los inserta en la pinza
    for(var i=0; i<coordenadasPinza.length; i+=3) {
        var vertice = new THREE.Vector3(coordenadasPinza[i], coordenadasPinza[i+1], coordenadasPinza[i+2]);
        pinzaGeo.vertices.push(vertice);
    }

    // Construye caras y las inserta en la pinzaDer
    for(var i=0; i<indicesPinza.length; i+=3){
        var triangulo = new THREE.Face3(indicesPinza[i],indicesPinza[i+1],indicesPinza[i+2]);
        pinzaGeo.faces.push(triangulo);
    }

    // Creamos los vectores normales
    pinzaGeo.computeVertexNormals();

    // Creamos el mesh y lo añadimos al robot
    pinzaIzq = new THREE.Mesh(pinzaGeo, matbase);
    pinzaDer = new THREE.Mesh(pinzaGeo, matbase);
    mano.add(pinzaIzq);
    mano.add(pinzaDer);
    
    // Colocamos la pinza izquierda
    pinzaIzq.rotation.x = -Math.PI / 2;
    pinzaIzq.position.set(2,15,10);
    
    // Colocamos la pinza derecha
    pinzaDer.rotation.x = Math.PI / 2;
    pinzaDer.position.set(2,-15,-10);

    // Añadimos las sombras
    pinzaDer.castShadow = true;
    pinzaDer.receiveShadow = true;

    // Añadimos el robot a la escena
    scene.add(robot);

    // Habitacion
	var shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = txmapaEntorno;

	var matparedes = new THREE.ShaderMaterial({
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		//dephtWrite: false,
		side: THREE.BackSide
	});

	var habitacion = new THREE.Mesh( new THREE.CubeGeometry(2000,2000,2000),matparedes);
	scene.add(habitacion);

}

function update(){  
    
    // Añadir animación a esfera y cubo a la vez
    angulo += 0.005;
    //robot.rotation.y = angulo;
}

function render(){
    
    requestAnimationFrame(render);
    update();
    
    // Borramos el renderizado anterior
    renderer.clear()
    
    // Giro de la base
    var giro = effectController.giroBase;
    angulo = giro * Math.PI/180;
    base.rotation.y = angulo;

    // Giro del brazo
    var giro = effectController.giroBrazo;
    angulo = giro * Math.PI/180;
    brazo.rotation.z = -angulo;

    // Giro antebrazo Y
    var giro = effectController.giroAntebrazoY;
    angulo = giro * Math.PI/180;
    antebrazo.rotation.y = angulo;

    // Giro antebrazo Z
    var giro = effectController.giroAntebrazoZ;
    angulo = giro * Math.PI/180;
    antebrazo.rotation.z = angulo;

    // Giro pinza
    var giro = effectController.giroPinza;
    angulo = giro * Math.PI/180;
    mano.rotation.y = angulo;

    // Distancia pinza
    var sep = effectController.separacionPinza;
    pinzaIzq.position.set(2,sep,10)
    pinzaDer.position.set(2,-sep,-10)

    // Renderizamos la vista principal
    renderer.setViewport(0,0,window.innerWidth, window.innerHeight);
    renderer.render(scene, orbitCamera);
    // Renderizamos la vista cenital
    min = Math.min(window.innerHeight, window.innerWidth)
    renderer.setViewport(0,0,min/4, min/4);
    renderer.render(scene, cenitCamera);
}