//gun class parent class for rifle , sniper and rocket launcher
class GUN{
    vertices=[];
    faces=[];
    material=[];
    materialindex=[];
    materialid=[];
    arraybuffer;
    buffer;
    translation;
    rotation;
    scale;
    program;
    gun_location;
    id;
    damage;
    cooldown;
    delay;
    ammo_life;
    spread;
    ammo_count;
    max_ammo;
    ammo_create_location;
    constructor(translation,rotation,scale,gun_location,id,damage,cooldown,max_ammo,ammo_life,ammo_speed,ammo_create_location,spread,objText,mtlText){ 

       this.translation=translation;
       this.rotation=rotation;
       this.scale=[scale,scale,scale];
       this.id=id;
       this.damage=damage;
       this.cooldown=cooldown;
       this.ammo_life=ammo_life;
       this.ammo_speed=ammo_speed;
       this.delay=0;
       this.spread=spread;
       this.gun_location=gun_location;
       this.max_ammo=max_ammo;
       this.ammo_create_location=ammo_create_location;
       this.ammo_count=this.ammo_size;
       parseOBJ(objText,this,scale);
       parseMTL(mtlText,this);
 
       this.arraybuffer=new Float32Array(createBufferArray(this));
       
    };
    
    createBufferData(gl){
      this.buffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER,this.arraybuffer,gl.STATIC_DRAW);
   }
 } 

 



