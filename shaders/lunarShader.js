var vertexShaderMoonDF=`
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
    uniform vec3 light_location;
    uniform float center_dist;
    varying float angle;
    varying float difference;
    void main(){
        vec3 ambientLight=vec3(0.17,0.0,0.0);
       
        vec4 current_location=matrixWorld*vec4(vertexPosition,1.0);
        gl_Position=matrixProjection*matrixView*current_location;
        fragment_Color=vertexColor;
       
        float dist=distance(current_location.xyz,light_location);
        difference=dist-center_dist;
        vec4 transformedNormal=matrixNormal*vec4(Normal,1.0);
        angle=dot(transformedNormal.xyz,light_direction);
        float d=max(angle,0.0);
        diffuseLighting=ambientLight+(lightColor*d);
   
    }
`;

var fragmentShaderMoonDF=`
      precision mediump float;
      varying vec3 diffuseLighting;
      varying vec3 fragment_Color;
      varying float angle;
      varying float difference;
      float n(float value,float min,float max);
      float offset=20.9;
      void main(){
            float alpha=n(difference+17.0,offset,-offset);
                alpha*=1.6;
                if(alpha>1.0){
                    alpha=1.0;
                }
            
            gl_FragColor=vec4(fragment_Color*diffuseLighting,alpha);
            
          
      }

      float n(float value,float min,float max){
          return (value-min)/(max-min);
      }
`;

