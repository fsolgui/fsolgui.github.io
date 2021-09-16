/* Seminario 2: Introducción a la práctica 2: Escena básia en Threejs  */

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

    camera.position.set(250, 250, 250);
    // La camara apunta al origen de coordenadas
    camera.lookAt(new THREE.Vector3(0,0,0));
}

function loadScene(){
    
    // Añadimos los ejes auxiliares
    scene.add(new THREE.AxesHelper(3));
    
    // Creamos un material común a todas los objetos de la escena
    var material = new THREE.MeshBasicMaterial({color: 'red', wireframe: true});

    // Añadimos el suelo a la escena
    var geometriaSuelo = new THREE.PlaneGeometry(1000,1000,10,10);
    var suelo = new THREE.Mesh(geometriaSuelo, material);
    suelo.rotation.x = Math.PI / 2;
    scene.add(suelo);
    
    // Creamos un objeto que contendrá todas las partes del robot
    robot = new THREE.Object3D();

    // Creamos la base del robot
    var geometriaBase = new THREE.CylinderGeometry(50,50,15, 20, 1);
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

    // Añadimos el robot a la escena
    scene.add(robot);

}

function update(){  
    
    // Añadir animación a esfera y cubo a la vez
    angulo += 0.005;
    robot.rotation.y = angulo;
}

function render(){
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}