const vertexShaderText=
    `precision mediump float;
    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    uniform mat4 matrixWorld;
    uniform mat4 matrixView;
    uniform mat4 matrixProjection;
    varying vec3 fragColor;
    void main(){
       fragColor=vertColor;
       gl_Position=matrixProjection*matrixView*matrixWorld*vec4(vertPosition,1.0);
    }`;

    
const fragmentShaderText=
   `precision mediump float;
    varying vec3 fragColor;
    void main(){
    gl_FragColor=vec4(fragColor,1.0);
    }`;
   


const vertexShader2d=
   `precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;
    void main(){
        fragColor=vertColor;
        gl_Position=vec4(vertPosition,-1,1.0);
    }`;

const fragmentShader2D=
    `precision mediump float;
    varying vec3 fragColor;
    void main(){
         gl_FragColor=vec4(fragColor,1.0);
    }`;
   




function initShader(gl,vertexshadersource,fragmentshadersource) {

    var vertexshader=gl.createShader(gl.VERTEX_SHADER);
    var fragmentshader=gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexshader,vertexshadersource);
    gl.shaderSource(fragmentshader,fragmentshadersource);


    gl.compileShader(vertexshader);
    if(!gl.getShaderParameter(vertexshader,gl.COMPILE_STATUS)){
        console.error("compile error",gl.getShaderInfoLog(vertexshader));
        return null;
    }
    gl.compileShader(fragmentshader);
    if(!gl.getShaderParameter(fragmentshader,gl.COMPILE_STATUS)){
        console.error("compile error 2",gl.getShaderInfoLog(fragmentshader));
        return null;
    }


    //combine two shaders in one program
    var program=gl.createProgram();
    gl.attachShader(program,vertexshader);
    gl.attachShader(program,fragmentshader);;
    gl.validateProgram(program);
    gl.linkProgram(program);


    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
        return null;
    }

    return program;
}   