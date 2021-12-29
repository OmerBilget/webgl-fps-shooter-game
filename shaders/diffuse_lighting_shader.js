var vertexShaderDF=`
    precision mediump float;
    attribute vec3 vertexPosition;
    attribute vec3 vertexColor;
    attribute vec3 Normal;

    varying vec3 diffuseLighting;
    varying vec3 fragment_Color;

    uniform vec3 light_direction;
    uniform vec3 lightColor;
    uniform mat4 matrixWorld;
    uniform mat4 matrixView;
    uniform mat4 matrixProjection;
    uniform mat4 matrixNormal;

    void main(){
        vec3 ambientLight=vec3(0.4,0.4,0.4);
       
        
        gl_Position=matrixProjection*matrixView*matrixWorld*vec4(vertexPosition,1.0);
        fragment_Color=vertexColor;

        vec4 transformedNormal=matrixNormal*vec4(Normal,1.0);
        float d=max(dot(transformedNormal.xyz,light_direction),0.0);
        diffuseLighting=ambientLight+(lightColor*d);
   
    }
`;

var fragmentShaderDF=`
      precision mediump float;
      varying vec3 diffuseLighting;
      varying vec3 fragment_Color;
      void main(){
          gl_FragColor=vec4(fragment_Color*diffuseLighting,1.0);
      }
`;


var vertexShaderfigureDF=`
    precision mediump float;
    attribute vec3 vertexPosition;
    attribute vec3 vertexColor;
    attribute vec3 Normal;

    varying vec3 diffuseLighting;
    varying vec3 fragment_Color;

    uniform vec3 light_direction;
    uniform vec3 lightColor;
    uniform mat4 matrixWorld;
    uniform mat4 matrixView;
    uniform mat4 matrixProjection;
    uniform mat4 matrixNormal;

    void main(){
        vec3 ambientLight=vec3(0.15,0.15,0.15);
       
        
        gl_Position=matrixProjection*matrixView*matrixWorld*vec4(vertexPosition,1.0);
        fragment_Color=vertexColor;

        vec4 transformedNormal=matrixNormal*vec4(Normal,1.0);
        float d=max(dot(transformedNormal.xyz,light_direction),0.0);
        diffuseLighting=ambientLight+(lightColor*d);
   
    }
`;

var fragmentShaderFigureDF=`
      precision mediump float;
      varying vec3 diffuseLighting;
      varying vec3 fragment_Color;
      void main(){
          gl_FragColor=vec4(fragment_Color*diffuseLighting,1.0);
      }
`;








function createNormalBuffer(object){
    var normalBuffer = [];
    for (var i = 0; i < object.faces.length; i++) {
        var tmp = object.normal[i];
        for (var j = 0; j < 3; j++) {
            for (var k = 0; k < 3; k++) {

                normalBuffer.push(tmp[k]);

            }
        }

    }
    return normalBuffer;
}

