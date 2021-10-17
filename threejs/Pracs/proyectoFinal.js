/* Proyecto final GPC  */

// Objetos estándar
var renderer, scene;

/// Objetos de escena con animación

// Animación de apertura de las ventanas
var barraPersianaIzq, barraPersianaDer; // Objetos
var botonPersianaIzqClicked, botonPersianaDerClicked = false; // Saber si ha sido clickado ya

// Interacción con el monitor
var cajaPantalla; // Se interactua con la caja
var planoPantalla; // Se muestra en la pantalla
var pantallaClicked = 0; // Control de clicks sobre la pantalla

// Variables para videos

var video, videoImageContext, videotexture;
var posterRogue, posterConan, posterCait, posterViudaNegra;
var matVideoRogeOne, matVideoConan, matVideoCait, matVideoViudaNegra;

    
// Path principal de los arcvhivos
path = "../filesPRFinal/"

// Controlar fin de juego
fin=false;

// Cámaras
var camX, camMinusX, camZ, camMinusZ, camOrtographic
var zoomedX, zoomedMinusX, zoomedZ, zoomedMinusZ = false
var allSame = false;

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
        camUpRight: "camZ",
        camBottomLeft: "camMinusX",
        camBottomRight: "camMinusZ",
        zoom: 5,
        contraseña: "bitcoin"
    }

    var gui = new dat.GUI();
    var carpeta = gui.addFolder("Control cameras");
    carpeta.add(effectController, "camUpLeft", ["camX","camMinusX","camZ","camMinusZ","ortographic"]).name("camUpLeft");
    carpeta.add(effectController, "camUpRight", ["camX","camMinusX","camZ","camMinusZ","ortographic"]).name("camUpRight");
    carpeta.add(effectController, "camBottomLeft", ["camX","camMinusX","camZ","camMinusZ","ortographic"]).name("camBottomLeft");
    carpeta.add(effectController, "camBottomRight", ["camX","camMinusX","camZ","camMinusZ","ortographic"]).name("camBottomRight");
    carpeta.add(effectController, "zoom",1,20,0.2).name("zoomInClick");
    carpeta.add(effectController, "contraseña").name("contraseña");
}

// Función de inicialización
function init(){
    
    // Instanciar el motor, canvas, escena y camara

    // Motor
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor( new THREE.Color(0x000044));
    // Añadimos el canvas del renderer al container del html
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Camaras
    ar = window.innerWidth/window.innerHeight
    initCameras(ar)

    // Iluminación
    
    // Luz ambiente 
    var luzAmbienteLampara = new THREE.AmbientLight(0xFFFFFF,0.6);
    scene.add(luzAmbienteLampara);

    // Luz focal cielo
    var luzFocal = new THREE.SpotLight(0xFFFF99,0.6);
    luzFocal.position.set(0,50,-210);
    luzFocal.target.position.set(0,0,0);
    luzFocal.angle = Math.PI / 3;
    luzFocal.penumbra = 0.1;
    luzFocal.castShadow = true;
    scene.add(luzFocal);

    // Impedimos que render borre automaticamente lo que hay dibujado
    renderer.autoClear = false;

    // Añadimos el resize automático
    window.addEventListener("resize", updateAspectRatio);
    renderer.domElement.addEventListener("dblclick", processZoomInCamera);
    renderer.domElement.addEventListener("wheel", processZoomOutCamera);
}

