//player healthbar changes value on health change
class PLAYER_HEALTH_BAR{
    arraybuffer=[];
    buffer;
    program;
    len;
    constructor(start,end,height,margin,start_color,end_color,vertical){
        this.start=start;
        this.end=end;
        this.height=height;
        this.start_color=start_color;
        this.end_color=end_color;
        this.vertical=vertical;
        this.len=end-start;
        
        this.arraybuffer=new Float32Array([
 
               
            start,vertical,                 1,1,1,  //top left
            end,vertical,                   1,0,0,  //top right 
            start,vertical+height,          1,1,1,  //bottom left
            end,vertical,                   1,0,0,  //top right 
            end,vertical+height,            1,0,0,  //bottom right
            start,vertical+height,          1,1,1,  //bottom left

            start-margin,vertical-margin,                0.5,0.5,0.5,  //top left
             end+margin,vertical-margin,                  0.5,0.5,0.5,     //top right 
             start-margin,vertical+height+margin,         0.5,0.5,0.5,  //bottom left
             end+margin,vertical-margin,                  0.5,0.5,0.5,     //top right 
             end+margin,vertical+height+margin,           0.5,0.5,0.5,       //bottom right
             start-margin,vertical+height+margin,         0.5,0.5,0.5,  //bottom left


      ]);
    
    }
    

    edit_array_buffer(percentage){
        this.arraybuffer[5]=this.start+this.len*percentage;
        this.arraybuffer[15]=this.start+this.len*percentage;
        this.arraybuffer[20]=this.start+this.len*percentage;
    }
    createBufferData(gl){
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER,this.arraybuffer,gl.STATIC_DRAW);
     }
}

function draw_player_health_bar(gl,healthbar,program,pos,color){
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER,healthbar.buffer);
    gl.bufferData(gl.ARRAY_BUFFER,healthbar.arraybuffer,gl.STATIC_DRAW);
    gl.vertexAttribPointer(pos,2,gl.FLOAT,gl.FALSE,5*Float32Array.BYTES_PER_ELEMENT,0);
    gl.vertexAttribPointer(color,3,gl.FLOAT,gl.FALSE,5*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(pos);
    gl.enableVertexAttribArray(color);
    gl.drawArrays(gl.TRIANGLES, 0, 12);
}
