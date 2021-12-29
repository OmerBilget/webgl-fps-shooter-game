class ROCKET{
    vertices=[];
    faces=[];
    arraybuffer=[];
    material=[];
    materialindex=[];
    materialid=[];
    program;
    id;

    speed_original;
    maxvelocity;
    maxrotatespeed;
    rotatespeed_original;
    forward_turn;
    acc;
    constructor(rocketOBJ,rocketMTL,id,scale,speed_original,acc,max_velocity,rotatespeed_original,maxrotatespeed,forward_turn){
      
        parseOBJ(rocketOBJ,this,scale);
        parseMTL(rocketMTL,this);
        this.arraybuffer=createBufferArray(this);
        this.id=id;
        this.speed_original=speed_original;
        this.max_velocity=max_velocity;
        this.rotatespeed_original=rotatespeed_original;
        this.maxrotatespeed=maxrotatespeed;
        this.forward_turn=forward_turn;
        this.acc=acc;
    }
}

class ROCKET_INSTANCE{

    velocity;
    acc;
    speed_original;
    rotateSpeed;
    maxvelocity;
    rotatespeed_original;
    maxrotatespeed;
    forward_turn;
    frame;
    translation;
    direction;
    speed;
    life;
    rotationX;
    rotationY;
    type;
    target;
   
    constructor(translation,direction,speed,rotationX,rotationY,life,type,target){
        this.translation=translation;
        this.direction=direction;
        this.velocity=[0,0,0];
    }
    move_rocket(){
        if(this.life>0){
            this.life-=1;
            //
            if(this.speed<this.speed_original){
                this.speed+=this.acc;
            }
           
            
            
          
            vec3.sub(desired_direction,this.translation,this.target.translation);
            vec3.normalize(desired_direction,desired_direction);
            vec3.cross(tmp_vector,desired_direction,this.direction);
            var angle=vec3.angle(desired_direction,this.direction);
            angle=rad2deg(angle);
            angle+=180;
            if(angle>360){
                angle-=360;
            }else if(angle<0){
                angle+=360;
            }
            if(angle<20 || angle>340){
                //this.rotateSpeed=0;
            }else if(angle<rad2deg(90)){
                
            }
            if(this.frame<25){
                this.rotateSpeed=0;
                this.frame+=1;
                
                
                
            }else{
                if(this.rotateSpeed<this.rotatespeed_original){
                    this.rotateSpeed+=0.003;
                }else if(this.rotateSpeed>this.max_rotate_speed){
                    this.rotateSpeed-=0.003;
                }
            }
            var dist=vec3.distance(this.translation,this.target.translation);
            if(dist<20){
                this.rotateSpeed*=1.02;
                this.speed*=0.97;
            }
            
            
            
            mat4.fromTranslation(rotateMatrix,this.direction);
            mat4.rotate(rotateMatrix,rotateMatrix,this.rotateSpeed,tmp_vector);
            vec3.transformMat4(this.direction,this.direction,rotateMatrix);
            

            if(this.translation[1]<10){ // if rocket too close to the ground
                vec3.add(this.direction,this.direction,[0,0.2,0]);
                vec3.normalize(this.direction,this.direction);
            }
            vec3.scale(this.velocity,this.direction,this.speed);
            vec3.normalize(this.direction,this.direction);
            vec3.scale(this.velocity,this.direction,this.speed);
            vec3.add(this.translation,this.translation,this.velocity); 
            //vec3.rotateY(this.velocity,this.velocity,[0,0,0],0.01);
        }
        
    }


    generate(translation,direction,speed,rotationX,rotationY,life,type,target){
        vec3.copy(this.translation,translation);
        vec3.copy(this.direction,direction);
        this.speed=speed;
        vec3.scale(this.velocity,direction,speed);
        this.life=life;
        this.rotationX=rotationX;
        this.rotationY=rotationY;
        this.type=type;
        this.target=target;
        this.acc=this.type.acc;
        this.rotateSpeed=0.0;
        this.maxrotatespeed=this.type.maxrotatespeed;
        this.rotatespeed_original=this.type.maxrotatespeed;
        this.speed_original=this.type.speed_original;
        this.frame=0;
        this.forward_turn=this.type.forward_turn;
    }

}
var desired_direction=[0,0,0];

