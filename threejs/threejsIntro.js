/* Seminario 2: Introducción a la práctica 2: Escena básia en Threejs  */

// Objetos estándar
var renderer, camera, scene;

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

    camera.position.set(0.5, 2, 7);
    // La camara apunta al origen de coordenadas
    camera.lookAt(new THREE.Vector3(0,0,0));
}

function loadScene(){
    
    var geoCubo = new THREE.BoxGeometry(2,2,2);
    var matCubo = new THREE.MeshBasicMaterial({ color: 'yellow', 
                                                wireframe: true});
    var cubo = new THREE.Mesh(geoCubo, matCubo);

    var geoEsfera = new THREE.SphereGeometry(0.8, 20, 20);
    var esfera = new THREE.Mesh(geoEsfera, matCubo);
    
    // Añadir esfera y cubo como objetos separados
    //scene.add(esfera);
    //scene.add(cubo);

    var esferaCubo = new THREE.Object3D();
    esferaCubo.add(esfera);
    esferaCubo.add(cubo);

    // Añadir esfera y cubo a la escena como un solo objeto
    scene.add(esferaCubo)

    // Add axes
    scene.add(new THREE.AxesHelper(3));
}

function update(){  
    
    // Añadir animación a esfera y cubo a la vez
    angulo += 0.01;
    esferaCubo.rotation.y = angulo;
}

function render(){
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);

}
