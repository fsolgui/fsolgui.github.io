/* Proyecto final GPC  */

// Objetos estándar
var renderer, orbitCamera, orbitCameraControls, cenitCamera, scene;

// Cámaras
var camX, camMinusX, camZ, camMinusZ, camOrtographic, camWeb;

var L = 200// Semilado de la caja ortográfica

// Globales
var robot, angulo = 0;

// GUI
var effectController;

//Acciones
init();
initGUI();
loadScene();
render();

// Función de inicialización de la GUI
function initGUI(){
    
    effectController = {
        camUpLeft: "camX",
        camUpRight: "camMinusX",
        camBottomLeft: "camZ",
        camBottomRight: "camMinusZ",
    }

    var gui = new dat.GUI();
    var carpeta = gui.addFolder("Control cameras");
    carpeta.add(effectController, "camUpLeft", ["camX","camMinusX","camZ","camMinusZ","ortographic","webCam"]).name("camUpLeft");
    carpeta.add(effectController, "camUpRight", ["camX","camMinusX","camZ","camMinusZ","ortographic","webCam"]).name("camUpRight");
    carpeta.add(effectController, "camBottomLeft", ["camX","camMinusX","camZ","camMinusZ","ortographic","webCam"]).name("camBottomLeft");
    carpeta.add(effectController, "camBottomRight", ["camX","camMinusX","camZ","camMinusZ","ortographic","webCam"]).name("camBottomRight");
}

// Función de inicialización
function init(){
    
    // Instanciar el motor, canvas, escena y camara

    // Motor
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( new THREE.Color(0x000044));
    // Añadimos el canvas del renderer al container del html
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Camaras
    ar = window.innerWidth/window.innerHeight
    initCameras(ar)

    // Impedimos que render borre automaticamente lo que hay dibujado
    renderer.autoClear = false;

    // Añadimos el resize automático
    window.addEventListener("resize", updateAspectRatio);

}

function initCameras(ar){
    
    // Inicializamos camX
    camX = new THREE.PerspectiveCamera(75, ar, 0.1, 1000);
    camX.position.set(195,110,0);
    camX.lookAt(0,0,0)
    scene.add(camX);

    // Inicializamos camMinusX
    camMinusX = new THREE.PerspectiveCamera(75, ar, 0.1, 1000);
    camMinusX.position.set(-195,110,0);
    camMinusX.lookAt(0,0,0)
    scene.add(camMinusX);

    // Inicializamos camZ
    camZ = new THREE.PerspectiveCamera(75, ar, 0.1, 1000);
    camZ.position.set(0,110,195);
    camZ.lookAt(0,0,0)
    scene.add(camZ);

    // Inicializamos camMinusZ
    camMinusZ = new THREE.PerspectiveCamera(75, ar, 0.1, 1000);
    camMinusZ.position.set(0,110,-195);
    camMinusZ.lookAt(0,0,0)
    scene.add(camMinusZ);

    // Inicializamos webCam
    /*
    camX = new THREE.PerspectiveCamera(75, ar, 0.1, 1000);
    camX.position.set(195,110,0);
    camX.target.set(0,0,0);
    scene.add(camX);*/

    // Inicializamos camOrtographic
    if(ar > 1){//El eje y no se modifica pues es el pequeño
        camOrtographic = new THREE.OrthographicCamera(-L*ar, L*ar, L, -L, -140, 140); 
    }else{ // Al reves, ahora dividimos para hacer mas gránde el eje y
        camOrtographic = new THREE.OrthographicCamera(-L, L, L/ar, -L/ar , -140, 140);
    }
    camOrtographic.position.set(0,118,0);
    camOrtographic.lookAt(0,0,0);
    scene.add(camOrtographic);

}

function updateAspectRatio(){
    
    // Le informamos al renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Le informamos a la cámara principal del nuevo ar
    var ar = window.innerWidth / window.innerHeight;
    orbitCamera.aspect = ar;
    // Necesitamos updatear la matriz de la cámara principal
    orbitCamera.updateProjectionMatrix(); 

    if(ar > 1){
        cenitCamera.left = -L*ar;
        cenitCamera.right = L*ar;
        cenitCamera.bottom = -L;
        cenitCamera.top = L;
    }else{
        cenitCamera.left = -L;
        cenitCamera.right = L;
        cenitCamera.bottom = -L/ar;
        cenitCamera.top = L/ar;
    }

    cenitCamera.updateProjectionMatrix();

}