class ROCKET_INSTANCE_ENEMY{

    velocity;
    acc;
    speed_original;
    rotateSpeed;
    maxvelocity;
    rotatespeed_original;
    maxrotatespeed;
    forward_turn;
    frame;
    health;
    constructor(translation,direction,speed,rotationX,rotationY,life,type,target){
        this.translation=[0,0,0];
        this.direction=[0,0,0];
        this.velocity=[0,0,0];
    }
    move_rocket(){
        if(this.life>0){
            this.life-=1;
            //
            if(this.speed<this.speed_original){
                this.speed+=this.acc;
            }
           
            
           
            vec3.sub(desired_direction,this.translation,this.target.coordinate);
            vec3.normalize(desired_direction,desired_direction);
            vec3.cross(tmp_vector,desired_direction,this.direction);
            var angle=vec3.angle(desired_direction,this.direction);
            angle=rad2deg(angle);

            angle+=180;
            if(angle>360){
                angle-=360;
            }else if(angle<0){
                angle+=360;
            }

            var dist=vec3.distance(this.translation,this.target.coordinate);
            if(dist<20){
                this.rotateSpeed*=1.02;
                this.speed*=0.97;
            }else if((angle<15 || angle>345)&&dist>40){
                this.rotateSpeed*=0.3;
            }else if(angle<rad2deg(90)){
                
            }
            if(this.frame<25){
                this.rotateSpeed=0;
                this.frame+=1;
               
            }else{
                if(this.rotateSpeed<this.rotatespeed_original){
                    this.rotateSpeed+=0.003;
                }else if(this.rotateSpeed>this.max_rotate_speed){
                    this.rotateSpeed-=0.003;
                }
            }
         
           
            var rotateMatrix=mat4.create();
            
            
            mat4.fromTranslation(rotateMatrix,this.direction);
            mat4.rotate(rotateMatrix,rotateMatrix,this.rotateSpeed,tmp_vector);
            vec3.transformMat4(this.direction,this.direction,rotateMatrix);
            

            if(this.translation[1]<10){ // if rocket too close to the ground
                vec3.add(this.direction,this.direction,rocket_up);
                vec3.normalize(this.direction,this.direction);
            }


            vec3.scale(this.velocity,this.direction,this.speed);
            vec3.normalize(this.direction,this.direction);
            vec3.scale(this.velocity,this.direction,this.speed);
            vec3.add(this.translation,this.translation,this.velocity); 
            //vec3.rotateY(this.velocity,this.velocity,[0,0,0],0.01);
        }    
    }
    generate(translation,direction,speed,rotationX,rotationY,life,type,target){
        this.translation=translation;
        this.direction=direction;
        this.speed=speed;
        this.life=life;
        this.rotationX=rotationX;
        this.rotationY=rotationY;
        this.type=type;
        this.target=target;
        this.acc=this.type.acc;
        this.rotateSpeed=0.0;
        this.maxrotatespeed=this.type.maxrotatespeed;
        this.rotatespeed_original=this.type.maxrotatespeed;
        this.speed_original=this.type.speed_original;
        this.frame=0;
        this.forward_turn=this.type.forward_turn;
        this.health=green_damage;
    }
}

var rocket_up=[0,0.2,0];

function draw_rocket(gl,rocket_instance,type,program,identitymatrix,w,v,p,world,view,projection){
   

    mat4.translate(w,identitymatrix,rocket_instance.translation);
    
    vec3.add(tmp_vector,rocket_instance.translation,rocket_instance.direction);
    mat4.targetTo(w,rocket_instance.translation,tmp_vector,[0,1,0]);
    //mat4.targetTo(w,rocket_instance.translation,rocket_instance.target.translation,[0,1,0]);
    vec3.add(player.camera_coordinates,player.coordinate,player.lookingto);
    glMatrix.mat4.lookAt(v,player.coordinate,player.camera_coordinates,direction_up);//camera 
  
    
    gl.uniformMatrix4fv(world,gl.FALSE,w);
    gl.uniformMatrix4fv(view,gl.FALSE,v);
    gl.uniformMatrix4fv(projection,gl.FALSE,p);
    glMatrix.mat4.identity(identitymatrix);
    gl.drawArrays(gl.TRIANGLES,0,type.arraybuffer.length/6);
}




