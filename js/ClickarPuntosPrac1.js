/*
    Prac1. Clickar puntos con webgl
*/

// Shader de vertices //
var VSHADER_SOURCE = `
    attribute vec3 position;                \n
    varying highp vec3 color;               \n
    void main(){                            \n
        gl_Position = vec4(position, 1.0);  \n
        gl_PointSize = 5.0;                 \n
        float distance = sqrt(position[0]*position[0] + position[1]*position[1]);    \n
        color = vec3(1.0-distance, 1.0-distance, 1.0-distance); \n
    }                                       \n`

/* La variable position es un attribute, lo que quiere decir que será único para
cada vértice que entre en el shader */
/* En gl_Position añadimos un elemento al vector para trabajar en un sistema de 
referencia afín */

// Shader de fragmentos //
var FSHADER_SOURCE = `
    varying highp vec3 color;                       \n
    void main(){                                    \n
        gl_FragColor = vec4(color, 1.0);            \n
    }                                               \n`

/* La variable color es uniform, lo que quiere decir que será compartida por todos
los fragmentos que entren en el shader */
/* En gl_FragColor añadimos un elemento al vector pues necesitamos añadir el canal
alpha al color RGB inicial */

// Globales
var clicks = [];
var colorFragmento;

function main(){

    // Recupera el canvas
    var canvas = document.getElementById("canvas")
    // Mostrar mensaje de error en caso de no poder cargar el canvas
    if(!canvas){
        console.log("Fallo en el canvas");
        return;
    }

    // Asigna el contexto gráfico
    var gl = getWebGLContext(canvas);
    // Mostrar mensaje de error en caso de no poder asignar el contexto gráfico
    if(!gl){
        console.log("Fallo en el contexto gráfico");
        return;
    }

    // Carga los shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){ // Le pasamos los shaders y el contexto gráfico
        // En caso de fallo en la carga de shaders mostramos un mensaje de error
        console.log("Fallo en la carga de shaders");
        return;
    }

    // 
    gl.clearColor(0.0, 0.0, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Localiza el atributo position en shader de vértices
    var coordenadas = gl.getAttribLocation(gl.program, 'position');

    // Crear el buffer
    var bufferVertices = gl.createBuffer();

    // Seleccionar el buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
    gl.vertexAttribPointer(coordenadas, 3, gl.FLOAT, false, 0, 0);
    
    // Activar la conexion
    gl.enableVertexAttribArray(coordenadas);

    // Call-back del raton
    canvas.onmousedown = function(evento){
        click(evento, gl, canvas)
    }

}

function click(evento, gl, canvas){

    var x = evento.clientX; // Coordenada x del cursor respecto el documento
    var y = evento.clientY; // Coordenada y del cursor respecto el documento
    var rect = evento.target.getBoundingClientRect(); // Rectangulo del canvas
    
    // Conversion del coordenadas al cuadrado de 2x2
    x = ((x - rect.left) - canvas.width/2) / (canvas.width/2);
    y = (canvas.height/2 - (y - rect.top)) / (canvas.height/2)

    // Guardar las coordenadas y copiar el array
    clicks.push(x)
    clicks.push(y)
    clicks.push(0.0) // Estamos trabajando en 2D pero hay que dar un valor a la z

    // Creamos un array de puntos para pasar al buffer
    var puntos = new Float32Array(clicks)

    // Borra el canvas con el color de fondo
    gl.clear(gl.COLOR_BUFFER_BIT); // Esto no lo acabo de entender

    // Rellena el BufferObject con las coordenadas y lo manda a proceso
    gl.bufferData(gl.ARRAY_BUFFER, puntos, gl.STATIC_DRAW);
    // Indicamos que el dibujo es estático
    gl.drawArrays(gl.POINTS, 0, puntos.length/3) 
    // Dividimos entre tres porque cada tres elementos del vector se forma un punto
    // Usamos la directiva gl.Points para indicar que son puntos
}