const vertexShaderPortal=
    `precision lowp float;
    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    uniform mat4 matrixWorld;
    uniform mat4 matrixView;
    uniform mat4 matrixProjection;
    uniform vec3 center;
    uniform float ratio;
    varying vec3 fragColor;
    varying float dist;
    varying float r;
    void main(){
       fragColor=vertColor;
       dist=distance(vertPosition,vec3(0.0,0.0,0.0));
       dist=(dist/39.5);
       r=ratio;
       gl_Position=matrixProjection*matrixView*matrixWorld*vec4(vertPosition,1.0);
    }`;

    
const fragmentShaderPortal=
   `precision lowp float;
    varying vec3 fragColor;
    varying float dist;
    varying float r;
    void main(){
    gl_FragColor=vec4(fragColor,(1.0-dist)*r);
}`;
   

