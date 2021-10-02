/* Seminario 4: Animación interpolada */

// Objetos estándar
var renderer, camera, scene;
var cameraControls;

// Globales
var peonza, eje;

// Control del tiempo
var antes = Date.now();
var angulo = 0;

// Monitor
var stats;

// GUI
var effectController;

//Acciones
init();
setupGUI();
loadScene();
render();

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

    // Escena
    scene = new THREE.Scene();

    // Camara
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(2,2,3);

    // Añadimos cameraControls
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0,0,0);

    // Captura de eventos
    window.addEventListener("resize", updateAscpectRatio);

    // Monitor
    stats = new Stats();
    stats.showPanel(0);
    document.getElementById("container").appendChild(stats.domElement);
}

function setupGUI(){
    
    effectController = {
        mensaje: "Interfaz Peonza",
        vueltasXsg: 1.0,
        reiniciar: function(){
            TWEEN.removeAll();
            eje.position.set(-2.5, 0, -2.5);
            eje.rotation.set(0, 0, 0);
            startAnimation();
        },
        check: true,
        colorMaterial: "rgb(255,255,0)"
    }

    var gui = new dat.GUI();
    var carpeta = gui.addFolder("Control Peonza");
    
    carpeta.add(effectController, "mensaje").name("Hola");
    
    // Slider
    carpeta.add(effectController, "vueltasXsg", 0.0, 5.0, 0.2).name("Vueltas/sg");

    carpeta.add(effectController, "reiniciar").name("Reiniciar");
    carpeta.add(effectController, "check").name("Check sin uso");
    
    //
    var sensorColor = carpeta.addColor(effectController, "colorMaterial").name("Color peonza");
    sensorColor.onChange(function(color){
            peonza.traverse(function(hijo){
                if(hijo instanceof THREE.Mesh)
                    hijo.material.color = new THREE.Color(color);
            });
        })

}

function loadScene(){
    
    // Crear material básico
    var material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true});
    
    // Inicializar peonza y su eje
    eje = new THREE.Object3D();
    peonza = new THREE.Object3D();

    // Construir el cuerpo de la peonza 
    var cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.2, 2, 20, 2), material);
    cuerpo.position.set(0,1.5,0);
    peonza.add(cuerpo);

    // Construir la punta de la peonza
    var punta = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0, 0.5, 10, 1), material);
    punta.position.set(0,0.25,0);
    peonza.add(punta);

    // Construir el mango
    var mango = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 10, 1), material);
    mango.position.set(0,2.75,0);
    peonza.add(mango);

    // Colocamos bien la peonza
    peonza.rotation.x = Math.PI/16;
    eje.position.set(-2.5, 0, -2.5);
    eje.add(peonza);

    scene.add(eje);
    scene.add(new THREE.AxesHelper(2));

    // Suelo
    Coordinates.drawGrid({size:6, scale:1, orientation:"x"});
}

function startAnimation(){
    var movtIzq = new TWEEN.Tween(eje.position)
                                            .to({   x:[-1.5, -2.5], 
                                                    y:[0, 0],
                                                    z:[0, 2.5]}, 5000)
                                            .interpolation(TWEEN.Interpolation.Bezier)
                                            .easing(TWEEN.Easing.Bounce.Out);
    
    var movtFrente = new TWEEN.Tween(eje.position)
                                            .to({   x:[0, 2.5], 
                                                    y:[0, 0],
                                                    z:[0, 2.5]}, 5000)
                                            .interpolation(TWEEN.Interpolation.Bezier)
                                            .easing(TWEEN.Easing.Bounce.Out);

    var movtDer = new TWEEN.Tween(eje.position)
                                            .to({   x:[1.5, 2.5], 
                                                    y:[0, 0],
                                                    z:[0, -2.5]}, 5000)
                                            .interpolation(TWEEN.Interpolation.Bezier)
                                            .easing(TWEEN.Easing.Bounce.Out);

    var movtTras = new TWEEN.Tween(eje.position)
                                            .to({   x:[0, -2.5], 
                                                    y:[0, 0],
                                                    z:[-1.5, -2.5]}, 5000)
                                            .interpolation(TWEEN.Interpolation.Bezier)
                                            .easing(TWEEN.Easing.Bounce.Out);

    movtIzq.chain(movtFrente);
    movtFrente.chain(movtDer);
    movtDer.chain(movtTras);

    movtIzq.start();

    var giro = new TWEEN.Tween(eje.rotation)
                            .to({x:0, y:Math.PI*2, z:0},10000);
    giro.repeat(Infinity);
    giro.start();
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
}

function update(){  
    
    var ahora = Date.now();
    
    // Rotación peonza es su propio angulo ¡
    var vueltasXsg = effectController.vueltasXsg;
    angulo += vueltasXsg * Math.PI * 2 * (ahora-antes)/1000;
    peonza.rotation.y = angulo;

    // Rotación del eje padre
    //eje.rotation.y = angulo/5;

    antes = ahora;

    TWEEN.update();
}

function render(){
    requestAnimationFrame(render);
    stats.begin();
    update();
    renderer.render(scene, camera);
    stats.end();
}
