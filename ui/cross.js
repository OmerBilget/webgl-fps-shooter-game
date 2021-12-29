//circle marker of rifle and sniper
class CROSS{
    arraybuffer;
    buffer;
    ratio;
    c;
    margin;
    program;
    constructor(){
        this.c=0.1;
        var c=0.05;
        this.margin=0.05;
        this.ratio=1080/1920;
        /*
        this.arraybuffer=new Float32Array([
            -(this.c+this.margin)*this.ratio,0,   1,0,0,
            -(this.margin*this.ratio),0,       1,0,0,
    
             0,-(this.c+this.margin),   1,0,0,
             0,-this.margin,       1,0,0,
    
             this.margin*this.ratio,0,        1,0,0,
             (this.c+this.margin)*this.ratio,0,      1,0,0,
    
             0,this.margin,        1,0,0,
             0,this.c+this.margin,      1,0,0,
            
        ]);
        */
        var tmparraybuffer=[];
        const count=15;
        var angle=0;
        var increase=(Math.PI*2)/count;
        for(let i=0;i<count;i++){
            tmparraybuffer.push((c*Math.cos(angle)),(c*Math.sin(angle)*(2)),1,0,0);
            angle+=increase;
        }
        this.arraybuffer=new Float32Array(tmparraybuffer);
    }
    createBufferData(gl){
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER,this.arraybuffer,gl.STATIC_DRAW);
     }
}

class CROSS_SNIPER{
    arraybuffer;
    buffer;
    ratio;
    c;
    margin;
    program;
    constructor(){
        this.c=0.1;
        var c=0.005;
        this.margin=0.05;
        var tmparraybuffer=[];
        const count=6;
        var angle=0;
        var increase=(Math.PI*2)/count;
        for(let i=0;i<count;i++){
            tmparraybuffer.push((c*Math.cos(angle)),(c*Math.sin(angle)*(2)),1,0,0);
            angle+=increase;
        }
        this.arraybuffer=new Float32Array(tmparraybuffer);
    }
    createBufferData(gl){
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER,this.arraybuffer,gl.STATIC_DRAW);
     }
}

function draw_cross(gl,cross,program,pos,color){
    
    gl.bindBuffer(gl.ARRAY_BUFFER,cross.buffer);
    gl.vertexAttribPointer(pos,2,gl.FLOAT,gl.FALSE,5*Float32Array.BYTES_PER_ELEMENT,0);
    gl.vertexAttribPointer(color,3,gl.FLOAT,gl.FALSE,5*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(pos);
    gl.enableVertexAttribArray(color);
    gl.drawArrays(gl.LINE_LOOP, 0, 15);
}

function draw_cross_sniper(gl,cross,program,pos,color){
    
    gl.bindBuffer(gl.ARRAY_BUFFER,cross.buffer);
    gl.vertexAttribPointer(pos,2,gl.FLOAT,gl.FALSE,5*Float32Array.BYTES_PER_ELEMENT,0);
    gl.vertexAttribPointer(color,3,gl.FLOAT,gl.FALSE,5*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(pos);
    gl.enableVertexAttribArray(color);
    gl.drawArrays(gl.LINE_LOOP, 0, 6);
}