function check_rocket_array_player(rocket_array,pool){
    if(active_length_player_rocket>0){
        if(rocket_array[0].life<=0){
            pool.returnrocket_player(rocket_array[0]);
            shift_left_array(rocket_array,active_length_player_rocket);
            active_length_player_rocket-=1;
        }
    }
}

function check_rocket_array_enemy(rocket_array,pool){
    if(active_length_enemy_rocket>0){
        if(rocket_array[0].life<=0){
            pool.returnrocket_enemy(rocket_array[0]);
            shift_left_array(rocket_array,active_length_enemy_rocket);
            active_length_enemy_rocket-=1;
        }
    }
}

function update_rocket_array(rocket_array,len){
    for(var i=0;i<len;i++){
        rocket_array[i].move_rocket();
    }
}


function create_rocket(player,rocket_array,type,target,pool){
    var rocket=pool.getrocket_player();
    console.log(rocket);
    var rocket_coordinate=rocket.translation;
    var rocket_direction=rocket.direction;
    vec3.copy(tmp_vector,player.lookingto);
    vec3.scale(tmp_vector,tmp_vector,player.equipped_gun.ammo_create_location);
    vec3.copy(rocket_coordinate,player.equipped_gun.translation);
    vec3.add(rocket_coordinate,rocket_coordinate,tmp_vector);
    vec3.copy(rocket_direction,player.lookingto);

    rocket.generate(rocket_coordinate,rocket_direction,player.equipped_gun.ammo_speed,0,0,player.equipped_gun.ammo_life,type,target);
    rocket_array[active_length_player_rocket]=rocket;
    active_length_player_rocket+=1;
}


