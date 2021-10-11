/* Prac 3: Movimiento de cámara en Threejs  */

// Objetos estándar
var renderer, orbitCamera, orbitCameraControls, cenitCamera, scene;
var L = 100// Semilado de la caja ortográfica

// Globales
var robot, angulo = 0;

//Acciones
init();
loadScene();
render();

// Función de inicialización
function init(){
    
    // Instanciar el motor, canvas, escena y camara

    // Motor
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( new THREE.Color(0xFFFFFF));
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
    
    // Creamos un material común a todas los objetos de la escena
    var material = new THREE.MeshBasicMaterial({color: 'red', wireframe: true});

    // Añadimos el suelo a la escena
    var geometriaSuelo = new THREE.PlaneGeometry(1000,1000,10,10);
    var suelo = new THREE.Mesh(geometriaSuelo, material);
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);
    
    // Creamos un objeto que contendrá todas las partes del robot
    robot = new THREE.Object3D();

    // Creamos la base del robot
    var geometriaBase = new THREE.CylinderGeometry(50,50,15, 30, 1);
    var base = new THREE.Mesh(geometriaBase, material)
    // Añadimos la base al robot
    robot.add(base);

    // Creamos el brazo del robot
    var brazo = new THREE.Object3D();
    // Añadimos el brazo al robot
    base.add(brazo)
    
    // Creamos el esparrago (cilindro cerca de la base)
    var geometriaEsparrago = new THREE.CylinderGeometry(20, 20, 18, 15, 1);
    var esparrago = new THREE.Mesh(geometriaEsparrago, material);
    // Rotamos el esparrago
    esparrago.rotation.x = Math.PI / 2;
    // Añadimos esparrago al brazo
    brazo.add(esparrago);

    // Creamos la rotula (esfera encima de la base)
    var geometriaRotula = new THREE.SphereGeometry(20, 10, 10);
    var rotula = new THREE.Mesh(geometriaRotula, material);
    // Trasladamos la rotula para que este 120 hacia arriba (eje y)
    rotula.position.set(0, 120, 0);
    brazo.add(rotula)

    // Creamos un eje que conecte esparrago y rotula
    var geometriaEje = new THREE.BoxGeometry(18,120,12);
    var eje = new THREE.Mesh(geometriaEje, material);
    // Trasladamos la conexion 60 hacía arriba (eje y)
    eje.position.set(0,60,0);
    // Añadimos eje al brazo
    brazo.add(eje);

    // Creamos el antebrazo del robot
    var antebrazo = new THREE.Object3D();
    // Añadimos el antebrazo al brazo
    brazo.add(antebrazo)

    // Creamos el cilindro que está a la altura del codo
    var geometriaDisco = new THREE.CylinderGeometry(22,22,6,15,1)
    var disco = new THREE.Mesh(geometriaDisco, material);
    // Añadimos el disco al antebrazo
    antebrazo.add(disco)
    
    // Creamos el cilindro que hace de mano
    var geometriaMano = new THREE.CylinderGeometry(15,15,40,20,1);
    var mano = new THREE.Mesh(geometriaMano, material);
    // Trasladamos la mano para que esté por encima del codo (eje y 120+80)
    mano.position.set(0,80,0);
    // Rotamos la mano
    mano.rotation.x = Math.PI / 2;
    // Añadimos la mano al antebrazo
    antebrazo.add(mano)
    
    // Añadimos los nervios entre el disco y la mano
    // Primero creamos un objeto que contendrá las 4 conexiones
    var nervios = new THREE.Object3D();
    // Creamos la geometria y las 4 conexiones, traslandolas de manera simétrica
    var geometriaNervios = new THREE.BoxGeometry(4,80,4);
    var nervio1 = new THREE.Mesh(geometriaNervios, material);
    nervio1.position.set(8,0,8);
    var nervio2 = new THREE.Mesh(geometriaNervios, material);
    nervio2.position.set(8,0,-8);
    var nervio3 = new THREE.Mesh(geometriaNervios, material);
    nervio3.position.set(-8,0,-8);
    var nervio4 = new THREE.Mesh(geometriaNervios, material);
    nervio4.position.set(-8,0,8);
    // Añadimos los 4 nervios
    nervios.add(nervio1);
    nervios.add(nervio2);
    nervios.add(nervio3);
    nervios.add(nervio4);
    // Trasladamos todas las conexiones hacia arriba (eje y 120 + 80/2)
    nervios.position.set(0,40,0);
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
    var pinzaIzq = new THREE.Mesh(pinzaGeo, material);
    var pinzaDer = new THREE.Mesh(pinzaGeo, material);
    mano.add(pinzaIzq);
    mano.add(pinzaDer);
    
    // Colocamos la pinza izquierda
    pinzaIzq.rotation.x = -Math.PI / 2;
    pinzaIzq.position.set(2,15,10);
    
    // Colocamos la pinza derecha
    pinzaDer.rotation.x = Math.PI / 2;
    pinzaDer.position.set(2,-15,-10);

    // Añadimos el robot a la escena
    scene.add(robot);

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
    
    // Renderizamos la vista principal
    renderer.setViewport(0,0,window.innerWidth, window.innerHeight);
    renderer.render(scene, orbitCamera);
    // Renderizamos la vista cenital
    min = Math.min(window.innerHeight, window.innerWidth)
    renderer.setViewport(0,0,min/4, min/4);
    renderer.render(scene, cenitCamera);
}