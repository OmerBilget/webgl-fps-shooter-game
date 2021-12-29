//hit box flashes short period of time when player damaged of healed
class HIT{
    arraybuffer=[];
    buffer;
    program;
    color;
    healcolor;
    constructor(){
      this.color=[1,0,0];
      this.healcolor=[0,1,0];
      //inner box represents width of hit box
        this.arraybuffer=new Float32Array([
            1,1,-1,1,inner_box,inner_box,
            inner_box,inner_box,-1,1, -inner_box,inner_box,
            -1,1,-1,-1,-inner_box,inner_box,
            -inner_box,inner_box,-1,-1,-inner_box,-inner_box,
            -inner_box,-inner_box,-1,-1,1,-1,
            inner_box,-inner_box,-inner_box,-inner_box,1,-1,
            1,-1,1,1,inner_box,inner_box,
            inner_box,inner_box,inner_box,-inner_box,1,-1
            
      ]);
      
      
    }
    
    createBufferData(gl){
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER,this.arraybuffer,gl.STATIC_DRAW);
     }
}



function draw_hit(gl,player,hit,program,pos,per,percentage,col,color){
        gl.useProgram(program);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,hit.buffer);
        gl.vertexAttribPointer(pos,2,gl.FLOAT,gl.FALSE,2*Float32Array.BYTES_PER_ELEMENT,0);
        gl.enableVertexAttribArray(pos);
        gl.uniform1f(per,percentage);
        gl.uniform3fv(col,color);
        gl.drawArrays(gl.TRIANGLES, 0, 24);
      }



const inner_box=0.789602;