function loadScene(){
    
    // Añadimos los ejes auxiliares
    scene.add(new THREE.AxesHelper(500))
    
    // Creamos un material común a todas los objetos de la escena
    var material = new THREE.MeshBasicMaterial({color: 'red', wireframe: true});
    
    // Creamos el suelo
    var geometriaSuelo = new THREE.PlaneGeometry(400,400,10,10);
    // Clonamos el suelo y lo trasladamos para usarlo de techo
    var suelo = new THREE.Mesh(geometriaSuelo, material);
    suelo.rotation.x = -Math.PI / 2;
    var techo = suelo.clone();
    techo.position.set(0,120,0);
    // Añadimos techo y suelo a la escena
    scene.add(suelo);
    scene.add(techo);

    // Creamos las paredes perpendiculares al eje z
    var geometriaPared = new THREE.PlaneGeometry(400,120,10,10);
    var pared1 = new THREE.Mesh(geometriaPared, material);
    //var pared2 = pared1.clone();
    pared1.position.set(0,60,200);
    //pared2.position.set(0,60,-200);
    // Lo añadimos a la escena
    scene.add(pared1);
    //scene.add(pared2);

    // Añadimos dos paredes para dejar hueco en el centro para una ventana
    var geometriaPared2Lados = new THREE.PlaneGeometry(130,120,5,5);
    var pared2Izq = new THREE.Mesh(geometriaPared2Lados, material);
    var pared2Der = pared2Izq.clone();
    pared2Izq.position.set(-135,60,-200);
    pared2Der.position.set(135,60,-200);
    scene.add(pared2Izq);
    scene.add(pared2Der);

    // Rellenamos arriba y abajo para acabar la ventana
    var geometriaPared2Top = new THREE.PlaneGeometry(140,30,3,3);
    var pared2Arriba = new THREE.Mesh(geometriaPared2Top, material);
    var pared2Abajo = pared2Arriba.clone();
    pared2Arriba.position.set(0,105,-200);
    pared2Abajo.position.set(0,15,-200);
    scene.add(pared2Arriba);
    scene.add(pared2Abajo);

    // Creamos las paredes perpendiculares al eje z
    var pared3 = new THREE.Mesh(geometriaPared, material);
    pared3.rotation.y = -Math.PI / 2;
    var pared4 = pared3.clone();
    pared3.position.set(200,60,0);
    pared4.position.set(-200,60,0);
    // Lo añadimos a la escena
    scene.add(pared3);
    scene.add(pared4);

    // Creamos la mesa
    var mesa = new THREE.Object3D();
    // Creamos el plano supererior de la mesa
    var geometriaPlanoMesa = new THREE.BoxGeometry(80,2,50);
    var planoMesa = new THREE.Mesh(geometriaPlanoMesa, material);
    mesa.add(planoMesa);
    // Creamos las patas de la mesa
    var geometriaPatasMesa = new THREE.BoxGeometry(2,42,2);
    var pata1 = new THREE.Mesh(geometriaPatasMesa, material);
    var pata2 = pata1.clone();
    var pata3 = pata1.clone();
    var pata4 = pata1.clone();
    // Colocamos las patas a la mesa
    pata1.position.set(-39,-20,24);
    pata2.position.set(-39,-20,-24);
    pata3.position.set(39,-20,24);
    pata4.position.set(39,-20,-24);
    mesa.add(pata1);
    mesa.add(pata2);
    mesa.add(pata3);
    mesa.add(pata4);
    // Colocamos la mesa
    mesa.rotation.y = Math.PI / 2;
    mesa.position.set(175,40,50);
    // Añadimos un monitor a la mesa
    var loader = new THREE.GLTFLoader();
    loader.load("../models/monitor/scene.gltf", function(obj){
        obj.scene.scale.set(10,10,10);
        mesa.add(obj.scene);
        obj.scene.position.set(-25,3,10);
        obj.scene.rotation.y = 7/8*Math.PI;});
    scene.add(mesa);

    // Creamos una mesita-cajonera
    var mesitaCajon = new THREE.Object3D();
    // Creamos el cubo principal
    var geometriaMesita = new THREE.BoxGeometry(34,22,26);
    var mesita = new THREE.Mesh(geometriaMesita, material);
    mesita.position.set(0,11,0);
    mesitaCajon.add(mesita);
    // Creamos los cajones de la mesita
    var geometriaCajon = new THREE.BoxGeometry(2,8,24);
    var cajon1 = new THREE.Mesh(geometriaCajon, material);
    var cajon2 = cajon1.clone();
    cajon1.position.set(-17,6,0);
    cajon2.position.set(-17,16,0);
    mesitaCajon.add(cajon1);
    mesitaCajon.add(cajon2);
    // Colamos la mesita cajon y la añadimos a escena
    mesitaCajon.position.set(178,0,110);
    // Añadimos un portatil a través de un object loader
    var loader = new THREE.GLTFLoader();
    loader.load("../models/laptop_icon/scene.gltf", function(obj){
        obj.scene.rotation.y = -Math.PI / 2;
        obj.scene.scale.set(0.21,0.20,0.21);
        mesitaCajon.add(obj.scene);
        obj.scene.position.set(-4,22,0)});
    scene.add(mesitaCajon);
}