function processZoomInCamera(event){
    
    // Capturar coordenadas de click
    var x = event.clientX;
    var y = event.clientY;

    // Leo variable zoom
    zoomIn = effectController.zoom;

    // Leer tamaño de window
    w = window.innerWidth;
    h = window.innerHeight;

    if(allSame){
        // No hay que tener en cuenta las 4 posibles cámaras
        cam = effectController.camUpLeft;
        // Normalizar a cuadrado de 2x2
        x = (x*2/w) -1;
        y = -(y*2/h) + 1;
    }
    else{
        // Zona click
        var derecha = false;
        var abajo = false;
        var cam = null; // cam es la cámara que recibe el click

        // Read from effectcontroler
        if(x>w/2){
            derecha = true;
            x -= w/2;
        }
        if(y>h/2){
            abajo  = true;
            y -= h/2;
        }
        if(derecha){
            if(abajo) cam = effectController.camBottomRight;
            else cam = effectController.camUpRight;
        }else{
            if(abajo) cam = effectController.camBottomLeft;
            else cam = effectController.camUpLeft;
        }

        // Normalizar a cuadrado de 2x2
        x = (x*4/w) -1;
        y = -(y*4/h) + 1;
    }

    // Get camera object
    switch(cam){
        case "camX":
            intersect = detectColisions(x,y,camX);
            if(zoomedX){
                switch(intersect.object){
                    case barraPersianaIzq:
                        animationPersianaIzq();
                        break;
                    case barraPersianaDer:
                        animationPersianaDer();
                        break;
                    case cajaPantalla:
                        processScreen();
                        break;
                    case posterRogue:
                        matVideo = createVideoMaterial(path+"videos/rogueone.mp4");
                        planoPantalla.material = matVideo;
                        break;
                    case posterConan:
                        matVideo = createVideoMaterial(path+"videos/detectiveconan.mp4");
                        planoPantalla.material = matVideo;
                        break;
                    case posterCait:
                        matVideo = createVideoMaterial(path+"videos/leagueoflegends.mp4");
                        planoPantalla.material = matVideo;
                        break;
                    case posterViudaNegra:
                        matVideo = createVideoMaterial(path+"videos/viudanegra.mp4");
                        planoPantalla.material = matVideo;
                        break;
                }
            }else{
                // Marcamos que vamos a hacer zoom
                zoomedX = true;
                // Cambiamos lookAt y Zoom y updateamos la matriz de proyeccion
                camX.lookAt(intersect.point);
                camX.zoom = zoomIn;
                camX.updateProjectionMatrix();
            }
            break;
        case "camMinusX":
            intersect = detectColisions(x,y,camMinusX);
            if(zoomedMinusX){
                switch(intersect.object){
                    case barraPersianaIzq:
                        animationPersianaIzq();
                        break;
                    case barraPersianaDer:
                        animationPersianaDer();
                        break;
                    case cajaPantalla:
                        processScreen();
                        break;
                    case posterRogue:
                        matVideo = createVideoMaterial(path+"videos/rogueone.mp4");
                        planoPantalla.material = matVideo;
                        break;
                    case posterConan:
                        matVideo = createVideoMaterial(path+"videos/detectiveconan.mp4");
                        planoPantalla.material = matVideo;
                        break;
                    case posterCait:
                        matVideo = createVideoMaterial(path+"videos/leagueoflegends.mp4");
                        planoPantalla.material = matVideo;
                        break;
                    case posterViudaNegra:
                        matVideo = createVideoMaterial(path+"videos/viudanegra.mp4");
                        planoPantalla.material = matVideo;
                        break;

                }
            }else{
                // Marcamos que vamos a hacer zoom
                zoomedMinusX = true;
                // Cambiamos lookAt y Zoom y updateamos la matriz de proyeccion
                camMinusX.lookAt(intersect.point);
                camMinusX.zoom = zoomIn;
                camMinusX.updateProjectionMatrix();
            }
            break;
        case "camZ":
            intersect = detectColisions(x,y,camZ);
            if(zoomedZ){
                switch(intersect.object){
                    case barraPersianaIzq:
                        animationPersianaIzq();
                        break;
                    case barraPersianaDer:
                        animationPersianaDer();
                        break;
                    case cajaPantalla:
                        processScreen();
                        break;
                    case posterRogue:
                        matVideo = createVideoMaterial(path+"videos/rogueone.mp4");
                        planoPantalla.material = matVideo;
                        break;
                    case posterConan:
                        matVideo = createVideoMaterial(path+"videos/detectiveconan.mp4");
                        planoPantalla.material = matVideo;
                        break;
                    case posterCait:
                        matVideo = createVideoMaterial(path+"videos/leagueoflegends.mp4");
                        planoPantalla.material = matVideo;
                        break;
                    case posterViudaNegra:
                        matVideo = createVideoMaterial(path+"videos/viudanegra.mp4");
                        planoPantalla.material = matVideo;
                        break;
                }
            }else{
                // Marcamos que vamos a hacer zoom
                zoomedZ = true;
                // Cambiamos lookAt y Zoom y updateamos la matriz de proyeccion
                camZ.lookAt(intersect.point);
                camZ.zoom = zoomIn;
                camZ.updateProjectionMatrix();
            }
            break;
        case "camMinusZ":
            intersect = detectColisions(x,y,camMinusZ);
            if(zoomedMinusZ){
                switch(intersect.object){
                    case barraPersianaIzq:
                        animationPersianaIzq();
                        break;
                    case barraPersianaDer:
                        animationPersianaDer();
                        break;
                    case cajaPantalla:
                        processScreen();
                        break;
                    case posterRogue:
                        matVideo = createVideoMaterial(path+"videos/rogueone.mp4");
                        planoPantalla.material = matVideo;
                        break;
                    case posterConan:
                        matVideo = createVideoMaterial(path+"videos/detectiveconan.mp4");
                        planoPantalla.material = matVideo;
                        break;
                    case posterCait:
                        matVideo = createVideoMaterial(path+"videos/leagueoflegends.mp4");
                        planoPantalla.material = matVideo;
                        break;
                    case posterViudaNegra:
                        matVideo = createVideoMaterial(path+"videos/viudanegra.mp4");
                        planoPantalla.material = matVideo;
                        break;
                }
            }else{
                // Marcamos que vamos a hacer zoom
                zoomedMinusZ = true;
                // Cambiamos lookAt y Zoom y updateamos la matriz de proyeccion
                camMinusZ.lookAt(intersect.point);
                camMinusZ.zoom = zoomIn;
                camMinusZ.updateProjectionMatrix();
            }
            break;
            case "ortographic":
                intersect = detectColisions(x,y,camOrtographic);
                switch(intersect.object){
                    case barraPersianaIzq:
                        animationPersianaIzq();
                        break;
                    case barraPersianaDer:
                        animationPersianaDer();
                        break;
                    case cajaPantalla:
                        processScreen();
                }
                break;
    }


}

