const correct_amount=0.2;

/*
blue enemy 
has blue visor
shoots rapid low damage projectiles
moves straight lines

*/

//every blue instance uses blue template to draw and ai
class BLUE {
    vertices=[];
    faces=[];
    material=[];
    materialindex=[];
    materialid=[];
    arraybuffer;
    arraybufferhit;
    buffer;
    bufferhit;
    program;
    cooldown;
    max_bullet;
    move_time;
    move_speed;
    rotate_speed;
    bullet_type;
    min_dist;
    max_health;
    constructor(cooldown,max_bullet,move_time,move_speed,rotate_speed,bullet_type,scale,damage,max_health){ 
       parseOBJ(blueOBJ,this,scale);
       parseMTL(BlueMTL,this);
       this.cooldown=cooldown;
       this.max_bullet=max_bullet;
       this.bullet_count=0;
       this.move_time=move_time;
       this.move_speed=move_speed;
       this.rotate_speed=rotate_speed;
       this.bullet_type=bullet_type;
       this.min_dist=100;
       this.arraybuffer=new Float32Array(createBufferArray(this));
       this.material=[];
       parseMTL(BlueMTL_HIT,this);
       this.arraybufferhit=new Float32Array(createBufferArray(this));
       this.damage=damage;
       this.max_health=max_health;
    };
    
