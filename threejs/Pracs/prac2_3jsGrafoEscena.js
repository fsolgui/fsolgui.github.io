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
    // Trasladamos el cilindro a la altura del codo (120 en la y)
    disco.position.set(0,120,0);
    // Añadimos el disco al antebrazo
    antebrazo.add(disco)
    
    // Creamos el cilindro que hace de mano
    var geometriaMano = new THREE.CylinderGeometry(15,15,40,20,1);
    var mano = new THREE.Mesh(geometriaMano, material);
    // Trasladamos la mano para que esté por encima del codo (eje y 120+80)
    mano.position.set(0,200,0);
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
    nervios.position.set(0,160,0);
    // Añadimos los nervios al antebrazo
    antebrazo.add(nervios)

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

    // Creamos el mesh y lo añadimos a la mano
    var pinzaIzq = new THREE.Mesh(pinzaIzqGeo, material);
    mano.add(pinzaIzq);
    pinzaIzq.rotation.x = Math.PI/2;
    pinzaIzq.position.set(2,16,-12);

    
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
    mano.add(pinzaDer);
    pinzaDer.rotation.x = Math.PI/2;
    pinzaDer.position.set(2,-20,-12);

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