function processScreen(){
    if(pantallaClicked == 0){
        var txScreenInit = new THREE.TextureLoader().load(path+"textures/screenInit.png");
        var matScreenInit = new THREE.MeshLambertMaterial({color:'white',map:txScreenInit});
        planoPantalla.material = matScreenInit;
        pantallaClicked = pantallaClicked + 1;
    }else if(fin){
        var txScreenFin = new THREE.TextureLoader().load(path+"textures/win.jpeg");
        var matScreenFin = new THREE.MeshLambertMaterial({color:'white',map:txScreenFin});
        planoPantalla.material = matScreenFin;
    }else{
        var txScreenNotepad = new THREE.TextureLoader().load(path+"textures/screenNotepad.png");
        var matScreenNotepad = new THREE.MeshLambertMaterial({color:'white',map:txScreenNotepad});
        planoPantalla.material = matScreenNotepad;
        pantallaClicked = pantallaClicked + 1;
    }
}

function processZoomOutCamera(event){
    
    if(event.deltaY < 0){
        return
    }
    
    // Capturar coordenadas de click
    var x = event.clientX;
    var y = event.clientY;

    // Leer tamaño de window
    w = window.innerWidth;
    h = window.innerHeight;

    if(allSame){
        // No hay que tener en cuenta las 4 posibles cámaras
        cam = effectController.camUpLeft;
    }
    else{
        // Zona click
        var derecha = false;
        var abajo = false;
        var cam = null; // cam es la cámara que recibe el click

        // Read from effectcontroler
        if(x>w/2){
            derecha = true;
            x -= w/2;
        }
        if(y>h/2){
            abajo  = true;
            y -= h/2;
        }
        if(derecha){
            if(abajo) cam = effectController.camBottomRight;
            else cam = effectController.camUpRight;
        }else{
            if(abajo) cam = effectController.camBottomLeft;
            else cam = effectController.camUpLeft;
        }
    }

    // Get camera object
    switch(cam){
        case "camX":
            if(zoomedX){
                // Volvemos a la posición inicial
                // Marcamos que no hay zoom
                zoomedX = false;
                // Cambiamos lookAt y Zoom y updateamos la matriz de proyeccion
                camX.lookAt(0,0,0);
                camX.zoom = 1;
                camX.updateProjectionMatrix();
            }
            break;
        case "camMinusX":
            if(zoomedMinusX){
                // Volvemos a la posición inicial
                // Marcamos que no hay zoom
                zoomedMinusX = false;
                // Cambiamos lookAt y Zoom y updateamos la matriz de proyeccion
                camMinusX.lookAt(0,0,0);
                camMinusX.zoom = 1;
                camMinusX.updateProjectionMatrix();
            }
            break;
        case "camZ":
            if(zoomedZ){
                // Volvemos a la posición inicial
                // Marcamos que no hay zoom
                zoomedZ = false;
                // Cambiamos lookAt y Zoom y updateamos la matriz de proyeccion
                camZ.lookAt(0,0,0);
                camZ.zoom = 1;
                camZ.updateProjectionMatrix();
            }
            break;
        case "camMinusZ":
            if(zoomedMinusZ){
                // Volvemos a la posición inicial
                // Marcamos que no hay zoom
                zoomedMinusZ = false;
                // Cambiamos lookAt y Zoom y updateamos la matriz de proyeccion
                camMinusZ.lookAt(0,0,0);
                camMinusZ.zoom = 1;
                camMinusZ.updateProjectionMatrix();
            }
            break;
        
    }
}

function detectColisions(x,y,cam){
    // Aplicamos Raycaster para detectar el punto lookAt
    var rayo = new THREE.Raycaster();
    rayo.setFromCamera(new THREE.Vector2(x,y),cam); 

    // Calcula las intersecciones
    var intersecciones = rayo.intersectObjects(scene.children, true); // true indica que lo haga en profundidad
    if(intersecciones.length > 0){
        return intersecciones[0];
    }
}