    AI_BLUE(enemy,player,bullet_array,pool){


         if(enemy.state==0){//idle movement decide move direction 
              vec3.copy(enemy.move_coordinate_prev,enemy.move_coordinate);
              enemy.move_coordinate=[rand_range(-blue_move_range_horizontal,blue_move_range_horizontal),rand_range(blue_move_range_vertical_lower,blue_move_range_vertical_upper),rand_range(-blue_move_range_horizontal,blue_move_range_horizontal)];
              vec3.sub(enemy.move_direction,enemy.move_coordinate,enemy.translation); 
              var dist=vec3.length(enemy.move_direction);
              enemy.distance_traveled+=dist;
              vec3.normalize(enemy.move_direction,enemy.move_direction);
              vec3.scale(enemy.move_direction,enemy.move_direction,this.move_speed);
              vec3.copy(enemy.lookingto,enemy.move_coordinate_prev);
              enemy.frame=0;
              enemy.prev_state=0;
              enemy.state=4;


        }else if(enemy.state==1){//move direction move_time times
              vec3.add(enemy.translation,enemy.translation,enemy.move_direction);
              enemy.move_time-=1;
              if(enemy.move_time<=0 || vec3.dist(enemy.translation,enemy.move_coordinate)<=5){
                  enemy.frame=0;
                  enemy.move_time=enemy.type.move_time;
                  vec3.copy(enemy.move_coordinate,player.coordinate);
                  enemy.prev_state=1;
                  enemy.state=4;
              }


        }else if(enemy.state==2){//fire all bullets 
            
            if(enemy.bullet_count>0 && enemy.shoot_interval<=0){

                create_bullet_enemy(enemy,bullet_array,this.bullet_type,pool);
                
                enemy.bullet_count-=1;
                enemy.shoot_interval=this.cooldown;
            }else if(enemy.bullet_count<=0){  //run out of ammo
                enemy.frame=0;
                enemy.bullet_count=this.max_bullet;
                enemy.shoot_interval=0;
                enemy.distance_traveled=0;
                enemy.state=0;
            }
            enemy.shoot_interval-=1;
            
            
        }else if(enemy.state==3){//death
            //die fall to the ground
            vec3.scale(enemy.velocity,enemy.move_direction,enemy.move_speed);
            enemy.move_speed+=0.015;
            vec3.add(enemy.translation,enemy.translation,enemy.velocity);
            vec3.lerp(enemy.move_direction,enemy.move_direction,[0,-1,0],0.020*enemy.frame);
            vec3.lerp(enemy.lookingto,enemy.lookingto,[0,-1,0],0.1*enemy.frame);
            enemy.frame+=1;
            if(enemy.translation[1]<0){
                enemy.state=5;
            }

        }else if(enemy.state==4){//rotate
             vec3.lerp(enemy.lookingto,enemy.lookingto,enemy.move_coordinate,0.02*enemy.frame);
             enemy.frame+=1;
             if(vec3.equals(enemy.lookingto,enemy.move_coordinate)==true){
                 enemy.frame=0;
                 if(enemy.prev_state==0){
                    enemy.state=1;
                 }else if(enemy.prev_state==1){
                     if(enemy.distance_traveled>this.min_dist){
                        enemy.distance_traveled=0;
                        enemy.state=2;
                     }else{
                        enemy.state=0;
                     }
                 }else{
                     enemy.distance_traveled=0;
                    enemy.state=0;
                 }
             }
        }else if(enemy.state==5){ //falled to the ground waiting to deletion
             enemy.death_count-=1;
        }else if(enemy.state==6){ //player has fired guided missile to the enemy  enemy must avoid for a time 
             let randomX=Math.random()*2;
             let randomY=Math.random()*2;
             let randomZ=Math.random()*2;
             vec3.rotateX(enemy.lookingto,enemy.lookingto,[0,0,0],deg2rad(randomX));
             vec3.rotateY(enemy.lookingto,enemy.lookingto,[0,0,0],deg2rad(randomY));
             vec3.rotateZ(enemy.lookingto,enemy.lookingto,[0,0,0],deg2rad(randomZ));


             //if enemy going out of map correct positions

             //y axis
             if(enemy.translation[1]<25){
                vec3.add(enemy.lookingto,enemy.lookingto,[0,correct_amount,0]);
                vec3.normalize(enemy.lookingto,enemy.lookingto);
             }else if(enemy.translation[1]>60){
                vec3.add(enemy.lookingto,enemy.lookingto,[0,-correct_amount,0]);
                vec3.normalize(enemy.lookingto,enemy.lookingto);
             }

             //x axis
             if(enemy.translation[0]<-50){
                vec3.add(enemy.lookingto,enemy.lookingto,[correct_amount,0,0]);
                vec3.normalize(enemy.lookingto,enemy.lookingto);
             }else if(enemy.translation[0]>50){
                vec3.add(enemy.lookingto,enemy.lookingto,[-correct_amount,0,0]);
                vec3.normalize(enemy.lookingto,enemy.lookingto);
             }

             //z axis
             if(enemy.translation[2]<-50){
                vec3.add(enemy.lookingto,enemy.lookingto,[0,0,correct_amount]);
                vec3.normalize(enemy.lookingto,enemy.lookingto);
             }else if(enemy.translation[2]>50){
                vec3.add(enemy.lookingto,enemy.lookingto,[0,0,-correct_amount]);
                vec3.normalize(enemy.lookingto,enemy.lookingto);
             }

             
            
             vec3.scale(tmp_vector,enemy.lookingto,this.move_speed*1.5);
             vec3.add(enemy.translation,enemy.translation,tmp_vector);
             enemy.hit+=1;
             enemy.emergency_counter-=1;
             if(enemy.emergency_counter<0){
                 enemy.hit=0;
                 enemy.state=4;
                 enemy.distance_traveled=200;
             }
        }




        if(enemy.hit>0){
            enemy.hit-=1;
        }
        if(enemy.sniper_hit_counter>0){
            enemy.sniper_hit_counter-=1;
            vec3.lerp(enemy.sniper_hit_vector,enemy.sniper_hit_vector,origin_vec,0.1);
            vec3.add(enemy.translation,enemy.translation,enemy.sniper_hit_vector);
        }
    }
    //when chased by player rocket enters flee state
    emergency(enemy,player,rocket_instance){
        console.log(rocket_instance);
        var emergency_direction=[0,0,0];
        vec3.sub(emergency_direction,enemy.translation,rocket_instance.translation);
        vec3.normalize(emergency_direction,emergency_direction);
        enemy.lookingto=emergency_direction;
        enemy.prev_state=enemy.state;
        enemy.emergency_counter=rocket_instance.life; // stay in emergency while rocket is chasing enemy
        enemy.state=6;
        enemy.hit=2;
    }

    createBufferData(gl){
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER,this.arraybuffer,gl.STATIC_DRAW);

        this.bufferhit=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.bufferhit);
        gl.bufferData(gl.ARRAY_BUFFER,this.arraybufferhit,gl.STATIC_DRAW);
     }
}


class BLUE_INSTANCE extends ENEMY{
    constructor(health,max_health,translation,rotation,type,id){
        super(health,max_health,translation,rotation,type,id);
       
    }
    
}










