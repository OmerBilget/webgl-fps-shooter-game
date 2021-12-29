var vertexShaderPlanetDF=`
    precision lowp float;
    attribute vec3 vertexPosition;
    attribute vec3 vertexColor;
    attribute vec3 Normal;

    varying vec3 diffuseLighting;
    varying vec3 fragment_Color;
    varying float d;
    uniform vec3 light_direction;
    uniform vec3 lightColor;
    uniform mat4 matrixWorld;
    uniform mat4 matrixView;
    uniform mat4 matrixProjection;
    uniform mat4 matrixNormal;
    
    void main(){
        vec3 ambientLight=vec3(0.7,0.7,0.7);
       
        
        gl_Position=matrixProjection*matrixView*matrixWorld*vec4(vertexPosition,1.0);
        fragment_Color=vertexColor;

        vec4 transformedNormal=matrixNormal*vec4(Normal,1.0);
        float d=max(dot(transformedNormal.xyz,light_direction),0.0);
        diffuseLighting=ambientLight+(lightColor*d);
   
    }
`;

var fragmentShaderPlanetDF=`
      precision lowp float;
      varying vec3 diffuseLighting;
      varying vec3 fragment_Color;
      varying float d;
      void main(){
          gl_FragColor=vec4(fragment_Color*diffuseLighting,0.3);
      }
`;