function initCameras(ar){
    
    // Inicializamos camX
    camX = new THREE.PerspectiveCamera(65, ar, 0.1, 1000);
    camX.position.set(195,110,0);
    camX.lookAt(0,0,0);
    scene.add(camX);

    // Inicializamos camMinusX
    camMinusX = new THREE.PerspectiveCamera(65, ar, 0.1, 1000);
    camMinusX.position.set(-195,110,0);
    camMinusX.lookAt(0,0,0);
    scene.add(camMinusX);

    // Inicializamos camZ
    camZ = new THREE.PerspectiveCamera(65, ar, 0.1, 1000);
    camZ.position.set(0,110,195);
    camZ.lookAt(0,0,0);
    scene.add(camZ);

    // Inicializamos camMinusZ
    camMinusZ = new THREE.PerspectiveCamera(65, ar, 0.1, 1000);
    camMinusZ.position.set(0,110,-195);
    camMinusZ.lookAt(0,0,0);
    scene.add(camMinusZ);

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
    
    // Le informamos a las cámaras perspectivas del nuevo ar
    var ar = window.innerWidth / window.innerHeight;
    camX.aspect = ar;
    camX.updateProjectionMatrix();
    camMinusX.aspect = ar;
    camMinusX.updateProjectionMatrix();
    camZ.aspect = ar;
    camZ.updateProjectionMatrix();
    camMinusZ.aspect = ar;
    camMinusZ.updateProjectionMatrix();

    if(ar > 1){
        camOrtographic.left = -L*ar;
        camOrtographic.right = L*ar;
        camOrtographic.bottom = -L;
        camOrtographic.top = L;
    }else{
        camOrtographic.left = -L;
        camOrtographic.right = L;
        camOrtographic.bottom = -L/ar;
        camOrtographic.top = L/ar;
    }

    camOrtographic.updateProjectionMatrix();

}

function animationPersianaIzq(){
    if(botonPersianaIzqClicked){
        var giroIzq = new TWEEN.Tween(barraPersianaIzq.rotation)
                            .to({x:0, y:-3/4*Math.PI, z:0},5000);
        giroIzq.start();
    }else{
        var giroIzq = new TWEEN.Tween(barraPersianaIzq.rotation)
                            .to({x:0, y:0, z:0},5000);
    }
    giroIzq.start();
    botonPersianaIzqClicked = !botonPersianaIzqClicked;
}

function animationPersianaDer(){
    if(botonPersianaDerClicked){
        var giroDer = new TWEEN.Tween(barraPersianaDer.rotation)
                            .to({x:0, y:3/4*Math.PI, z:0},5000);
        giroDer.start();
    }else{
        var giroDer = new TWEEN.Tween(barraPersianaDer.rotation)
                            .to({x:0, y:0, z:0},5000);
    }
    giroDer.start();
    botonPersianaDerClicked = !botonPersianaDerClicked;
}

