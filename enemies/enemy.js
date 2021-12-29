class ENEMY{
    health;
    max_health;
    translation;
    rotation;
    scale;
    state;
    type;
    id;
    collision_radius;
    damage;

    move_time;
    move_direction;
    velocity;
    bullet_count;
    shoot_interval;
    move_coordinate;
    move_coordinate_prev;
    lookingto;
    prev_state;
    hit;
    frame;
    distance_traveled;
    death_count;
    emergency_counter;

    sniper_hit_vector;
    sniper_hit_counter;
    constructor(health,max_health,translation,rotation,type,id){
        this.health=health;
        this.max_health=max_health;
        this.translation=translation;
        this.rotation=rotation;
        this.type=type;
        this.state=0;
        this.id=id;
        this.move_time=this.type.move_time;
        this.move_direction=[0,1,0];
        this.move_coordinate=this.translation;
        this.move_coordinate_prev=vec3.create();
        this.velocity=[0,0,0];
        this.shoot_interval=0;
        this.bullet_count=this.type.max_bullet;
        this.prev_state=0;
        this.collision_radius=9;
        this.lookingto=[0,0,0];
        this.hit=0;
        this.frame=0;
        this.distance_traveled=0;
        this.death_count=100;
        this.emergency_counter=0;
        this.damage=this.type.damage;
        this.sniper_hit_vector=[0,0,0];
        this.sniper_hit_counter=0;
    }
}


const x_range=[-40,40];
const y_range=[5,20];
const z_range=[-40,40];




function rand_range(min,max){
    return (Math.random()*(max-min+1)+min);
}


//create enemy bullet

function create_bullet_enemy(enemy,bullet_array,parent,pool){
    var bullet=pool.getbullet_enemy();
    let bullet_coordinate=bullet.coordinate;
    vec3.copy(bullet_coordinate,enemy.translation);
    let bullet_direction=bullet.direction;
    vec3.sub(bullet_direction,player.coordinate,enemy.translation);
    vec3.normalize(bullet_direction,bullet_direction);
    vec3.rotateX(bullet_direction,bullet_direction,[0,0,0],deg2rad(Math.random()*2));
    vec3.rotateY(bullet_direction,bullet_direction,[0,0,0],deg2rad(Math.random()*2));
    vec3.rotateZ(bullet_direction,bullet_direction,[0,0,0],deg2rad(Math.random()*2));
    
    bullet.generate(bullet_coordinate,bullet_direction,2,0,0,bullet_coordinate,null,100,parent,1);
    bullet_array[active_length_enemy_rifle]=bullet;
    active_length_enemy_rifle+=1;
}

function rad2deg(angle){
    return angle*(180/Math.PI);
}


function draw_bullet_enemy(gl,bullet_instance,bullet,program,identitymatrix,w,v,p,world,view,projection){
   
    
    
    mat4.translate(w,identitymatrix,bullet_instance.coordinate);
    
    vec3.add(tmp_vector,bullet_instance.coordinate,bullet_instance.direction);
    mat4.targetTo(w,bullet_instance.coordinate,tmp_vector,[0,1,0]);
    mat4.rotateZ(w,w,deg2rad(90));
    mat4.rotateX(w,w,deg2rad(-90));
    vec3.add(player.camera_coordinates,player.coordinate,player.lookingto);
    glMatrix.mat4.lookAt(v,player.coordinate,player.camera_coordinates,[0,1,0]);//camera 
  
    gl.uniformMatrix4fv(world,gl.FALSE,w);
    gl.uniformMatrix4fv(view,gl.FALSE,v);
    gl.uniformMatrix4fv(projection,gl.FALSE,p);
    glMatrix.mat4.identity(identitymatrix);
    gl.drawArrays(gl.TRIANGLES,0,bullet.arraybuffer.length/6);
}



function draw_bullet_array_enemy(gl,bullet_array,bullet,program,identitymatrix,w,v,p,world,view,projection,pos,color){
    const len=active_length_enemy_rifle;
    if(len==0){
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,bullet.buffer);
    gl.vertexAttribPointer(pos,3,gl.FLOAT,gl.FALSE,6*Float32Array.BYTES_PER_ELEMENT,0);
    gl.vertexAttribPointer(color,3,gl.FLOAT,gl.FALSE,6*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(pos);
    gl.enableVertexAttribArray(color);

    for(let i=0;i<len;i++){
        if(bullet_array[i].life>0){
            draw_bullet_enemy(gl,bullet_array[i],bullet,program,identitymatrix,w,v,p,world,view,projection);
        }
    }
}

//choose correct ai for different enemy types (called in main)
function enemy_AI(enemy_list,player,bullet_array,rocket_array,pool){
    
    for(let i=0;i<active_length_enemy_list;i++){
        if(enemy_list[i].id==0){
            enemy_list[i].type.AI_BLUE(enemy_list[i],player,bullet_array,pool);
        }else if(enemy_list[i].id==1){
            enemy_list[i].type.AI_YELLOW(enemy_list[i],player,bullet_array);
        }else if(enemy_list[i].id==2){
            enemy_list[i].type.AI_GREEN(enemy_list[i],player,rocket_array,pool);
        }
    }
}

//choose correct draw for different enemies
function draw_enemies(enemy_list,player,gl,program,identitymatrix,w,v,p,world,view,projection,pos,color){

    for(let i=0;i<active_length_enemy_list;i++){
        
        if(enemy_list[i].id==0){
            
            draw_enemy_blue(gl,enemy_list[i],enemy_list[i].type,program,identitymatrix,enemy_list[i].type.program,w,v,p,world,view,projection,pos,color);
        }else if(enemy_list[i].id==1){
            draw_enemy_yellow(gl,enemy_list[i],enemy_list[i].type,program,identitymatrix,enemy_list[i].type.program,w,v,p,world,view,projection,pos,color);
        }else if(enemy_list[i].id==2){
            draw_enemy_green(gl,enemy_list[i],player,enemy_list[i].type,program,identitymatrix,enemy_list[i].type.program,w,v,p,world,view,projection,pos,color);
        }

    }
}

//delete enemies 
function destroy_enemies(enemy_list, portal) {


    for (let i = active_length_enemy_list - 1; i >= 0; i--) {
        if (enemy_list[i].death_count <= 0) {
            
            
           shift_left_array_v2(i,enemy_list,active_length_enemy_list);
           active_length_enemy_list-=1;
            
            
        }
    }
}


function shift_left_array_v2(index,array,len){
    for(let i=index;i<len-1;i++){
        array[i]=array[i+1];
    }
}









































