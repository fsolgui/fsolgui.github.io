/* Seminario 2: Introducción a la práctica 2: Escena básia en Threejs  */

// Objetos estándar
var renderer, camera, scene;
var cameraControls;

// Camaras adicionales
var planta, alzado, perfil;
var L=3; //Semilado de la caja ortográfica

// Globales
var esferaCubo, angulo = 0;

//Acciones
init();
loadScene();
render();

function setCameras(ar){
    //Configurar las tres cámaras ortográficas
    var cameraOrtografica;
    if(ar > 1){//El eje y no se modifica pues es el pequeño
        cameraOrtografica = new THREE.OrthographicCamera(-L*ar, L*ar, L, -L, -100, 100); 
    }else{
        cameraOrtografica = new THREE.OrthographicCamera(-L, L, L/ar, -L/ar , -100, 100);
    }

    alzado = cameraOrtografica.clone();
    alzado.position.set(0,0,L);
    alzado.lookAt(0,0,0);

    planta = cameraOrtografica.clone()
    planta.position.set(0,L,0);
    planta.lookAt(0,0,0);
    // Hay que modificar también el vector up
    planta.up = new THREE.Vector3(0,0,-1);

    perfil = cameraOrtografica.clone();
    perfil.position.set(L,0,0);
    perfil.lookAt(0,0,0);

    scene.add(alzado);
    scene.add(planta);
    scene.add(perfil);
}

// Función de inicialización
function init(){
    
    // Instanciar el motor, canvas, escena y camara
    aspectRatio = window.innerWidth/window.innerHeight;

    // Motor
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( new THREE.Color(0x0000AA));
    // Añadimos el canvas del renderer al container del html
    document.getElementById('container').appendChild(renderer.domElement);
    renderer.autoClear = false;

    // Escena
    scene = new THREE.Scene();

    // Camara
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0.5, 2, 4);

    // Activamos las cámaras secundarias
    setCameras(aspectRatio);

    // Añadimos cameraControls
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0,0,0)

    // Captura de eventos
    window.addEventListener("resize", updateAscpectRatio); 
    renderer.domElement.addEventListener("dblclick", rotateCube);
}

function rotateCube(event){
    //Capturar coordenadas de click
    var x = event.clientX;
    var y = event.clientY;

    //Zona click
    var derecha = false;
    var abajo = false;
    var cam = null; // cam es la cámara que recibe el click

    if(x>window.innerWidth/2){
        derecha = true;
        x -= window.innerWidth/2;
    }
    if(y>window.innerHeight/2){
        abajo  = true;
        y -= window.innerHeight/2;
    }
    if(derecha){
        if(abajo) cam = camera;
        else cam = perfil;
    }else{
        if(abajo) cam = planta;
        else cam = alzado;
    }
    
    //
    // Ahora aplicamos el raycaster para hacer el sistema de picking
    //

    // Normalizar a cuadrado de 2x2
    x = (x*4/window.innerWidth) -1;
    y = -(y * 4/window.innerHeight) + 1;

    // Construir el rayo
    var rayo = new THREE.Raycaster();
    rayo.setFromCamera(new THREE.Vector2(x,y),cam); 

    // Calcula las intersecciones
    var intersecciones = rayo.intersectObjects(scene.children, true); // true indica que lo haga en profundidad
    if(intersecciones.length > 0){
        intersecciones[0].object.rotation.x += Math.PI / 8;
    }
}

function loadScene(){
    
    // Crear geometria del cubo y su material
    var geoCubo = new THREE.BoxGeometry(0.9,0.9,0.9);
    var material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true});
    
    // Creamos 5 cubos en linea en el eje x
    for(var i = 0; i<5; i++){
        var cubo = new THREE.Mesh(geoCubo, material);
        cubo.position.set(-2+i, 0, 0);
        scene.add(cubo);
    }

}

function updateAscpectRatio(){
    // Se dispara cuando se cambia el area de dibujo
    
    // Le informamos al renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Le informamos a la cámara del nuevo ar
    var ar = window.innerWidth / window.innerHeight;
    camera.aspect = ar;
    // Necesitamos updatear la matriz
    camera.updateProjectionMatrix(); 

    // Para cámaras adicionales
    if(ar > 1){
        alzado.left = perfil.left = planta.left = -L*ar;
        alzado.right = perfil.right = planta.right = L*ar;
        alzado.bottom = perfil.bottom = planta.bottom = -L;
        alzado.top = perfil.top = planta.top = L;
    }else{
        alzado.left = perfil.left = planta.left = -L;
        alzado.right = perfil.right = planta.right = L;
        alzado.bottom = perfil.bottom = planta.bottom = -L/ar;
        alzado.top = perfil.top = planta.top = L/ar;
    }

    alzado.updateProjectionMatrix();
    perfil.updateProjectionMatrix();
    planta.updateProjectionMatrix();
}

function update(){  
    
    // Añadir animación a esfera y cubo a la vez
    //angulo += 0.01;
    //esferaCubo.rotation.y = angulo;
}

function render(){
    requestAnimationFrame(render);
    update();
    renderer.clear();

    // Alzado
    renderer.setViewport(0,0,window.innerWidth/2,window.innerHeight/2);
    renderer.render(scene, alzado);

    // Planta
    renderer.setViewport(0,window.innerHeight/2,window.innerWidth/2,window.innerHeight/2);
    renderer.render(scene, planta);

    // Perfil
    renderer.setViewport(window.innerWidth/2,0,window.innerWidth/2,window.innerHeight/2);
    renderer.render(scene, perfil);

    // Camera normal
    renderer.setViewport(window.innerWidth/2,window.innerHeight/2,window.innerWidth/2,window.innerHeight/2);
    renderer.render(scene, camera);


}