function update(){  

}

function render(){
    
    requestAnimationFrame(render);
    update();
    
    // Borramos el renderizado anterior
    renderer.clear()
    
    // CamUpLeft
    var camUpLeftGUI = effectController.camUpLeft;
    var camUpRightGUI = effectController.camUpRight;
    var camBottomLeftGUI = effectController.camBottomLeft;
    var camBottomRightGUI = effectController.camBottomRight;

    // Read width and height
    var w = window.innerWidth;
    var h = window.innerHeight;
    var h = window.innerHeight;

    if( camUpLeftGUI == camUpRightGUI &&
        camUpLeftGUI == camBottomLeftGUI &&
        camUpLeftGUI == camBottomRightGUI){
        
        // Mostramos una única cámara en el render
        renderer.setViewport(0,0,w,h);
        switch(camUpLeftGUI){
            case "camX":
                renderer.render(scene, camX);
                break
            case "camMinusX":
                renderer.render(scene, camMinusX);
                break
            case "camZ":
                renderer.render(scene, camZ);
                break
            case "camMinusZ":
                renderer.render(scene, camMinusZ);
                break
            case "ortographic":
                renderer.render(scene, camOrtographic);
                break
            case "webCam":
                renderer.render(scene, camWeb);
        }


    }else{
        
        // Render camUpLeft
        renderer.setViewport(0,0,w/2,h/2);
        switch(camUpLeftGUI){
            case "camX":
                renderer.render(scene, camX);
                break
            case "camMinusX":
                renderer.render(scene, camMinusX);
                break
            case "camZ":
                renderer.render(scene, camZ);
                break
            case "camMinusZ":
                renderer.render(scene, camMinusZ);
                break
            case "ortographic":
                renderer.render(scene, camOrtographic);
                break
            case "webCam":
                renderer.render(scene, camWeb);
        }

        // Render camUpRight
        renderer.setViewport(w/2,0,w/2,h/2);
        switch(camUpRightGUI){
            case "camX":
                renderer.render(scene, camX);
                break
            case "camMinusX":
                renderer.render(scene, camMinusX);
                break
            case "camZ":
                renderer.render(scene, camZ);
                break
            case "camMinusZ":
                renderer.render(scene, camMinusZ);
                break
            case "ortographic":
                renderer.render(scene, camOrtographic);
                break
            case "webCam":
                renderer.render(scene, camWeb);
        }

        // Render camBottomLeft
        renderer.setViewport(0,h/2,w/2,h/2);
        switch(camBottomLeftGUI){
            case "camX":
                renderer.render(scene, camX);
                break
            case "camMinusX":
                renderer.render(scene, camMinusX);
                break
            case "camZ":
                renderer.render(scene, camZ);
                break
            case "camMinusZ":
                renderer.render(scene, camMinusZ);
                break
            case "ortographic":
                renderer.render(scene, camOrtographic);
                break
            case "webCam":
                renderer.render(scene, camWeb);
        }

        // Render camBottomLeft
        renderer.setViewport(w/2,h/2,w/2,h/2);
        switch(camBottomRightGUI){
            case "camX":
                renderer.render(scene, camX);
                break
            case "camMinusX":
                renderer.render(scene, camMinusX);
                break
            case "camZ":
                renderer.render(scene, camZ);
                break
            case "camMinusZ":
                renderer.render(scene, camMinusZ);
                break
            case "ortographic":
                renderer.render(scene, camOrtographic);
                break
            case "webCam":
                renderer.render(scene, camWeb);
        }

    }
}