function draw_enemy_blue(gl,enemy,type,program,identitymatrix,program,w,v,p,world,view,projection,pos,color){
    
   
    if(enemy.hit>0){
        gl.bindBuffer(gl.ARRAY_BUFFER,type.bufferhit);
    }else{
        gl.bindBuffer(gl.ARRAY_BUFFER,type.buffer);
    }
   

    mat4.translate(w,identitymatrix,enemy.translation);
    
    if(enemy.state==2 || enemy.state==0){
        mat4.targetTo(w,enemy.translation,player.coordinate,direction_up);
    }else if(enemy.state==1){
        mat4.targetTo(w,enemy.translation,enemy.move_coordinate,direction_up);
    }else if(enemy.state==4 || enemy.state==3){
        mat4.targetTo(w,enemy.translation,enemy.lookingto,direction_up);
    }else if(enemy.state==6){
       
        vec3.add(tmp_vector,enemy.translation,enemy.lookingto);
         mat4.targetTo(w,enemy.translation,tmp_vector,direction_up);
    }
    mat4.rotateX(w,w,Math.PI);
    mat4.rotateY(w,w,deg2rad(enemy.rotation[1]));
    mat4.rotateZ(w,w,Math.PI);
  
    vec3.add(player.camera_coordinates,player.coordinate,player.lookingto);
    
    mat4.lookAt(v,player.coordinate,player.camera_coordinates,direction_up);//camera 
  
  
    gl.vertexAttribPointer(pos,3,gl.FLOAT,gl.FALSE,6*Float32Array.BYTES_PER_ELEMENT,0);
    gl.vertexAttribPointer(color,3,gl.FLOAT,gl.FALSE,6*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(pos);
    gl.enableVertexAttribArray(color);
    gl.uniformMatrix4fv(world,gl.FALSE,w);
    gl.uniformMatrix4fv(view,gl.FALSE,v);
    gl.uniformMatrix4fv(projection,gl.FALSE,p);
    gl.drawArrays(gl.TRIANGLES,0,type.arraybuffer.length/6);

}































var blueOBJ=
`v 0.788005 0.235357 -0.257880
v 0.788825 0.381073 -0.061840
v 0.615399 0.786537 -0.666850
v 0.523490 1.228369 -0.690524
v 0.749621 0.227686 -0.252018
v 0.750441 0.373403 -0.055978
v 0.577015 0.778867 -0.660988
v 0.485106 1.220698 -0.684662
v -0.788005 0.235357 -0.257880
v -0.788825 0.381073 -0.061840
v -0.615399 0.786537 -0.666850
v -0.523490 1.228369 -0.690524
v -0.749621 0.227686 -0.252018
v -0.750441 0.373403 -0.055978
v -0.577015 0.778867 -0.660988
v -0.485106 1.220699 -0.684662
v 0.271054 -0.593287 0.891029
v 0.341990 -0.644177 0.849425
v 0.418610 -0.658124 -0.165090
v 0.481510 -0.677377 -0.041009
v 0.630167 -0.082316 0.878304
v 0.701103 -0.133205 0.836701
v 0.716435 -0.234358 -0.175643
v 0.758772 -0.282868 -0.050833
v 0.567259 -0.449387 -0.304112
v 0.695473 -0.534823 -0.116468
v 0.394119 -0.288847 1.256168
v 0.522713 -0.380389 1.209383
v -0.271054 -0.593287 0.891029
v -0.341990 -0.644177 0.849426
v -0.418610 -0.658124 -0.165090
v -0.481510 -0.677377 -0.041009
v -0.630167 -0.082316 0.878304
v -0.701103 -0.133205 0.836701
v -0.716435 -0.234358 -0.175643
v -0.758772 -0.282868 -0.050833
v -0.567259 -0.449387 -0.304112
v -0.695473 -0.534823 -0.116468
v -0.394119 -0.288847 1.256168
v -0.522713 -0.380389 1.209383
v 0.312337 0.546575 0.510265
v 0.312337 0.636307 0.474201
v 0.259031 0.770339 -0.533023
v 0.241148 0.824956 -0.404881
v -0.312337 0.546575 0.510265
v -0.312337 0.636307 0.474201
v -0.259031 0.770339 -0.533023
v -0.241148 0.824956 -0.404881
v 0.000000 0.780305 -0.666434
v 0.000000 0.922277 -0.469476
v 0.000000 0.449088 0.876459
v 0.000000 0.609554 0.839639
v 0.540252 0.181344 0.861275
v 0.452746 0.133989 0.945598
v 0.266890 0.297623 0.910355
v 0.293373 0.383981 0.817631
v 0.105717 -0.461192 1.071185
v 0.111418 -0.612248 1.032200
v 0.000000 -0.617230 1.033273
v -0.540252 0.181344 0.861275
v 0.000000 0.378785 0.818750
v -0.000000 -0.469766 1.075636
v -0.452746 0.133989 0.945598
v -0.000000 0.297623 0.910355
v -0.266890 0.297623 0.910355
v -0.293373 0.383981 0.817631
v -0.105717 -0.461192 1.071185
v -0.111418 -0.612248 1.032200
v 0.083857 -0.371805 1.052336
v 0.359126 0.100304 0.952719
v 0.211702 0.230101 0.924763
v 0.000000 0.230101 0.924763
v 0.000000 -0.378606 1.055867
v -0.083857 -0.371805 1.052336
v -0.359126 0.100304 0.952719
v -0.211702 0.230101 0.924763
v 0.083857 -0.382806 1.000632
v 0.359126 0.089303 0.901014
v 0.211702 0.219101 0.873058
v 0.000000 0.219101 0.873058
v 0.000000 -0.389607 1.004162
v -0.083857 -0.382806 1.000632
v -0.359126 0.089303 0.901014
v -0.211702 0.219101 0.873058
v 1.011618 -0.340174 0.520118
v 1.177638 0.647456 -0.215114
v 1.012877 -0.533570 0.260615
v 1.178896 0.454061 -0.474616
v 1.067882 -0.346127 0.524827
v 1.233902 0.641504 -0.210405
v 1.069141 -0.539522 0.265324
v 1.235160 0.448108 -0.469907
v 1.027432 1.034778 -0.705552
v 1.027873 0.967009 -0.796486
v 1.047589 0.964923 -0.794836
v 1.047148 1.032692 -0.703901
v 0.980253 -0.633406 0.954731
v 0.979558 -0.526490 1.098193
v 1.011358 -0.636697 0.957334
v 1.010662 -0.529781 1.100796
v 1.113271 0.063666 -0.183991
v 1.103751 0.207912 0.112100
v 1.074939 -0.164366 -0.014234
v 1.073681 0.029029 0.245268
v -1.011618 -0.340174 0.520118
v -1.177638 0.647456 -0.215114
v -1.012877 -0.533570 0.260615
v -1.178896 0.454061 -0.474616
v -1.067882 -0.346127 0.524827
v -1.233902 0.641504 -0.210405
v -1.069141 -0.539522 0.265324
v -1.235160 0.448108 -0.469907
v -1.027432 1.034778 -0.705551
v -1.027873 0.967009 -0.796486
v -1.047589 0.964923 -0.794836
v -1.047148 1.032692 -0.703901
v -0.980253 -0.633406 0.954731
v -0.979558 -0.526490 1.098193
v -1.011358 -0.636697 0.957334
v -1.010662 -0.529781 1.100796
v -1.113271 0.063666 -0.183991
v -1.103751 0.207912 0.112100
v -1.074939 -0.164366 -0.014234
v -1.073681 0.029029 0.245268
v 0.637435 0.168684 0.834274
v 0.177086 0.418549 0.811186
v 0.699692 -0.144904 -0.564717
v 0.239656 -0.545237 0.928837
v 0.310935 0.415279 0.770105
v -0.323955 0.479103 0.000000
v -0.637435 0.168684 0.834274
v -0.177086 0.418549 0.811186
v -0.699692 -0.144904 -0.564717
v 0.000000 -0.613521 -0.608153
v 0.000000 0.802036 -0.778824
v 0.000000 -0.598122 1.026962
v 0.000000 0.412688 0.804236
v 0.000000 0.320719 0.805695
v -0.239656 -0.545237 0.928837
v 0.000000 -0.591064 1.021812
v -0.310935 0.415279 0.770105
v 0.323955 0.479103 0.000000
v 0.672720 0.253513 0.076026
v 0.685411 0.108932 -0.219799
v 0.630038 -0.117298 -0.051469
v 0.679328 -0.042328 -0.107102
v 0.668815 0.010622 0.129121
v 0.665429 0.072220 0.211100
v -0.665429 0.072220 0.211100
v -0.668815 0.010622 0.129121
v -0.679328 -0.042328 -0.107102
v -0.630038 -0.117298 -0.051469
v -0.672720 0.253513 0.076026
v -0.685411 0.108932 -0.219799
v 0.687166 0.427123 -0.399998
v 0.695374 0.421469 -0.395830
v 0.694643 0.403247 -0.382282
v 0.660108 0.584136 -0.371719
v 0.673797 0.566781 -0.304796
v 0.675480 0.565171 -0.295883
v -0.673797 0.566781 -0.304796
v -0.675480 0.565171 -0.295883
v -0.687166 0.427123 -0.399998
v -0.695374 0.421469 -0.395829
v -0.694643 0.403247 -0.382282
v -0.660108 0.584136 -0.371719
usemtl Material.001
s off
f 3/1/1 2/2/1 1/3/1
f 7/4/2 4/5/2 3/1/2
f 160/6/3 6/7/3 8/8/3
f 1/9/4 6/7/4 5/10/4
f 1/11/5 157/12/5 156/13/5
f 8/8/6 2/14/6 4/15/6
f 10/16/7 11/17/7 9/18/7
f 11/17/8 16/19/8 15/20/8
f 16/19/9 14/21/9 162/22/9
f 14/21/10 9/23/10 13/24/10
f 165/25/11 13/24/11 9/26/11
f 16/19/12 10/27/12 14/21/12
f 26/28/13 19/29/13 25/30/13
f 20/31/14 17/32/14 19/29/14
f 25/33/15 17/32/15 27/34/15
f 17/32/16 28/35/16 27/36/16
f 23/37/17 26/28/17 25/30/17
f 21/38/18 24/39/18 23/37/18
f 25/33/19 21/38/19 23/37/19
f 21/38/20 28/35/20 22/40/20
f 31/41/21 38/42/21 37/43/21
f 29/44/22 32/45/22 31/41/22
f 37/46/23 29/44/23 31/41/23
f 29/44/24 40/47/24 30/48/24
f 38/42/25 35/49/25 37/43/25
f 36/50/26 33/51/26 35/49/26
f 37/46/27 33/51/27 39/52/27
f 33/51/28 40/47/28 39/53/28
f 50/54/29 43/55/29 49/56/29
f 44/57/30 41/58/30 43/55/30
f 49/59/31 41/58/31 51/60/31
f 41/58/32 52/61/32 51/62/32
f 47/63/33 50/54/33 49/56/33
f 45/64/34 48/65/34 47/63/34
f 49/59/35 45/64/35 47/63/35
f 45/64/36 52/61/36 46/66/36
f 61/67/37 53/68/37 58/69/37
f 60/70/37 66/71/37 61/67/37
f 76/72/38 83/73/38 84/74/38
f 71/75/39 78/76/39 70/77/39
f 72/78/40 79/79/40 71/75/40
f 76/72/40 80/80/40 72/78/40
f 85/81/41 103/82/41 87/83/41
f 92/84/42 91/85/42 101/86/42
f 90/87/43 86/88/43 102/89/43
f 85/81/44 97/90/44 98/91/44
f 86/88/45 96/92/45 93/93/45
f 95/94/46 93/95/46 96/92/46
f 88/96/47 95/94/47 92/84/47
f 88/96/48 93/97/48 94/98/48
f 97/99/49 100/100/49 98/101/49
f 89/102/50 98/103/50 100/100/50
f 91/85/51 97/90/51 87/83/51
f 101/86/41 86/104/41 88/96/41
f 104/105/49 148/106/49 147/107/49
f 103/82/42 145/108/42 146/109/42
f 102/89/43 148/110/43 104/111/43
f 102/112/52 144/113/52 143/114/52
f 105/115/53 123/116/53 124/117/53
f 111/118/54 121/119/54 123/116/54
f 122/120/55 106/121/55 110/122/55
f 105/115/56 117/123/56 107/124/56
f 106/121/57 116/125/57 110/122/57
f 115/126/58 113/127/58 114/128/58
f 115/126/59 108/129/59 112/130/59
f 108/129/60 113/131/60 106/132/60
f 118/133/61 119/134/61 117/135/61
f 109/136/62 118/137/62 105/138/62
f 117/123/63 111/118/63 107/124/63
f 121/119/53 106/132/53 122/139/53
f 150/140/61 149/141/61 124/117/61
f 151/142/54 152/143/54 123/116/54
f 149/144/55 122/120/55 124/145/55
f 122/139/64 154/146/64 121/119/64
f 135/147/65 155/148/65 127/149/65
f 147/150/66 125/151/66 128/152/66
f 138/153/67 128/154/67 125/151/67
f 126/155/68 138/153/68 129/156/68
f 133/157/69 163/158/69 135/147/69
f 139/159/70 150/160/70 152/161/70
f 139/162/71 138/153/71 131/163/71
f 132/164/72 141/165/72 138/153/72
f 139/162/73 136/166/73 140/167/73
f 137/168/74 159/169/74 135/170/74
f 161/171/75 137/168/75 135/170/75
f 3/1/1 4/5/1 2/2/1
f 7/4/2 8/8/2 4/5/2
f 8/8/3 7/4/3 158/172/3
f 7/4/3 155/173/3 158/172/3
f 158/172/3 159/174/3 8/8/3
f 159/174/3 160/6/3 8/8/3
f 157/12/3 5/10/3 6/7/3
f 160/6/3 157/12/3 6/7/3
f 1/9/4 2/175/4 6/7/4
f 7/4/76 3/176/76 155/173/76
f 3/176/76 1/11/76 156/13/76
f 1/11/5 5/10/5 157/12/5
f 156/13/5 155/173/5 3/176/5
f 8/8/77 6/7/77 2/14/77
f 10/16/7 12/177/7 11/17/7
f 11/17/8 12/177/8 16/19/8
f 163/178/9 15/20/9 166/179/9
f 15/20/9 16/19/9 166/179/9
f 14/21/9 13/24/9 165/25/9
f 162/22/9 161/180/9 16/19/9
f 161/180/9 166/179/9 16/19/9
f 14/21/9 165/25/9 162/22/9
f 14/21/10 10/181/10 9/23/10
f 9/26/78 11/182/78 164/183/78
f 11/182/78 15/20/78 163/178/78
f 164/183/11 11/182/11 163/178/11
f 164/183/11 165/25/11 9/26/11
f 16/19/12 12/184/12 10/27/12
f 26/28/79 20/31/79 19/29/79
f 20/31/80 18/185/80 17/32/80
f 25/33/81 19/29/81 17/32/81
f 17/32/82 18/185/82 28/35/82
f 23/37/83 24/39/83 26/28/83
f 21/38/84 22/40/84 24/39/84
f 25/33/85 27/34/85 21/38/85
f 21/38/86 27/36/86 28/35/86
f 31/41/87 32/45/87 38/42/87
f 29/44/88 30/48/88 32/45/88
f 37/46/89 39/52/89 29/44/89
f 29/44/90 39/53/90 40/47/90
f 38/42/91 36/50/91 35/49/91
f 36/50/92 34/186/92 33/51/92
f 37/46/93 35/49/93 33/51/93
f 33/51/94 34/186/94 40/47/94
f 50/54/95 44/57/95 43/55/95
f 44/57/96 42/187/96 41/58/96
f 49/59/97 43/55/97 41/58/97
f 41/58/98 42/187/98 52/61/98
f 47/63/99 48/65/99 50/54/99
f 45/64/100 46/66/100 48/65/100
f 49/59/101 51/60/101 45/64/101
f 45/64/102 51/62/102 52/61/102
f 58/69/37 59/188/37 61/67/37
f 61/67/37 56/189/37 53/68/37
f 61/67/37 59/188/37 68/190/37
f 68/190/37 60/70/37 61/67/37
f 76/72/38 75/191/38 83/73/38
f 71/75/39 79/79/39 78/76/39
f 72/78/40 80/80/40 79/79/40
f 76/72/40 84/74/40 80/80/40
f 85/81/41 104/105/41 103/82/41
f 91/85/42 87/83/42 103/82/42
f 103/82/42 101/86/42 91/85/42
f 101/86/42 88/96/42 92/84/42
f 85/192/43 89/102/43 104/111/43
f 89/102/43 90/87/43 102/89/43
f 104/111/43 89/102/43 102/89/43
f 85/81/44 87/83/44 97/90/44
f 86/88/103 90/87/103 96/92/103
f 95/94/46 94/193/46 93/95/46
f 88/96/47 94/98/47 95/94/47
f 88/96/48 86/104/48 93/97/48
f 97/99/49 99/194/49 100/100/49
f 89/102/104 85/192/104 98/103/104
f 91/85/51 99/194/51 97/90/51
f 101/86/41 102/112/41 86/104/41
f 145/108/49 103/82/49 147/107/49
f 103/82/49 104/105/49 147/107/49
f 144/113/42 101/86/42 146/109/42
f 101/86/42 103/82/42 146/109/42
f 102/89/43 143/195/43 148/110/43
f 102/112/52 101/86/52 144/113/52
f 105/115/53 107/124/53 123/116/53
f 123/116/54 107/124/54 111/118/54
f 111/118/54 112/130/54 121/119/54
f 112/130/54 108/129/54 121/119/54
f 110/122/55 109/136/55 122/120/55
f 109/136/55 105/138/55 124/145/55
f 109/136/55 124/145/55 122/120/55
f 105/115/56 118/196/56 117/123/56
f 106/121/57 113/197/57 116/125/57
f 115/126/58 116/125/58 113/127/58
f 115/126/59 114/198/59 108/129/59
f 108/129/60 114/198/60 113/131/60
f 118/133/61 120/199/61 119/134/61
f 109/136/62 120/199/62 118/137/62
f 117/123/63 119/134/63 111/118/63
f 121/119/53 108/129/53 106/132/53
f 124/117/61 123/116/61 150/140/61
f 123/116/61 152/143/61 150/140/61
f 123/116/54 121/119/54 151/142/54
f 121/119/54 154/146/54 151/142/54
f 149/144/55 153/200/55 122/120/55
f 122/139/64 153/201/64 154/146/64
f 127/149/105 134/202/105 135/147/105
f 135/147/65 158/203/65 155/148/65
f 155/148/65 156/204/65 127/149/65
f 136/205/106 134/206/106 128/152/106
f 134/206/107 127/149/107 145/207/107
f 128/152/108 134/206/108 145/207/108
f 127/149/66 146/208/66 145/207/66
f 145/207/66 147/150/66 128/152/66
f 138/153/109 140/167/109 128/154/109
f 137/209/110 138/153/110 126/155/110
f 138/153/111 125/151/111 129/156/111
f 135/147/112 134/202/112 133/157/112
f 133/157/69 164/210/69 163/158/69
f 163/158/69 166/211/69 135/147/69
f 133/157/113 134/206/113 152/161/113
f 134/206/114 136/205/114 139/159/114
f 139/159/70 131/163/70 150/160/70
f 134/206/115 139/159/115 152/161/115
f 152/161/70 151/212/70 133/157/70
f 139/162/116 140/167/116 138/153/116
f 131/163/117 138/153/117 141/165/117
f 138/153/118 137/209/118 132/164/118
f 126/155/119 159/169/119 137/168/119
f 159/169/120 158/213/120 135/170/120
f 135/170/121 166/214/121 161/171/121
f 161/171/122 132/164/122 137/168/122
usemtl Material.002
f 58/69/123 62/215/123 59/188/123
f 53/68/124 55/216/124 54/217/124
f 55/216/125 61/67/125 64/218/125
f 57/219/126 53/68/126 54/217/126
f 62/215/127 68/190/127 59/188/127
f 60/70/128 65/220/128 66/71/128
f 65/220/129 61/67/129 66/71/129
f 67/221/130 60/70/130 68/190/130
f 69/222/131 78/76/131 77/223/131
f 69/222/132 81/224/132 73/225/132
f 74/226/133 83/73/133 75/191/133
f 74/226/134 81/224/134 82/227/134
f 128/154/135 140/167/135 136/166/135
f 58/69/136 57/219/136 62/215/136
f 53/68/137 56/189/137 55/216/137
f 55/216/138 56/189/138 61/67/138
f 57/219/139 58/69/139 53/68/139
f 62/215/140 67/221/140 68/190/140
f 60/70/141 63/228/141 65/220/141
f 65/220/125 64/218/125 61/67/125
f 67/221/142 63/228/142 60/70/142
f 69/222/131 70/77/131 78/76/131
f 69/222/132 77/223/132 81/224/132
f 74/226/133 82/227/133 83/73/133
f 74/226/134 73/225/134 81/224/134
usemtl Material.003
f 78/76/143 79/79/143 80/80/143
f 80/80/144 83/73/144 82/227/144
f 80/80/145 81/224/145 77/223/145
f 77/223/146 78/76/146 80/80/146
f 82/227/147 81/224/147 80/80/147
f 80/80/143 84/74/143 83/73/143
usemtl Material.004
f 26/229/148 18/185/148 20/31/148
f 22/40/149 26/229/149 24/39/149
f 30/48/150 38/230/150 32/45/150
f 38/230/151 34/186/151 36/50/151
f 50/231/152 42/187/152 44/57/152
f 46/66/153 50/231/153 48/65/153
f 64/218/154 71/75/154 55/216/154
f 67/221/155 75/191/155 63/228/155
f 65/220/156 75/191/156 76/72/156
f 55/216/157 70/77/157 54/217/157
f 64/218/154 76/72/154 72/78/154
f 57/219/158 70/77/158 69/222/158
f 62/215/159 74/226/159 67/221/159
f 62/215/160 69/222/160 73/225/160
f 91/85/161 90/87/161 89/102/161
f 92/84/162 96/92/162 90/87/162
f 89/102/163 99/194/163 91/85/163
f 109/136/164 112/130/164 111/118/164
f 116/125/165 112/130/165 110/122/165
f 119/134/166 109/136/166 111/118/166
f 26/229/167 28/232/167 18/185/167
f 22/40/168 28/232/168 26/229/168
f 30/48/169 40/233/169 38/230/169
f 38/230/170 40/233/170 34/186/170
f 50/231/171 52/234/171 42/187/171
f 46/66/172 52/234/172 50/231/172
f 64/218/154 72/78/154 71/75/154
f 67/221/155 74/226/155 75/191/155
f 65/220/156 63/228/156 75/191/156
f 55/216/157 71/75/157 70/77/157
f 64/218/154 65/220/154 76/72/154
f 57/219/158 54/217/158 70/77/158
f 62/215/159 73/225/159 74/226/159
f 62/215/160 57/219/160 69/222/160
f 91/85/161 92/84/161 90/87/161
f 92/84/162 95/94/162 96/92/162
f 89/102/163 100/100/163 99/194/163
f 109/136/164 110/122/164 112/130/164
f 116/125/165 115/126/165 112/130/165
f 119/134/166 120/199/166 109/136/166
usemtl Material.005
f 157/235/173 143/236/173 144/237/173
f 160/238/174 126/155/174 129/156/174
f 141/165/175 153/239/175 149/240/175
f 132/164/176 162/241/176 141/165/176
f 127/149/173 156/204/173 157/235/173
f 157/235/177 160/238/177 143/236/177
f 160/238/178 129/156/178 143/236/178
f 125/151/173 147/150/173 148/242/173
f 125/151/179 148/242/179 129/156/179
f 148/242/180 143/236/180 129/156/180
f 144/237/173 146/208/173 127/149/173
f 144/237/173 127/149/173 157/235/173
f 160/238/174 159/169/174 126/155/174
f 133/157/181 151/212/181 154/243/181
f 164/210/181 133/157/181 165/244/181
f 133/157/181 154/243/181 165/244/181
f 141/165/182 162/241/182 153/239/182
f 162/241/183 165/244/183 153/239/183
f 165/244/181 154/243/181 153/239/181
f 131/163/184 141/165/184 149/240/184
f 149/240/181 150/160/181 131/163/181
f 132/164/176 161/171/176 162/241/176
`;

var BlueMTL=
`# Blender MTL File: 'drone_b2.blend'
# Material Count: 5
newmtl Material.001
Kd 0.101378 0.106489 0.115581
newmtl Material.002
Kd 0.236989 0.236989 0.236989
newmtl Material.003
Kd 0.000000 0.758092 0.800000
newmtl Material.004
Kd 0.383170 0.383170 0.383170
newmtl Material.005
Kd 0.045184 0.045184 0.045184`;

var BlueMTL_HIT=

`newmtl Material.001
Kd 0.653926 0.044519 0.037076
newmtl Material.002
Kd 0.512161 0.210410 0.200121
newmtl Material.003
Kd 0.000000 0.758092 0.800000
newmtl Material.004
Kd 1.000000 0.263827 0.258519
newmtl Material.005
Kd 0.616586 0.017866 0.016982`;