function loadScene(){

    // Añadimos los ejes auxiliares
    scene.add(new THREE.AxesHelper(500))



    /// Creamos el cielo por la ventana ///
    
    var txCielo = new THREE.TextureLoader().load(path+"textures/sky.jpg");
    var matCielo = new THREE.MeshLambertMaterial({color:'white',map:txCielo});
    var geometriaCielo = new THREE.PlaneGeometry(280,100,100,100);
    var cielo = new THREE.Mesh(geometriaCielo, matCielo);
    cielo.position.set(0,50,-220);
    scene.add(cielo);



    /// Creamos el suelo ///
    


    // Creamos la textura
    var txSuelo = new THREE.TextureLoader().load(path+"textures/wood_floor.jpg");
    txSuelo.magfilter = THREE.LinearFilter;
    txSuelo.minfilter = THREE.LinearFilter;
    txSuelo.repeat.set(2,2);
    txSuelo.wrapS = txSuelo.wrapT = THREE.MirroredRepeatWrapping;
    var matSuelo = new THREE.MeshLambertMaterial({color:'white',map:txSuelo});
    
    // Creamos la geometria
    var geometriaSuelo = new THREE.PlaneGeometry(400,400,100,100);
    var suelo = new THREE.Mesh(geometriaSuelo, matSuelo);
    suelo.rotation.x = -Math.PI / 2;
    suelo.receiveShadow = true;
    scene.add(suelo);

    

    /// Creamos el techo ///
    


    //Creamos la textura 
    txPared = new THREE.TextureLoader().load(path+"textures/white_wall.jpg");
    txPared.magfilter = THREE.LinearFilter;
    txPared.minfilter = THREE.LinearFilter;
    txPared.repeat.set(2,2);
    txPared.wrapS = txPared.wrapT = THREE.MirroredRepeatWrapping;
    var matPared = new THREE.MeshLambertMaterial({color:'white',map:txPared});
    // Creamos la geometria
    var techo = new THREE.Mesh(geometriaSuelo, matPared);
    techo.rotation.x = Math.PI / 2;
    techo.position.set(0,120,0);
    techo.castShadow = true;
    // Lo añadimos a escena
    scene.add(techo);

    

    /// Creamos las paredes ///



    // Creamos la pared -z
    var geometriaPared = new THREE.PlaneGeometry(400,120,200,200);
    var pared1 = new THREE.Mesh(geometriaPared, matPared);
    pared1.rotation.x = Math.PI;
    pared1.position.set(0,60,200);
    pared1.castShadow = true;
    pared1.receiveShadow = true;
    // Lo añadimos a la escena
    scene.add(pared1);

    // Añadimos dos paredes para dejar hueco en el centro para una ventana
    var geometriaPared2Lados = new THREE.PlaneGeometry(130,120,25,25);
    var pared2Izq = new THREE.Mesh(geometriaPared2Lados, matPared);
    var pared2Der = pared2Izq.clone();
    pared2Izq.position.set(-135,60,-200);
    pared2Der.position.set(135,60,-200);
    pared2Izq.castShadow = true;
    pared2Izq.receiveShadow = true;
    pared2Der.castShadow = true;
    pared2Der.receiveShadow = true;
    scene.add(pared2Izq);
    scene.add(pared2Der);

    // Rellenamos arriba y abajo para acabar la ventana
    var geometriaPared2Top = new THREE.PlaneGeometry(140,30,15,15);
    var pared2Arriba = new THREE.Mesh(geometriaPared2Top, matPared);
    var pared2Abajo = pared2Arriba.clone();
    pared2Arriba.position.set(0,105,-200);
    pared2Abajo.position.set(0,15,-200);
    pared2Arriba.castShadow = true;
    pared2Arriba.receiveShadow = true;
    pared2Abajo.castShadow = true;
    pared2Abajo.receiveShadow = true;
    scene.add(pared2Arriba);
    scene.add(pared2Abajo);

    // Creamos las paredes x y -x
    var pared3 = new THREE.Mesh(geometriaPared, matPared);
    var pared4 = pared3.clone();
    pared3.rotation.y = -Math.PI / 2;
    pared3.position.set(200,60,0);
    pared4.rotation.y = Math.PI / 2;
    pared4.position.set(-200,60,0);
    pared3.castShadow = true;
    pared3.receiveShadow = true;
    pared4.castShadow = true;
    pared4.receiveShadow = true;
    // Las añadimos a la escena
    scene.add(pared3);
    scene.add(pared4);



    /// Creamos una mesa ///


    
    // Creamos la mesa
    var mesa = new THREE.Object3D();

    // Creamos el plano supererior de la mesa
    var geometriaPlanoMesa = new THREE.BoxGeometry(80,4,50);
    var matMesa = new THREE.MeshLambertMaterial({color:'white'});
    var planoMesa = new THREE.Mesh(geometriaPlanoMesa, matMesa);
    planoMesa.castShadow = true;
    planoMesa.receiveShadow = true;
    mesa.add(planoMesa);

    // Creamos las patas de la mesa
    txPatas = new THREE.TextureLoader().load(path+"textures/metal_128x128.jpg");
    var matPatas = new THREE.MeshLambertMaterial({color:'grey',map:txPatas});
    var matInterac = new THREE.MeshLambertMaterial({color:'red',map:txPatas}); // Para futuro uso
    var geometriaPatasMesa = new THREE.BoxGeometry(2,42,2);
    var pata1 = new THREE.Mesh(geometriaPatasMesa, matPatas);
    var pata2 = pata1.clone();
    var pata3 = pata1.clone();
    var pata4 = pata1.clone();
    
    // Colocamos las patas a la mesa
    pata1.position.set(-36,-21,22);
    pata2.position.set(-36,-21,-22);
    pata3.position.set(36,-21,22);
    pata4.position.set(36,-21,-22);
    pata1.castShadow = true;
    pata1.receiveShadow = true;
    pata2.castShadow = true;
    pata2.receiveShadow = true;
    pata3.castShadow = true;
    pata3.receiveShadow = true;
    pata4.castShadow = true;
    pata4.receiveShadow = true;
    mesa.add(pata1);
    mesa.add(pata2);
    mesa.add(pata3);
    mesa.add(pata4);
    
    // Colocamos la mesa
    mesa.rotation.y = Math.PI / 2;
    mesa.position.set(176,40,50);
    
    // Añadimos un monitor/ordenador a la mesa
    var monitor = new THREE.Object3D();

    // Creamos la base del monitor
    var geoBaseMonitor = new THREE.CylinderGeometry(10,10,0.2,20,2);
    var baseMonitor = new THREE.Mesh(geoBaseMonitor,matPatas);
    baseMonitor.receiveShadow = true;
    baseMonitor.castShadow = true;
    monitor.add(baseMonitor);

    // Creamos el stand del monitor
    var geoStand = new THREE.BoxGeometry(4,10,4);
    var stand = new THREE.Mesh(geoStand, matPatas);
    stand.position.set(0,5.1,0);
    stand.castShadow = true;
    stand.receiveShadow = true;
    baseMonitor.add(stand);

    // Creamos la caja
    var geoCajaPantalla = new THREE.BoxGeometry(34,20,2);
    cajaPantalla = new THREE.Mesh(geoCajaPantalla, matInterac);
    cajaPantalla.position.set(0,13,1.5);
    cajaPantalla.castShadow = true;
    //cajaPantalla.receiveShadow = true;
    stand.add(cajaPantalla);

    // Creamos el plano de la pantalla
    var geoPlanoPantalla = new THREE.PlaneGeometry(32,18,20,20);
    planoPantalla = new THREE.Mesh(geoPlanoPantalla, matPatas);
    planoPantalla.position.set(0,0,1.2);
    cajaPantalla.add(planoPantalla)

    // Colocamos el monitor y la mesa
    monitor.position.set(0,3,10);
    monitor.rotation.y = Math.PI;
    mesa.add(monitor);
    scene.add(mesa);


    
    /// Creamos una mesita-cajonera ///



    // Creamos la mesita-cajon //
    var mesitaCajon = new THREE.Object3D();

    // Creamos el cubo principal
    var geometriaMesita = new THREE.BoxGeometry(25,22,26);
    var matMesita = new THREE.MeshLambertMaterial({color:'grey'});
    var mesita = new THREE.Mesh(geometriaMesita, matMesita);
    mesita.castShadow = true;
    mesita.position.set(0,11,0);
    mesitaCajon.add(mesita);
    
    // Creamos los cajones de la mesita
    var geometriaCajon = new THREE.BoxGeometry(1,8,24);
    var cajon1 = new THREE.Mesh(geometriaCajon, matMesa);
    var cajon2 = cajon1.clone();
    cajon1.position.set(14,6,0);
    cajon2.position.set(14,16,0);
    mesitaCajon.add(cajon1);
    mesitaCajon.add(cajon2);
    
    // Colamos la mesita cajon y la añadimos a escena
    mesitaCajon.position.set(-182,0,-30);
    scene.add(mesitaCajon);



    /// Creamos el marco de la ventana

    var ventana = new THREE.Object3D();

    // Geometria marco horizontal
    var geoMarcoHor = new THREE.BoxGeometry(140,6,6);
    
    // Marco abajo
    var marcoAbajo = new THREE.Mesh(geoMarcoHor, matPatas);
    marcoAbajo.position.set(0,27,-197);
    marcoAbajo.castShadow = true;
    ventana.add(marcoAbajo);

    // Marco arriba
    var marcoArriba = new THREE.Mesh(geoMarcoHor, matPatas);
    marcoArriba.position.set(0,93,-197);
    marcoArriba.castShadow = true;
    ventana.add(marcoArriba);

    // Geometria marco vertical
    var geoMarcoVer = new THREE.BoxGeometry(6,72,6);

    // Marco izquierda
    var marcoIzq = new THREE.Mesh(geoMarcoVer, matPatas);
    marcoIzq.position.set(-73,60,-197);
    marcoIzq.castShadow = true;
    ventana.add(marcoIzq);

    // Marco derecha
    var marcoDer = new THREE.Mesh(geoMarcoVer, matPatas);
    marcoDer.position.set(73,60,-197);
    marcoDer.castShadow = true;
    ventana.add(marcoDer);
    scene.add(ventana)

    
    
    /// Creamos las persianas de la ventana ///
    


    // Creamos la geometria de la persiana y barra que la controla
    var geoPersiana = new THREE.BoxGeometry(72,68,2);
    var geoBarraPersiana = new THREE.CylinderGeometry(2,2,64,10,5);

    // Creamos la barra de la persiana izquierda
    barraPersianaIzq = new THREE.Mesh(geoBarraPersiana, matInterac);
    barraPersianaIzq.position.set(-74,60,-193);
    ventana.add(barraPersianaIzq);
    
    // Creamos la persiana izquierda
    var persianaIzq = new THREE.Mesh(geoPersiana, matMesa);
    persianaIzq.position.set(38,0,0);
    persianaIzq.castShadow = true;
    barraPersianaIzq.add(persianaIzq);

    barraPersianaIzq.rotation.y = -3/4*Math.PI;

    
    // Creamos la barra de la persiana derecha
    barraPersianaDer = new THREE.Mesh(geoBarraPersiana, matInterac);
    barraPersianaDer.position.set(74,60,-193);
    ventana.add(barraPersianaDer);
    
    // Creamos la persiana derecha
    var persianaDer = new THREE.Mesh(geoPersiana, matMesa);
    persianaDer.position.set(-38,0,0);
    persianaDer.castShadow = true;
    barraPersianaDer.add(persianaDer);

    barraPersianaDer.rotation.y = 3/4*Math.PI; 


    /// Ponemos una puerta
    var matPuerta = new THREE.MeshLambertMaterial({color:"grey",map:txSuelo});
    var geometriaPuerta = new THREE.PlaneGeometry(70,190,5,18);
    var puerta = new THREE.Mesh(geometriaPuerta, matPuerta);
    puerta.rotation.y = Math.PI;
    puerta.position.set(100,0,199.7)
    scene.add(puerta);

    var geometriaPomo = new THREE.SphereGeometry(5,10,10);
    var pomo = new THREE.Mesh(geometriaPomo,matPatas);
    pomo.position.set(25,45,-3);
    puerta.add(pomo);



    /// Añadimos posters a las paredes ///
    geometriaPosterVertical = new THREE.PlaneGeometry(48,60,20,20);
    geometriaPosterHorizontal = new THREE.PlaneGeometry(60,44,20,20);
    
    
    // Poster rogue one pared x
    var txRogueOne = new THREE.TextureLoader().load(path+"textures/rogueone.jpeg");
    var matRogueOne = new THREE.MeshLambertMaterial({color:'white',map:txRogueOne});
    posterRogue = new THREE.Mesh(geometriaPosterVertical,matRogueOne);
    posterRogue.rotation.y = -Math.PI / 2;
    posterRogue.position.set(199.7,70,-50);
    scene.add(posterRogue);
    
    // Poster Detective Conan
    var txConan = new THREE.TextureLoader().load(path+"textures/detectiveconan.jpg");
    var matConan = new THREE.MeshLambertMaterial({color:'white',map:txConan});
    posterConan = new THREE.Mesh(geometriaPosterVertical,matConan);
    posterConan.position.set(0,0,2.1);
    persianaIzq.add(posterConan);

    // Poster Caitlyn pared z
    var txCait = new THREE.TextureLoader().load(path+"textures/caitlyn.jpg");
    var matCait = new THREE.MeshLambertMaterial({color:'white',map:txCait});
    posterCait = new THREE.Mesh(geometriaPosterHorizontal,matCait);
    posterCait.rotation.y = Math.PI / 2;
    posterCait.position.set(-199.7,70,70);
    scene.add(posterCait);

    // Poster Viuda negra
    var txViudaNegra = new THREE.TextureLoader().load(path+"textures/viudanegra.jpg");
    var matViudaNegra = new THREE.MeshLambertMaterial({color:'white',map:txViudaNegra});
    posterViudaNegra = new THREE.Mesh(geometriaPosterVertical,matViudaNegra);
    posterViudaNegra.rotation.y = Math.PI;
    posterViudaNegra.position.set(-30,70,199.7);
    scene.add(posterViudaNegra);



    /// Cargamos la cama ///
    
    loader = new THREE.GLTFLoader().load(path+"models/bed.glb",
                                        function(gltf){
                                            gltf.scene.traverse(function(node){
                                                if(node.isMesh){node.castShadow = true;}
                                            });
                                            gltf.scene.scale.set(65,65,65);
                                            gltf.scene.rotation.y = Math.PI / 2;
                                            gltf.scene.position.set(-132,0,-80);
                                            scene.add(gltf.scene);
                                        });
                                                                      
    /// Creamos los objetos con fuentes de luz ///
    matVacio = createVideoMaterial(path+"videos/viudanegra.mp4");
    
    // Creamos la lampara pricipal de la habitación //
    var lamparaPr = new THREE.Object3D();

    // Creamos la bombilla
    var geoBombilla = new THREE.CylinderGeometry(30, 6, 15, 15, 1);
    var matBombilla = new THREE.MeshLambertMaterial({color:'yellow',
                                                    map: txPatas});
    bombilla = new THREE.Mesh(geoBombilla, matBombilla);
    bombilla.castShadow = true;
    bombilla.receiveShadow = true;
    // Añadimos bombilla
    lamparaPr.add(bombilla)

    // Creamos una pata para sujetar la bombilla
    var geoSujBombilla = new THREE.CylinderGeometry(2,2,22,10,2);
    var sujBombilla = new THREE.Mesh(geoSujBombilla, matPatas);
    
    // Colocamos la sujeción por encima de la bombilla
    sujBombilla.position.set(0,10,0);
    lamparaPr.add(sujBombilla);
    
    // Colocamos la lamparaPr
    lamparaPr.position.set(0,100,0);
    
    // Coloamos la lamparaPr en escena
    scene.add(lamparaPr);

}

