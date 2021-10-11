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
    renderer.shadowMap.enabled = true;
    renderer.antialias = true;
    // Añadimos el canvas del renderer al container del html
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Camara
    camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 500);
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0.5, 3, 9);
    // La camara apunta al origen de coordenadas
    camera.lookAt(new THREE.Vector3(0,2,0));

    //Luces
    var luzAmbiente = new THREE.AmbientLight(0xFFFFFF,0.1);
    scene.add(luzAmbiente);

    var luzPuntual = new THREE.PointLight(0xFFFFFF,0.5);
    luzPuntual.position.set(-10,10,-10);
    scene.add(luzPuntual);

    var luzDireccional = new THREE.DirectionalLight(0xFFFFFF, 0.5);
    luzDireccional.position.set(-10,5,10);
    scene.add(luzDireccional);

    var luzFocal = new THREE.SpotLight(0xFFFFFF,0.5);
    luzFocal.position.set(10,10,3);
    luzFocal.target.position.set(0,0,0);
    luzFocal.angle = Math.PI / 10;
    luzFocal.penumbra = 0.2;
    luzFocal.castShadow = true;
    scene.add(luzFocal);


}

function loadScene(){
    
    // texturas
    var path = "../images/";
    var txsuelo = new THREE.TextureLoader().load(path+"wet_ground_512x512.jpg");
    txsuelo.magfilter = THREE.LinearFilter;
    txsuelo.minfilter = THREE.LinearFilter;
    txsuelo.repeat.set(2,2);
    txsuelo.wrapS = txsuelo.wrapT = THREE.MirroredRepeatWrapping;

    var txcubo = new THREE.TextureLoader().load(path+"wood512.jpg");

    var txesfera = new THREE.TextureLoader().load(path+"Earth.jpg");

    var paredes = [ path+"posx.jpg", path+"negx.jpg",
                    path+"posy.jpg", path+"negy.jpg",
                    path+"posz.jpg", path+"negz.jpg"];   
    var txmapaEntorno = new THREE.CubeTextureLoader().load(paredes);
    
    // materiales
    var matsuelo = new THREE.MeshLambertMaterial({ color: 'white', map: txsuelo});
    var materialMate = new THREE.MeshLambertMaterial({color:'red', map: txcubo});
    var materialBrillante = new THREE.MeshPhongMaterial({color:'white',
                                                        specular:'white',
                                                        shininess: 50,
                                                        map: txesfera});
    var matEntorno = new THREE.MeshPhongMaterial({color:'white',
                                                specular:'white',
                                                shininess: 50,
                                                envMap: txmapaEntorno});
    
    var geoCubo = new THREE.BoxGeometry(2,2,2);
    var cubo = new THREE.Mesh(geoCubo, materialMate);
    cubo.position.set(0,1.2,0);
    cubo.castShadow = true;
    cubo.receiveShadow = true


    var geoEsfera = new THREE.SphereGeometry(0.8, 20, 20);
    var esfera = new THREE.Mesh(geoEsfera, materialBrillante);
    var esfera2 = new THREE.Mesh(geoEsfera, matEntorno);
    esfera2.position.set(3,1,0);
    esfera.castShadow = true;
    esfera.receiveShadow = true;
    esfera.position.set(-3,1,0);
    
    // Añadir esfera y cubo como objetos separados
    //scene.add(esfera);
    //scene.add(cubo);

    esferaCubo = new THREE.Object3D();
    esferaCubo.add(esfera);
    esferaCubo.add(cubo);
    esferaCubo.add(esfera2);
    

    // Añadir esfera y cubo a la escena como un solo objeto
    scene.add(esferaCubo)

    // Add axes
    scene.add(new THREE.AxesHelper(3));

    var loader = new THREE.ObjectLoader();
    loader.load('../models/soldado/soldado.json', 
                function (objeto){ cubo.add(objeto); 
                    objeto.castShadow = true; 
                    objeto.receiveShadow = true; 
                    objeto.position.set(0,1,0);
                    var txobj = new THREE.TextureLoader().load("../models/soldado/soldado.png");
                    objeto.material.map = txobj;})

    // Suelo
    var geoSuelo = new THREE.PlaneGeometry(10,10,100,100);
    var suelo = new THREE.Mesh(geoSuelo, matsuelo);
    suelo.rotation.x = -Math.PI / 2;
    suelo.receiveShadow = true;
    scene.add(suelo);

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