function draw_rocket_array(gl,rocket_array,type,program,identitymatrix,w,v,p,world,view,projection,pos,color,active_len){

    if(active_len==0){
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(type.arraybuffer),gl.STATIC_DRAW);
    gl.vertexAttribPointer(pos,3,gl.FLOAT,gl.FALSE,6*Float32Array.BYTES_PER_ELEMENT,0);
    gl.vertexAttribPointer(color,3,gl.FLOAT,gl.FALSE,6*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(pos);
    gl.enableVertexAttribArray(color);
    for(let i=0;i<active_len;i++){
        if(rocket_array[i].life>0){
            draw_rocket(gl,rocket_array[i],type,program,identitymatrix,w,v,p,world,view,projection);
        }
    }
}



function rocket_collision(rocket_array,collision_range,damage){
    const len=active_length_player_rocket;
    if(len==0 ){
        return;
    }
    
    for(var i=0;i<len;i++){
        if(rocket_array[i].life==0){
            continue;
        }
        let target_object=rocket_array[i].target;
        if(target_object==null){
            alert("dude its dead");
            rocket_array[i].life=0;
            continue;
        }
        let dist=vec3.distance(rocket_array[i].translation,target_object.translation);
        if(dist<=collision_range){ // if bullet is colliding with target
            rocket_array[i].life=0;
            target_object.health-=damage; // damage target 
            target_object.hit=20;
            if(target_object.health<=0){ 
                game.kill(target_object.id);
                player.heal_player(target_object.id);
                target_object.state=3; //death state
                
                
                vec3.copy( target_object.move_direction,rocket_array[i].direction);//fall to the ground;
                target_object.move_speed=0.1;
                target_object.frame=0;
                return;
            }else{
                vec3.scale(tmp_vector,rocket_array[i].direction,12);
                 vec3.copy(target_object.sniper_hit_vector,tmp_vector);
                 target_object.sniper_hit_counter=50;
            }
        }
    }
}





const rocketOBJ=
`# Blender v2.93.6 OBJ File: 'rocket.blend'
# www.blender.org
mtllib rocket.mtl
o Cylinder
v 0.866025 0.500000 1.000000
v 0.866025 0.500000 -1.000000
v -0.000000 1.000000 1.000000
v 0.717629 0.414323 -2.026198
v 0.400094 -0.230994 -2.881053
v 0.400094 0.230994 -2.881053
v 0.171102 0.098785 -3.233730
v -0.000000 0.197571 -3.233730
v 0.000000 -0.000000 -3.427282
v 0.000000 -0.709172 3.183235
v 0.614161 0.354586 3.183235
v 1.106234 -0.220792 1.750896
v 1.106234 0.220793 1.750896
v 0.995014 -0.156580 3.351771
v 0.995014 0.156580 3.351771
v 2.133719 0.000000 3.353989
v 2.095517 0.000000 3.903865
v -0.000000 1.000000 -1.000000
v -0.866026 0.500000 1.000000
v -0.866026 0.500000 -1.000000
v -0.866025 -0.500000 1.000000
v -0.866025 -0.500000 -1.000000
v -0.000000 0.828646 -2.026198
v -0.717629 0.414323 -2.026198
v -0.000000 0.461989 -2.881053
v -0.400094 0.230994 -2.881053
v -0.400094 -0.230994 -2.881053
v -0.171102 0.098785 -3.233729
v -0.000000 0.709172 3.183234
v -0.614161 0.354586 3.183234
v -0.361905 1.068423 1.750896
v -0.744329 0.847631 1.750896
v -0.361905 0.939998 3.351770
v -0.633109 0.783418 3.351770
v -1.066860 1.847855 3.353989
v -1.047759 1.814771 3.903865
v 0.000000 -1.000000 1.000000
v 0.000000 -1.000000 -1.000000
v 0.866026 -0.500000 1.000000
v 0.866026 -0.500000 -1.000000
v -0.717629 -0.414323 -2.026198
v 0.000000 -0.828646 -2.026198
v 0.717629 -0.414323 -2.026198
v 0.000000 -0.461989 -2.881053
v -0.171102 -0.098786 -3.233729
v 0.000000 -0.197571 -3.233729
v 0.171102 -0.098786 -3.233729
v -0.614161 -0.354586 3.183234
v 0.614161 -0.354586 3.183234
v -0.744329 -0.847631 1.750896
v -0.361905 -1.068423 1.750896
v -0.633109 -0.783418 3.351770
v -0.361905 -0.939998 3.351770
v -1.066859 -1.847855 3.353989
v -1.047758 -1.814771 3.903864
v -0.000000 0.535890 3.316701
v -0.464094 0.267945 3.316701
v 0.000000 -0.535890 3.316701
v 0.464094 -0.267945 3.316701
v 0.464094 0.267945 3.316701
v -0.464094 -0.267945 3.316701
v -0.000000 0.358091 3.766310
v -0.310116 0.179046 3.766310
v -0.000000 -0.358091 3.766310
v 0.310116 -0.179045 3.766310
v 0.310116 0.179046 3.766310
v -0.310116 -0.179045 3.766310
v -0.000000 0.222743 3.817164
v -0.192901 0.111371 3.817164
v -0.000000 -0.222742 3.817164
v 0.192901 -0.111371 3.817164
v 0.192901 0.111371 3.817164
v -0.192901 -0.111371 3.817164
v 0.000000 0.222743 3.580921
v -0.192900 0.111371 3.580921
v 0.000000 -0.222742 3.580921
v 0.192901 -0.111371 3.580921
v 0.192901 0.111371 3.580921
v -0.192900 -0.111371 3.580921
v 0.748464 0.432126 -1.812967
v -0.000000 0.864251 -1.812967
v -0.748464 0.432126 -1.812967
v 0.000000 -0.864252 -1.812966
v 0.748464 -0.432126 -1.812966
v -0.748464 -0.432126 -1.812966
usemtl Material.001
s off
f 10/1/1 61/2/1 48/3/1
f 3/4/2 11/5/2 1/6/2
f 19/7/3 48/8/3 30/9/3
f 37/10/4 49/11/4 10/12/4
f 60/13/5 62/14/5 66/15/5
f 29/16/6 60/13/6 11/5/6
f 10/12/7 59/17/7 58/18/7
f 30/19/8 56/20/8 29/21/8
f 30/9/9 61/22/9 57/23/9
f 11/24/10 59/25/10 49/26/10
f 66/27/11 71/28/11 65/29/11
f 58/18/12 65/30/12 64/31/12
f 57/23/13 67/32/13 63/33/13
f 60/34/14 65/29/14 59/25/14
f 57/35/15 62/36/15 56/20/15
f 58/37/16 67/38/16 61/2/16
f 71/39/17 76/40/17 70/41/17
f 62/36/18 69/42/18 68/43/18
f 64/44/19 73/45/19 67/38/19
f 66/15/20 68/46/20 72/47/20
f 64/31/21 71/39/21 70/41/21
f 67/32/22 69/48/22 63/33/22
f 77/49/23 74/50/23 79/51/23
f 73/52/24 75/53/24 69/48/24
f 71/28/25 78/54/25 77/49/25
f 68/43/26 75/55/26 74/56/26
f 70/57/27 79/58/27 73/45/27
f 68/46/28 78/59/28 72/47/28
f 10/1/1 58/37/1 61/2/1
f 3/4/2 29/16/2 11/5/2
f 19/7/3 21/60/3 48/8/3
f 37/10/4 39/61/4 49/11/4
f 60/13/5 56/62/5 62/14/5
f 29/16/6 56/62/6 60/13/6
f 10/12/7 49/11/7 59/17/7
f 30/19/8 57/35/8 56/20/8
f 30/9/9 48/8/9 61/22/9
f 11/24/10 60/34/10 59/25/10
f 66/27/11 72/63/11 71/28/11
f 58/18/12 59/17/12 65/30/12
f 57/23/13 61/22/13 67/32/13
f 60/34/14 66/27/14 65/29/14
f 57/35/15 63/64/15 62/36/15
f 58/37/16 64/44/16 67/38/16
f 71/39/17 77/65/17 76/40/17
f 62/36/18 63/64/18 69/42/18
f 64/44/19 70/57/19 73/45/19
f 66/15/20 62/14/20 68/46/20
f 64/31/21 65/30/21 71/39/21
f 67/32/22 73/52/22 69/48/22
f 79/51/23 76/66/23 77/49/23
f 77/49/23 78/54/23 74/50/23
f 74/50/23 75/67/23 79/51/23
f 73/52/24 79/68/24 75/53/24
f 71/28/25 72/63/25 78/54/25
f 68/43/26 69/42/26 75/55/26
f 70/57/27 76/69/27 79/58/27
f 68/46/28 74/70/28 78/59/28
usemtl Material.002
f 43/71/29 6/72/29 4/73/29
f 4/73/30 25/74/30 23/75/30
f 6/72/31 47/76/31 7/77/31
f 6/72/32 8/78/32 25/74/32
f 8/78/33 7/77/33 9/79/33
f 7/77/34 47/76/34 9/80/34
f 15/81/35 16/82/35 13/83/35
f 12/84/36 13/83/36 16/85/36
f 14/86/37 16/85/37 17/87/37
f 15/88/38 14/89/38 17/90/38
f 24/91/39 25/92/39 26/93/39
f 24/91/40 27/94/40 41/95/40
f 25/92/41 28/96/41 26/93/41
f 26/93/42 45/97/42 27/94/42
f 45/97/43 28/96/43 9/79/43
f 28/96/44 8/98/44 9/80/44
f 34/99/45 35/100/45 32/101/45
f 31/102/46 32/101/46 35/103/46
f 33/104/47 35/103/47 36/105/47
f 34/106/48 33/107/48 36/108/48
f 41/109/49 44/110/49 42/111/49
f 43/112/50 44/110/50 5/113/50
f 44/110/51 45/114/51 46/115/51
f 5/113/52 46/115/52 47/116/52
f 47/116/53 46/115/53 9/79/53
f 46/115/54 45/114/54 9/80/54
f 53/117/55 54/118/55 51/119/55
f 50/120/56 51/119/56 54/121/56
f 52/122/57 54/121/57 55/123/57
f 53/124/58 52/125/58 55/126/58
f 43/71/29 5/127/29 6/72/29
f 4/73/30 6/72/30 25/74/30
f 6/72/31 5/127/31 47/76/31
f 6/72/32 7/77/32 8/78/32
f 15/81/59 17/128/59 16/82/59
f 14/86/60 12/84/60 16/85/60
f 24/91/39 23/129/39 25/92/39
f 24/91/40 26/93/40 27/94/40
f 25/92/41 8/98/41 28/96/41
f 26/93/42 28/96/42 45/97/42
f 34/99/61 36/130/61 35/100/61
f 33/104/62 31/102/62 35/103/62
f 41/109/49 27/131/49 44/110/49
f 43/112/50 42/111/50 44/110/50
f 44/110/51 27/131/51 45/114/51
f 5/113/52 44/110/52 46/115/52
f 53/117/63 55/132/63 54/118/63
f 52/122/64 50/120/64 54/121/64
usemtl Material.003
f 40/133/24 1/6/24 39/134/24
f 2/135/27 3/4/27 1/6/27
f 18/136/17 19/7/17 3/137/17
f 20/138/25 21/60/25 19/7/25
f 22/139/28 37/10/28 21/140/28
f 38/141/26 39/61/26 37/10/26
f 38/141/65 84/142/65 40/143/65
f 38/141/66 85/144/66 83/145/66
f 20/138/67 85/146/67 22/147/67
f 18/136/68 82/148/68 20/138/68
f 2/135/69 81/149/69 18/150/69
f 40/133/70 80/151/70 2/135/70
f 40/133/24 2/135/24 1/6/24
f 2/135/27 18/150/27 3/4/27
f 18/136/17 20/138/17 19/7/17
f 20/138/25 22/147/25 21/60/25
f 22/139/28 38/141/28 37/10/28
f 38/141/26 40/143/26 39/61/26
f 38/141/65 83/145/65 84/142/65
f 38/141/66 22/139/66 85/144/66
f 20/138/67 82/148/67 85/146/67
f 18/136/68 81/152/68 82/148/68
f 2/135/69 80/151/69 81/149/69
f 40/133/70 84/153/70 80/151/70
usemtl Material.004
f 80/151/70 43/71/70 4/73/70
f 80/151/69 23/75/69 81/149/69
f 49/154/71 12/84/71 14/86/71
f 49/26/72 15/88/72 11/24/72
f 1/6/73 12/84/73 39/134/73
f 11/5/74 13/83/74 1/6/74
f 81/152/68 24/91/68 82/148/68
f 82/148/67 41/95/67 85/146/67
f 29/155/75 31/102/75 33/104/75
f 29/21/76 34/106/76 30/19/76
f 19/7/77 31/102/77 3/137/77
f 30/9/78 32/101/78 19/7/78
f 85/144/66 42/111/66 83/145/66
f 83/145/65 43/112/65 84/142/65
f 48/156/79 50/120/79 52/122/79
f 10/1/80 52/125/80 53/124/80
f 37/10/81 50/120/81 21/140/81
f 10/12/82 51/119/82 37/10/82
f 80/151/70 84/153/70 43/71/70
f 80/151/69 4/73/69 23/75/69
f 49/154/83 39/134/83 12/84/83
f 49/26/72 14/89/72 15/88/72
f 1/6/73 13/83/73 12/84/73
f 11/5/84 15/81/84 13/83/84
f 81/152/68 23/129/68 24/91/68
f 82/148/67 24/91/67 41/95/67
f 29/155/85 3/137/85 31/102/85
f 29/21/76 33/107/76 34/106/76
f 19/7/77 32/101/77 31/102/77
f 30/9/86 34/99/86 32/101/86
f 85/144/66 41/109/66 42/111/66
f 83/145/65 42/111/65 43/112/65
f 48/156/87 21/140/87 50/120/87
f 10/1/80 48/3/80 52/125/80
f 37/10/81 51/119/81 50/120/81
f 10/12/88 53/117/88 51/119/88`;

const rocketMTL=
`newmtl Material.001
Kd 0.145174 0.145174 0.145174
newmtl Material.002
Kd 0.800000 0.000000 0.000269
newmtl Material.003
Kd 0.049283 0.049283 0.049283
newmtl Material.004
Kd 0.007221 0.007221 0.007221`;

const rocketenemyMTL=
`newmtl Material.001
Kd 0.145174 0.145174 0.145174
newmtl Material.002
Kd 0.000000 0.800000 0.000476
newmtl Material.003
Kd 0.049283 0.049283 0.049283
newmtl Material.004
Kd 0.007221 0.007221 0.007221`;

