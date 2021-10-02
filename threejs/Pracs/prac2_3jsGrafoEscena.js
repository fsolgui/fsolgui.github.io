/* Prac 2: Grafo de escena en Threejs  */

// Objetos estándar
var renderer, camera, scene;

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

    // Camara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

    camera.position.set(250, 280, 250);
    // La camara apunta al origen de coordenadas
    camera.lookAt(new THREE.Vector3(0,0,0));
}

function loadScene(){
    
    // Añadimos los ejes auxiliares
    scene.add(new THREE.AxesHelper(1100));
    
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
    // Creamos el hombro (cilindro cerca de la base)
    var geometriaHombro = new THREE.CylinderGeometry(20, 20, 18, 15, 1);
    var hombro = new THREE.Mesh(geometriaHombro, material);
    // Rotamos el hombro
    hombro.rotation.x = Math.PI / 2;
    // Creamos el codo (esfera encima de la base)
    var geometriaCodo = new THREE.SphereGeometry(20, 10, 10);
    var codo = new THREE.Mesh(geometriaCodo, material);
    // Trasladamos el codo para que este 120 hacia arriba (eje y)
    codo.position.set(0, 120, 0);
    // Creamos un eje que conecte hombro y codo
    var geometriaConexHombroCodo = new THREE.BoxGeometry(18,120,12);
    conexHombroCodo = new THREE.Mesh(geometriaConexHombroCodo, material);
    // Trasladamos la conexion 60 hacía arriba (eje y)
    conexHombroCodo.position.set(0,60,0);
    // Añadimos codo, hombro y su conexion al objeto brazo
    brazo.add(codo);
    brazo.add(hombro);
    brazo.add(conexHombroCodo);
    //Añadimos el brazo al robot;
    robot.add(brazo);

    // Creamos el antebrazo del robot
    var antebrazo = new THREE.Object3D();
    // Creamos el cilindro que está a la altura del codo
    var geometriaCilindroCodo = new THREE.CylinderGeometry(22,22,6,15,1)
    var cilindroCodo = new THREE.Mesh(geometriaCilindroCodo, material);
    // Trasladamos el cilindro a la altura del codo (120 en la y)
    cilindroCodo.position.set(0,120,0);
    // Creamos el cilindro que hace de mano
    var geometriaMano = new THREE.CylinderGeometry(15,15,40,20,1);
    var mano = new THREE.Mesh(geometriaMano, material);
    // Trasladamos la mano para que esté por encima del codo (eje y 120+80)
    mano.position.set(0,200,0);
    // Rotamos la mano
    mano.rotation.x = Math.PI / 2;
    // Añadimos las conexiones entre el codoCilindro y la mano
    // Primero creamos un objeto que contendrá las 4 conexiones
    var conexionesCilindroCodoMano = new THREE.Object3D();
    // Creamos la geometria y las 4 conexiones, traslandolas de manera simétrica
    var geometriaConexCilindroCodoMano = new THREE.BoxGeometry(4,80,4);
    var conex1CilindroCodoMano = new THREE.Mesh(geometriaConexCilindroCodoMano, material);
    conex1CilindroCodoMano.position.set(8,0,8);
    var conex2CilindroCodoMano = new THREE.Mesh(geometriaConexCilindroCodoMano, material);
    conex2CilindroCodoMano.position.set(8,0,-8);
    var conex3CilindroCodoMano = new THREE.Mesh(geometriaConexCilindroCodoMano, material);
    conex3CilindroCodoMano.position.set(-8,0,-8);
    var conex4CilindroCodoMano = new THREE.Mesh(geometriaConexCilindroCodoMano, material);
    conex4CilindroCodoMano.position.set(-8,0,8);
    // Añadimos las 4 conexiones al objeto contenedor de conexiones
    conexionesCilindroCodoMano.add(conex1CilindroCodoMano);
    conexionesCilindroCodoMano.add(conex2CilindroCodoMano);
    conexionesCilindroCodoMano.add(conex3CilindroCodoMano);
    conexionesCilindroCodoMano.add(conex4CilindroCodoMano);
    // Trasladamos todas las conexiones hacia arriba (eje y 120 + 80/2)
    conexionesCilindroCodoMano.position.set(0,160,0);
    // Añadimos la mano, cilindroCodo y las conexiones al antebrazo
    antebrazo.add(cilindroCodo);
    antebrazo.add(mano);
    antebrazo.add(conexionesCilindroCodoMano);
    // Añadimos el antebrazo al robot
    robot.add(antebrazo);


    // Creación de la pinza izquierda
    var pinzaIzqGeo = new THREE.Geometry();
    var coordenadasPinzaIzq = [
        0,0,0,
        0,20,0,
        0,20,-4,
        0,0,-4,
        19,0,0,
        19,20,-4,
        19,20,-4,
        19,0,-4,
        38,3,-2,
        38,17,-2,
        38,17,-4,
        38,3,-4
    ];

    var indicesPinzaIzq = [
        0,4,5,
        4,5,1,
        0,3,1,
        1,5,2,
        3,6,2,
        4,7,3,
        5,9,6,
        6,7,10,
        8,11,7,
        4,8,9,
        8,11,10,
        9,10,6
    ];

    // Construye vertices y los inserta en la pinzaIzq
    for(var i=0; i<coordenadasPinzaIzq.length; i+=3) {
        var vertice = new THREE.Vector3(coordenadasPinzaIzq[i], coordenadasPinzaIzq[i+1], coordenadasPinzaIzq[i+2]);
        pinzaIzqGeo.vertices.push(vertice);
    }
    
    // Construye caras y las inserta en la pinzaIzq
    for(var i=0; i<indicesPinzaIzq.length; i+=3){
        var triangulo = new THREE.Face3(indicesPinzaIzq[i],indicesPinzaIzq[i+1],indicesPinzaIzq[i+2]);
        pinzaIzqGeo.faces.push(triangulo);
    }

    // Creamos el mesh y lo añadimos al robot
    var pinzaIzq = new THREE.Mesh(pinzaIzqGeo, material);
    pinzaIzq.position.set(2,192,20);
    robot.add(pinzaIzq);

    
    // Creación de la pinza derecha
    var pinzaDerGeo = new THREE.Geometry();
    var coordenadasPinzaDer = [
        0,0,0,
        0,20,0,
        0,20,-4,
        0,0,-4,
        19,0,0,
        19,20,0,
        19,20,-4,
        19,0,-4,
        38,3,0,
        38,17,0,
        38,17,-2,
        38,3,-2
];

    var indicesPinzaDer = [
        0,4,1,
        1,3,2,
        0,7,3,
        1,5,6,
        2,7,6,
        4,8,5,
        4,11,7,
        5,9,10,
        8,11,10,
        8,9,10,
        6,11,10
    ];

    // Construye vertices y los inserta en la pinzaDer
    for(var i=0; i<coordenadasPinzaDer.length; i+=3) {
        var vertice = new THREE.Vector3(coordenadasPinzaDer[i], coordenadasPinzaDer[i+1], coordenadasPinzaDer[i+2]);
        pinzaDerGeo.vertices.push(vertice);
    }

    // Construye caras y las inserta en la pinzaDer
    for(var i=0; i<indicesPinzaDer.length; i+=3){
        var triangulo = new THREE.Face3(indicesPinzaDer[i],indicesPinzaDer[i+1],indicesPinzaDer[i+2]);
        pinzaDerGeo.faces.push(triangulo);
    }

    // Creamos el mesh y lo añadimos al robot
    var pinzaDer = new THREE.Mesh(pinzaDerGeo, material);
    pinzaDer.position.set(2,192,-16);
    robot.add(pinzaDer);


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
    renderer.render(scene, camera);
}