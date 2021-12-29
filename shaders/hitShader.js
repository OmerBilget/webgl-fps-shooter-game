var vertexShaderhit2d=
   `precision mediump float;
   
    uniform float percentage;
    uniform vec3 color;
    attribute vec2 vertexPosition;
    varying float alpha;
    varying vec3 fragmentColor;
    void main(){
        fragmentColor=color;
        alpha=(abs(vertexPosition.y)-0.78)*percentage;
        gl_Position=vec4(vertexPosition,0.0,1.0);
    }`;

var fragmentShaderhit2D=
    `precision mediump float;
    varying float alpha;
    varying vec3 fragmentColor;
    void main(){
         gl_FragColor=vec4(fragmentColor,alpha);
    }`;