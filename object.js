class OBJECT{
   vertices=[];
   texturecoordinates=[];
   vertexnormals=[];
   faces=[];
   material=[];
   materialindex=[];
   materialid=[];
   arraybuffer;
   translation;
   rotation;
   scale;
   program;
   constructor(translation,rotation,scale){ 
      this.translation=translation;
      this.rotation=rotation;
      this.scale=[scale,scale,scale];
   };

}

function draw_object(gl,object,program,identitymatrix,w,v,p,world,view,projection,pos,color){
  
   gl.bindBuffer(gl.ARRAY_BUFFER,object.buffer);


   mat4.translate(w,identitymatrix,object.translation);
   vec3.add(player.camera_coordinates,player.coordinate,player.lookingto);
   glMatrix.mat4.lookAt(v,player.coordinate,player.camera_coordinates,direction_up);//camera 
 
   
   gl.vertexAttribPointer(pos,3,gl.FLOAT,gl.FALSE,6*Float32Array.BYTES_PER_ELEMENT,0);
   gl.vertexAttribPointer(color,3,gl.FLOAT,gl.FALSE,6*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
   gl.enableVertexAttribArray(pos);
   gl.enableVertexAttribArray(color);
   gl.uniformMatrix4fv(world,gl.FALSE,w);
   gl.uniformMatrix4fv(view,gl.FALSE,v);
   gl.uniformMatrix4fv(projection,gl.FALSE,p);
   gl.drawArrays(gl.TRIANGLES,0,object.arraybuffer.length/6);
}

function createBufferColor(object,color) {
   var bufferArray = [];
   for (var i = 0; i < object.faces.length; i++) {
       for (var j = 0; j < 3; j++) {
           var tmp = object.faces[i][j][0];
           for (var k = 0; k < 3; k++) {
               bufferArray.push(object.vertices[tmp][k]);
           }
           for (var k = 0; k < 3; k++) {
               bufferArray.push(color[k]);
           }

           
       }

   }
   return bufferArray;
}

