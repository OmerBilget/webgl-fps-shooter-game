//yellow fires lasers to the player 
class LASER{
    start_point;
    end_point;
    color;
    arraybuffer=[];
    buffer=[];
    constructor(start_point,end_point,color){
        this.start_point=start_point;
        this.end_point=end_point;
        this.color=color;
        this.arraybuffer;
    }

    create_array_buffer_laser(start_point,end_point){
        var array_buffer=[];
        for(let i=0;i<3;i++){
            array_buffer.push(start_point[i]);
        }
        for(let i=0;i<3;i++){
            array_buffer.push(this.color[i]);
        }
        for(let i=0;i<3;i++){
            array_buffer.push(end_point[i]);
        }
        for(let i=0;i<3;i++){
            array_buffer.push(this.color[i]);
        }
        this.arraybuffer=new Float32Array(array_buffer);

    }
    //edit start end end locations of laser
    edit_array_buffer(start_point,end_point){
        for(let i=0;i<3;i++){
            this.arraybuffer[i]=start_point[i];
        }
        for(let i=0;i<3;i++){
            this.arraybuffer[6+i]=end_point[i];
        }
    }
    
    createBufferData(gl){
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER,this.arraybuffer,gl.STATIC_DRAW);
     }

}


//draw lines
function draw_laser(gl,laser,identitymatrix,w,v,p,world,view,projection,pos,color){
    gl.bindBuffer(gl.ARRAY_BUFFER,laser.buffer);
    gl.bufferData(gl.ARRAY_BUFFER,laser.arraybuffer,gl.STATIC_DRAW);


    mat4.translate(w,identitymatrix,origin_vec);
    vec3.add(player.camera_coordinates,player.coordinate,player.lookingto);
    glMatrix.mat4.lookAt(v,player.coordinate,player.camera_coordinates,direction_up);//camera 
  
  
    gl.vertexAttribPointer(pos,3,gl.FLOAT,gl.FALSE,6*Float32Array.BYTES_PER_ELEMENT,0);
    gl.vertexAttribPointer(color,3,gl.FLOAT,gl.FALSE,6*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(pos);
    gl.enableVertexAttribArray(color);
    gl.uniformMatrix4fv(world,gl.FALSE,w);
    gl.uniformMatrix4fv(view,gl.FALSE,v);
    gl.uniformMatrix4fv(projection,gl.FALSE,p);
    gl.drawArrays(gl.LINES,0,2);
}