function createVideoMaterial(path){
    /// Crear el elemento de video en el documento
	video = document.createElement('video');
	video.src = path;
	video.muted = "muted";
	video.load();
	video.play();

	/// Asociar la imagen de video a un canvas 2D
	videoImage = document.createElement('canvas');
	videoImage.width = 1080;
	videoImage.height = 720;

	/// Obtengo un contexto para ese canvas
	videoImageContext = videoImage.getContext('2d');
	videoImageContext.fillStyle = '#0000FF';
	videoImageContext.fillRect(0,0,videoImage.width,videoImage.height);

	/// Crear la textura
	videotexture = new THREE.Texture(videoImage);
	videotexture.minFilter = THREE.LinearFilter;
	videotexture.magFilter = THREE.LinearFilter;

	/// Crear el material con la textura
	var moviematerial = new THREE.MeshBasicMaterial({map:videotexture,
	                                                 side: THREE.DoubleSide});

    return moviematerial
}

function update(){  
    TWEEN.update();

    if(video.readyState === video.HAVE_ENOUGH_DATA){
		videoImageContext.drawImage(video,0,0);
		if(videotexture) videotexture.needsUpdate = true;
	}

}

function render(){
    
    requestAnimationFrame(render);
    update();
    
    // Borramos el renderizado anterior
    renderer.clear()
    
    // Selected cams
    var camUpLeftGUI = effectController.camUpLeft;
    var camUpRightGUI = effectController.camUpRight;
    var camBottomLeftGUI = effectController.camBottomLeft;
    var camBottomRightGUI = effectController.camBottomRight;

    // Leer contraseña
    contraseña = effectController.contraseña;
    if(!fin && contraseña == "2205gtvy"){
        var txScreenFin = new THREE.TextureLoader().load(path+"textures/win.jpeg");
        var matScreenFin = new THREE.MeshLambertMaterial({color:'white',map:txScreenFin});
        planoPantalla.material = matScreenFin;
        fin = true;
    }

    // Leer width and height
    var w = window.innerWidth;
    var h = window.innerHeight;

    if( camUpLeftGUI == camUpRightGUI &&
        camUpLeftGUI == camBottomLeftGUI &&
        camUpLeftGUI == camBottomRightGUI){
        allSame = true;
        // Mostramos una única cámara en el render
        renderer.setViewport(0,0,w,h);
        switch(camUpLeftGUI){
            case "camX":
                renderer.render(scene, camX);
                break;
            case "camMinusX":
                renderer.render(scene, camMinusX);
                break;
            case "camZ":
                renderer.render(scene, camZ);
                break;
            case "camMinusZ":
                renderer.render(scene, camMinusZ);
                break;
            case "ortographic":
                renderer.render(scene, camOrtographic);
                break;
            case "webCam":
                renderer.render(scene, camWeb);
        }


    }else{
        
        allSame = false;
        // Render camUpLeft
        renderer.setViewport(0,0,w/2,h/2);
        switch(camUpLeftGUI){
            case "camX":
                renderer.render(scene, camX);
                break;
            case "camMinusX":
                renderer.render(scene, camMinusX);
                break;
            case "camZ":
                renderer.render(scene, camZ);
                break;
            case "camMinusZ":
                renderer.render(scene, camMinusZ);
                break;
            case "ortographic":
                renderer.render(scene, camOrtographic);
                break;
            case "webCam":
                renderer.render(scene, camWeb);
        }

        // Render camUpRight
        renderer.setViewport(w/2,0,w/2,h/2);
        switch(camUpRightGUI){
            case "camX":
                renderer.render(scene, camX);
                break;
            case "camMinusX":
                renderer.render(scene, camMinusX);
                break;
            case "camZ":
                renderer.render(scene, camZ);
                break;
            case "camMinusZ":
                renderer.render(scene, camMinusZ);
                break;
            case "ortographic":
                renderer.render(scene, camOrtographic);
                break;
            case "webCam":
                renderer.render(scene, camWeb);
        }

        // Render camBottomLeft
        renderer.setViewport(0,h/2,w/2,h/2);
        switch(camBottomLeftGUI){
            case "camX":
                renderer.render(scene, camX);
                break;
            case "camMinusX":
                renderer.render(scene, camMinusX);
                break;
            case "camZ":
                renderer.render(scene, camZ);
                break;
            case "camMinusZ":
                renderer.render(scene, camMinusZ);
                break;
            case "ortographic":
                renderer.render(scene, camOrtographic);
                break;
            case "webCam":
                renderer.render(scene, camWeb);
        }

        // Render camBottomLeft
        renderer.setViewport(w/2,h/2,w/2,h/2);
        switch(camBottomRightGUI){
            case "camX":
                renderer.render(scene, camX);
                break;
            case "camMinusX":
                renderer.render(scene, camMinusX);
                break;
            case "camZ":
                renderer.render(scene, camZ);
                break;
            case "camMinusZ":
                renderer.render(scene, camMinusZ);
                break;
            case "ortographic":
                renderer.render(scene, camOrtographic);
                break;
            case "webCam":
                renderer.render(scene, camWeb);
        }

    }
}