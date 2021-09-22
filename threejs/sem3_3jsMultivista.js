/* Seminario 2: Introducción a la práctica 2: Escena básia en Threejs  */

// Objetos estándar
var renderer, camera, scene;
var cameraControls;

// Globales
var esferaCubo, angulo = 0;

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
    renderer.setClearColor( new THREE.Color(0x0000AA));
    // Añadimos el canvas del renderer al container del html
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Camara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 2, 4);

    // Añadimos cameraControls
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0,0,0)
}

function loadScene(){
    
    // Add axes
    scene.add(new THREE.AxesHelper(3));
    
    // Crear geometria del cubo y su material
    var geoCubo = new THREE.BoxGeometry(0.9,0.9,0.9);
    var material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true});
    
    // Creamos 5 cubos en linea en el eje x
    for(var i = 0; i<5; i++){
        var cubo = new THREE.Mesh(geoCubo, material);
        cubo.position.set(-2+i, 0, 0);
        scene.add(cubo);
    }

    /*

    var geoEsfera = new THREE.SphereGeometry(0.8, 20, 20);
    var esfera = new THREE.Mesh(geoEsfera, matCubo);
    
    // Añadir esfera y cubo como objetos separados
    //scene.add(esfera);
    //scene.add(cubo);

    esferaCubo = new THREE.Object3D();
    esferaCubo.add(esfera);
    esferaCubo.add(cubo);

    // Añadir esfera y cubo a la escena como un solo objeto
    scene.add(esferaCubo)

    
    // Suelo
    var geoSuelo = new THREE.PlaneGeometry(10,10,10,10);
    var suelo = new THREE.Mesh(geoSuelo, matCubo);
    suelo.rotation.x = Math.PI / 2;
    scene.add(suelo);
    */

    var loader = new THREE.ObjectLoader();
    loader.load('../models/soldado/soldado.json', function (objeto){ cubo.add(objeto); objeto.position.set(0,0,2)})
    scene.add(loader)
}

function update(){  
    
    // Añadir animación a esfera y cubo a la vez
    //angulo += 0.01;
    //esferaCubo.rotation.y = angulo;
}

function render(){
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}
