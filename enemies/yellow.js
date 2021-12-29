const correct_amount_yellow = 0.2;
var rand_direction=[0,0];
var tmp_vector2=[0,0,0];
/*
yellow enemy
has yellow visor
moves very fast
moves elliptic
shoots yellow lasers 
mas medium health
*/

class YELLOW {
    vertices = [];
    faces = [];
    material = [];
    materialindex = [];
    materialid = [];
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
    fire_move_speed;
    fire_prepare_time;

    laser_speed;
    wander_len;
    move_rand;

    laser_random;
    max_health;

    constructor(cooldown, max_bullet, move_time, move_speed, rotate_speed, bullet_type, scale, damage,max_health) {
        parseOBJ(yellowOBJ, this, scale);
        parseMTL(yellowMTL, this);
        this.cooldown = cooldown;
        this.max_bullet = max_bullet;
        this.bullet_count = 0;
        this.move_time = move_time;
        this.move_speed = move_speed;
        this.rotate_speed = rotate_speed;
        this.bullet_type = bullet_type;
        this.min_dist = 100;
        this.arraybuffer=new Float32Array(createBufferArray(this));
        this.material = [];
        parseMTL(yellowMTL_HIT, this);
        this.arraybufferhit =new Float32Array(createBufferArray(this));
        this.damage = damage;
        this.fire_move_speed = this.move_speed / 10;
        this.wander_len = 150;
        this.fire_prepare_time = 100;
        this.move_rand = 1.2;
        this.laser_speed = 0.9;
        this.laser_random=5;
        this.max_health=max_health;
    };




    AI_YELLOW(enemy, player, bullet_array) {
        if (enemy.state == 0) {
            vec3.random(enemy.move_direction, 1); //get random move direction
            enemy.state = 1;
            enemy.wander_time = 0;
        } else if (enemy.state == 1) { //wander in map
            if (enemy.wander_time < this.wander_len) {
                enemy.wander_time += 1;

                var randomX = Math.random() * this.move_rand;
                var randomY = Math.random() * this.move_rand;
                var randomZ = Math.random() * this.move_rand;
                vec3.rotateX(enemy.move_direction, enemy.move_direction, origin_vec, deg2rad(randomX));
                vec3.rotateY(enemy.move_direction, enemy.move_direction, origin_vec, deg2rad(randomY));
                vec3.rotateZ(enemy.move_direction, enemy.move_direction, origin_vec, deg2rad(randomZ));
                vec3.normalize(enemy.move_direction, enemy.move_direction);
                //if enemy going out of map correct positions

                //y axis
                if (enemy.translation[1] < 25) {
                    vec3.add(enemy.move_direction, enemy.move_direction, [0, correct_amount, 0]);
                    vec3.normalize(enemy.move_direction, enemy.move_direction);
                } else if (enemy.translation[1] > 60) {
                    vec3.add(enemy.move_direction, enemy.move_direction, [0, -correct_amount, 0]);
                    vec3.normalize(enemy.move_direction, enemy.move_direction);
                }

                //x axis
                if (enemy.translation[0] < -50) {
                    vec3.add(enemy.move_direction, enemy.move_direction, [correct_amount, 0, 0]);
                    vec3.normalize(enemy.move_direction, enemy.move_direction);
                } else if (enemy.translation[0] > 50) {
                    vec3.add(enemy.move_direction, enemy.move_direction, [-correct_amount, 0, 0]);
                    vec3.normalize(enemy.move_direction, enemy.move_direction);
                }

                //z axis
                if (enemy.translation[2] < -50) {
                    vec3.add(enemy.move_direction, enemy.move_direction, [0, 0, correct_amount]);
                    vec3.normalize(enemy.move_direction, enemy.move_direction);
                } else if (enemy.translation[2] > 50) {
                    vec3.add(enemy.move_direction, enemy.move_direction, [0, 0, -correct_amount]);
                    vec3.normalize(enemy.move_direction, enemy.move_direction);
                }


                vec3.scale(tmp_vector, enemy.move_direction, this.move_speed);
                vec3.add(enemy.translation, enemy.translation, tmp_vector);
            } else {//set attaxk start and attack end points
                enemy.state = 2;
                enemy.prepare_state_counter = 0;
            
                tmp_vector[0]=player.coordinate[0];
                tmp_vector[1]=0;
                tmp_vector[2]=player.coordinate[2];
                vec3.sub(enemy.laser_direction, tmp_vector, [enemy.translation[0], 0, enemy.translation[2]]);
                vec3.normalize(enemy.laser_direction, enemy.laser_direction);
                enemy.attack_start_point = [enemy.translation[0], 0, enemy.translation[2]];
                vec3.add(enemy.attack_start_point, enemy.attack_start_point, enemy.laser_direction);
                enemy.frame = 0;
                vec3.sub(enemy.prepare_state_lookingto, enemy.attack_start_point, enemy.translation);
                vec3.normalize(enemy.prepare_state_lookingto, enemy.prepare_state_lookingto);
                vec3.copy(enemy.laser_end_point, enemy.attack_start_point);

            }
        } else if (enemy.state == 2) {//prepare to fire
            if (enemy.prepare_state_counter < this.fire_prepare_time) {
                enemy.prepare_state_counter += 1;
                if (enemy.frame < this.fire_prepare_time) {
                    vec3.lerp(enemy.move_direction, enemy.move_direction, enemy.prepare_state_lookingto, (enemy.frame / this.fire_prepare_time));
                    enemy.frame += 1;
                }
            } else {
                for (let i = 0; i < enemy.laser_count; i++) {
                    
                    vec2.random(rand_direction, this.laser_random);
                    enemy.laser_array_endpoints[i][0]=rand_direction[0];
                    enemy.laser_array_endpoints[i][1]=0;
                    enemy.laser_array_endpoints[i][2]=rand_direction[1];
                  
                }
                enemy.frame = 0;
                enemy.attack_dist = 0;
                enemy.state = 4;//attack


                enemy.prepare_state_counter = 0;
                tmp_vector[0]=player.coordinate[0];
                tmp_vector[1]=0;
                tmp_vector[2]=player.coordinate[2];
                vec3.sub(enemy.laser_direction, tmp_vector, [enemy.translation[0], 0, enemy.translation[2]]);
                vec3.normalize(enemy.laser_direction, enemy.laser_direction);
                enemy.attack_start_point[0] =enemy.translation[0];
                enemy.attack_start_point[1] =0;
                enemy.attack_start_point[2] =enemy.translation[2];
    
                vec3.add(enemy.attack_start_point, enemy.attack_start_point, enemy.laser_direction);

                enemy.central_laser.edit_array_buffer(enemy.translation, enemy.laser_end_point);
                for (let i = 0; i < enemy.laser_count; i++) {
                   
                    vec3.add(tmp_vector2, enemy.laser_array_endpoints[i], enemy.laser_end_point);
                    enemy.laser_array[i].edit_array_buffer(enemy.translation, tmp_vector2);
                }
            }

        } else if (enemy.state == 3) {//death
            //die fall to the ground
            vec3.scale(enemy.velocity, enemy.move_direction, enemy.move_speed);
            enemy.move_speed += 0.015;
            vec3.add(enemy.translation, enemy.translation, enemy.velocity);
            vec3.lerp(enemy.move_direction, enemy.move_direction, direction_down, 0.020 * enemy.frame);
            vec3.lerp(enemy.lookingto, enemy.lookingto, direction_down, 0.1 * enemy.frame);
            enemy.frame += 1;
            if (enemy.translation[1] < 0) {
                enemy.state = 5;
            }

        } else if (enemy.state == 4) {//fire
            if (enemy.frame < 400) {
                enemy.frame += 1;
                enemy.central_laser.edit_array_buffer(enemy.translation, enemy.laser_end_point);
                for (let i = 0; i < enemy.laser_count; i++) {
                    
                    vec3.add(tmp_vector, enemy.laser_array_endpoints[i], enemy.laser_end_point);
                    vec3.copy(enemy.laser_array[i].end_point,tmp_vector);
                    enemy.laser_array[i].edit_array_buffer(enemy.translation, tmp_vector);
                }
                
                vec3.scale(tmp_vector, enemy.laser_direction, this.laser_speed);
                vec3.add(enemy.laser_end_point, enemy.laser_end_point, tmp_vector);
               
                vec3.sub(tmp_vector2, enemy.laser_end_point, enemy.translation);
                var angle = vec3.angle(direction_down,tmp_vector2 );
                if (angle > deg2rad(75)) {
                    enemy.frame = 400;
                }
                vec3.scale(tmp_vector,enemy.laser_direction,this.fire_move_speed);
                vec3.add(enemy.translation,enemy.translation,tmp_vector);

            } else {
                enemy.state = 0;
            }
        } else if (enemy.state == 5) { //falled to the ground waiting to deletion
            enemy.death_count -= 1;
        } else if (enemy.state == 6) { //player has fired guided missile to the enemy  enemy must avoid for a time 
            var randomX = Math.random() * 2;
            var randomY = Math.random() * 2;
            var randomZ = Math.random() * 2;
            vec3.rotateX(enemy.lookingto, enemy.lookingto, origin_vec, deg2rad(randomX));
            vec3.rotateY(enemy.lookingto, enemy.lookingto, origin_vec, deg2rad(randomY));
            vec3.rotateZ(enemy.lookingto, enemy.lookingto, origin_vec , deg2rad(randomZ));
            //if enemy going out of map correct positions

            //y axis
            if (enemy.translation[1] < 25) {
                vec3.add(enemy.lookingto, enemy.lookingto, [0, correct_amount, 0]);
                vec3.normalize(enemy.lookingto, enemy.lookingto);
            } else if (enemy.translation[1] > 60) {
                vec3.add(enemy.lookingto, enemy.lookingto, [0, -correct_amount, 0]);
                vec3.normalize(enemy.lookingto, enemy.lookingto);
            }

            //x axis
            if (enemy.translation[0] < -50) {
                vec3.add(enemy.lookingto, enemy.lookingto, [correct_amount, 0, 0]);
                vec3.normalize(enemy.lookingto, enemy.lookingto);
            } else if (enemy.translation[0] > 50) {
                vec3.add(enemy.lookingto, enemy.lookingto, [-correct_amount, 0, 0]);
                vec3.normalize(enemy.lookingto, enemy.lookingto);
            }

            //z axis
            if (enemy.translation[2] < -50) {
                vec3.add(enemy.lookingto, enemy.lookingto, [0, 0, correct_amount]);
                vec3.normalize(enemy.lookingto, enemy.lookingto);
            } else if (enemy.translation[2] > 50) {
                vec3.add(enemy.lookingto, enemy.lookingto, [0, 0, -correct_amount]);
                vec3.normalize(enemy.lookingto, enemy.lookingto);
            }


            
            vec3.scale(tmp_vector, enemy.lookingto, this.move_speed * 1.5);
            vec3.add(enemy.translation, enemy.translation, tmp_vector);
            enemy.hit += 1;
            enemy.emergency_counter -= 1;
            if (enemy.emergency_counter < 0) {
                enemy.hit = 0;
                enemy.state = 4;
                enemy.distance_traveled = 200;
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

    emergency(enemy, player, rocket_instance) {
        
        vec3.sub(tmp_vector, enemy.translation, rocket_instance.translation);
        vec3.normalize(tmp_vector, tmp_vector);
        vec3.copy(enemy.lookingto,tmp_vector);
        enemy.prev_state = enemy.state;
        enemy.emergency_counter = rocket_instance.life; // stay in emergency while rocket is chasing enemy
        enemy.state=6;
        enemy.hit = 2;
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


class YELLOW_INSTANCE extends ENEMY {
    laser_array = [];
    central_laser;
    laser_count;
    laser_color;
    laser_end_point;

    attack_start_point;
    attack_end_point;
    laser_direction;

    wander_time;
    direction;

    prepare_state_counter;
    prepare_state_lookingto;
    laser_array_endpoints = [];
    attack_dist;
    attack_len;
    constructor(health, max_health, translation, rotation, type, id) {
        super(health, max_health, translation, rotation, type, id);
        this.laser_count = 9;
        this.laser_color = [1, 1, 0];
        //generate laser array
        this.central_laser = new LASER([0, 0, 0], [0, 0, 0], [1, 1, 0.5]); //main_laser
        this.central_laser.create_array_buffer_laser([0, 0, 0], [0, 0, 0]);
        this.central_laser.createBufferData(webgl);
        for (var i = 0; i < this.laser_count; i++) { //lasers that surrounding main laser in range
            var laser = new LASER([0, 0, 0], [0, 0, 0], this.laser_color);
            laser.create_array_buffer_laser([0, 0, 0], [0, 0, 0]);
            laser.createBufferData(webgl);
            this.laser_array.push(laser);
        }
        this.laser_end_point = [0, 0, 0];
        this.wander_time = 0;
        this.direction = [0, 0, -1];
        this.laser_direction = [0, 0, 0];
        this.attack_start_point = [0, 0, 0];
        this.attack_end_point = [0, 0, 0];

        this.prepare_state_counter = 0;
        this.prepare_state_lookingto = [0, 0, 0];
        for (let i = 0; i < this.laser_count; i++) {
            this.laser_array_endpoints.push([0, 0, 0]);
        }
        this.attack_dist = 0;
        this.attack_len = 0;
    }
}




function draw_enemy_yellow(gl, enemy, type, program, identitymatrix, program, w, v, p, world, view, projection,pos,color) {
   
    if(enemy.hit>0){
        gl.bindBuffer(gl.ARRAY_BUFFER,type.bufferhit);
    }else{
        gl.bindBuffer(gl.ARRAY_BUFFER,type.buffer);
    }
   


    mat4.translate(w, identitymatrix, enemy.translation);
    
    if (enemy.state == 1) {
      
        vec3.add(tmp_vector, enemy.translation, enemy.move_direction);
        mat4.targetTo(w, enemy.translation, tmp_vector, direction_up);
    } else if (enemy.state == 2) {
       

        vec3.add(tmp_vector, enemy.translation, enemy.move_direction);
        mat4.targetTo(w, enemy.translation,tmp_vector,direction_up );
    } else if (enemy.state == 4) {
        mat4.targetTo(w, enemy.translation, enemy.laser_end_point, direction_up);
    }else if(enemy.state==6){
       
        vec3.add(tmp_vector,enemy.translation,enemy.lookingto);
         mat4.targetTo(w,enemy.translation,tmp_vector,direction_up);
    }
    mat4.rotateX(w, w, Math.PI);
    mat4.rotateY(w, w, deg2rad(enemy.rotation[1]));
    mat4.rotateZ(w, w, Math.PI);

    vec3.add(player.camera_coordinates, player.coordinate, player.lookingto);

    mat4.lookAt(v, player.coordinate, player.camera_coordinates, direction_up);//camera 


    gl.vertexAttribPointer(pos, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(color, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(pos);
    gl.enableVertexAttribArray(color);
    gl.uniformMatrix4fv(world, gl.FALSE, w);
    gl.uniformMatrix4fv(view, gl.FALSE, v);
    gl.uniformMatrix4fv(projection, gl.FALSE, p);
    gl.drawArrays(gl.TRIANGLES, 0, type.arraybuffer.length / 6);


    if (enemy.state == 4) {
        draw_laser(gl, enemy.central_laser, identitymatrix, w, v, p, world, view, projection,pos,color);
        for (let i = 0; i < enemy.laser_count; i++) {
            draw_laser(gl, enemy.laser_array[i], identitymatrix, w, v, p, world, view, projection,pos,color);
        }
        enemy_laser_collision(enemy,player,enemy.central_laser,enemy.laser_array);
    }
}


//check all laser collisions damage player
function enemy_laser_collision(enemy,player,central_laser,laser_array){
    var total_damage=0;
    if(laser_colliding(central_laser,enemy,player,5)==true) {
        total_damage+=yellow_damage;
    }
    const len=laser_array.length;
    for(let i=0;i<len;i++){
        if(laser_colliding(laser_array[i],enemy,player,5)==true){
            total_damage+=yellow_damage;
        }
    } 
    player.damage_player(total_damage);
    
}

//check if laser colliding with player
function laser_colliding(laser,enemy,player,collision_range){
   
    vec3.sub(tmp_vector,laser.end_point,enemy.translation);
    vec3.normalize(tmp_vector,tmp_vector);
    
    vec3.sub(tmp_vector2,player.coordinate,enemy.translation);
   
    
    vec3.scale(p2,tmp_vector,vec3.dot(tmp_vector2,tmp_vector));
    vec3.add(p2,p2,enemy.translation);
    var dist=vec3.distance(player.coordinate,p2);
  
    if(dist <collision_range){
        return true;
    }
    return false;
     
}
var p2=[0,0,0];








































var yellowOBJ =
    `v 0.177086 0.418549 0.811186
v 0.699692 -0.144904 -0.564717
v 0.694220 0.572876 -0.350681
v -0.177086 0.418549 0.811186
v -0.699692 -0.144904 -0.564717
v -0.694220 0.572876 -0.350681
v 0.000000 -0.613521 -0.608153
v 0.000000 0.802036 -0.778824
v 0.000000 -0.598122 1.026962
v 0.000000 0.412688 0.804236
v 0.000000 0.320719 0.805695
v 0.469393 0.530580 0.176267
v -0.469393 0.585985 0.193069
v 0.000000 0.595923 0.469122
v 0.000000 0.355306 1.262577
v 0.000000 0.410711 1.279379
v -0.469393 0.530580 0.176267
v 0.469393 0.585985 0.193069
v 0.469393 0.621733 0.069922
v -0.469393 0.677138 0.086724
v 0.469393 0.489380 0.506367
v 0.469393 0.544785 0.523169
v 0.000000 0.687075 0.362778
v 0.000000 0.501864 1.173034
v -0.469393 0.544785 0.523169
v -0.469393 0.621733 0.069922
v 0.000000 0.649865 0.485481
v -0.469393 0.490842 0.506811
v 0.000000 0.447921 1.156676
v 0.469392 0.697693 -0.028827
v -0.469392 0.753098 -0.012025
v 0.469392 0.620746 0.424420
v 0.000000 0.763036 0.264029
v 0.000000 0.818441 0.280831
v 0.000000 0.577825 1.074285
v -0.469392 0.620746 0.424420
v -0.469392 0.697693 -0.028827
v 0.469392 0.753098 -0.012025
v 0.000000 0.535685 1.061506
v 0.469392 0.677138 0.086724
v 0.469392 0.578606 0.411641
v 0.000000 0.729215 0.375557
v -0.469392 0.578606 0.411641
v 0.330546 -0.608839 -0.076491
v 0.893194 0.375130 0.298141
v 0.140488 -0.705082 0.461734
v 0.202658 -0.741053 0.477255
v 0.630302 -0.245660 0.450968
v 0.284778 -0.420629 1.429457
v 0.346948 -0.456600 1.444978
v 0.831025 0.411101 0.282620
v 0.392716 -0.644810 -0.060969
v 0.444508 -0.616803 -0.212697
v 0.316619 -0.749017 0.341049
v 0.744264 -0.253623 0.314762
v 0.460909 -0.464564 1.308772
v 0.944986 0.403138 0.146414
v 0.506677 -0.652773 -0.197176
v 0.690830 -0.280681 0.466079
v 0.400381 -0.429542 1.293661
v 0.256091 -0.713995 0.325938
v 0.540358 -0.619567 -0.338428
v 1.103006 0.364402 0.036204
v 0.412470 -0.751781 0.215318
v 0.840114 -0.256388 0.189031
v 0.902284 -0.292359 0.204552
v 0.556760 -0.467328 1.183040
v 1.040837 0.400373 0.020683
v 0.602528 -0.655538 -0.322907
v 0.509476 -0.439970 1.171236
v 0.365186 -0.724423 0.203513
v 1.007155 0.367167 0.161935
v 0.791548 -0.280982 0.326567
v -0.330546 -0.608839 -0.076491
v -0.893194 0.375130 0.298141
v -0.140488 -0.705083 0.461734
v -0.202658 -0.741053 0.477255
v -0.630302 -0.245660 0.450968
v -0.284778 -0.420629 1.429457
v -0.346948 -0.456600 1.444978
v -0.831025 0.411101 0.282620
v -0.392716 -0.644810 -0.060969
v -0.444508 -0.616803 -0.212697
v -0.316619 -0.749017 0.341049
v -0.744264 -0.253623 0.314762
v -0.460909 -0.464564 1.308772
v -0.944986 0.403138 0.146414
v -0.690830 -0.280681 0.466079
v -0.400381 -0.429542 1.293660
v -0.256091 -0.713995 0.325938
v -0.540358 -0.619567 -0.338428
v -1.103006 0.364402 0.036204
v -0.412470 -0.751781 0.215318
v -0.840114 -0.256388 0.189031
v -0.902284 -0.292359 0.204552
v -0.556760 -0.467328 1.183041
v -1.040837 0.400373 0.020683
v -0.602528 -0.655538 -0.322907
v -0.509476 -0.439970 1.171236
v -0.506677 -0.652773 -0.197175
v -0.365186 -0.724423 0.203513
v -1.007155 0.367167 0.161935
v -0.791548 -0.280982 0.326567
v 0.612298 0.069001 0.735302
v -0.568560 0.047216 0.859427
v -0.560762 0.011623 0.858705
v -0.588747 0.069288 0.810799
v 0.236461 -0.546148 0.908346
v 0.231683 -0.546997 0.932101
v -0.612298 0.069001 0.735302
v 0.560762 0.011623 0.858705
v 0.588747 0.069288 0.810799
v -0.236461 -0.546148 0.908346
v -0.231683 -0.546997 0.932101
v 0.568560 0.047216 0.859427
v 0.583256 0.095971 0.847584
v 0.315742 0.410062 0.905649
v 0.602431 0.615375 0.563865
v 0.548406 0.511894 0.383277
v 0.755935 0.512713 0.576770
v 0.701911 0.409233 0.396182
v 0.501973 0.120288 0.920487
v 0.491717 1.412724 -1.122706
v 0.481297 1.392766 -1.157537
v 0.510904 1.372965 -1.155048
v 0.521324 1.392924 -1.120217
v -0.315742 0.410062 0.905649
v -0.602430 0.615375 0.563865
v -0.548406 0.511894 0.383277
v -0.755935 0.512713 0.576770
v -0.701911 0.409233 0.396182
v -0.501973 0.120288 0.920487
v -0.491717 1.412724 -1.122706
v -0.481297 1.392766 -1.157537
v -0.510904 1.372965 -1.155048
v -0.521324 1.392924 -1.120217
v 0.469393 0.476005 0.555737
v 0.584707 0.102226 0.742233
v 0.586220 0.102705 0.768918
v -0.396406 0.446959 0.730562
v 0.396407 0.446959 0.730562
v 0.618574 0.210104 0.470858
v 0.502682 0.390232 0.428225
v -0.307601 0.383433 0.836710
v 0.469393 0.447822 0.449168
v 0.307601 0.383433 0.836709
v 0.433027 0.112414 0.846618
v 0.481239 0.080572 0.851178
v -0.489442 0.085276 0.851949
v -0.469393 0.476005 0.555737
v -0.433028 0.112414 0.846618
v -0.283098 0.347535 0.796530
v -0.296920 0.362160 0.797927
v -0.447494 0.419148 0.426147
v -0.469393 0.447822 0.449168
v 0.273914 0.212991 0.825884
v 0.543607 0.111249 0.844736
v 0.283098 0.347535 0.796530
v 0.296920 0.362160 0.797927
v 0.447494 0.419148 0.426147
v -0.543607 0.111249 0.844736
v -0.273914 0.212991 0.825884
v -0.618574 0.210104 0.470858
v 0.277691 0.311274 0.791755
v -0.502682 0.390232 0.428225
v -0.584707 0.102226 0.742233
v -0.586220 0.102705 0.768918
v -0.600572 0.130196 0.816894
v -0.277691 0.311274 0.791755
v 0.575485 0.440651 0.985542
v 0.883932 0.326641 0.762824
v 0.821136 0.330129 0.600685
v 0.546009 0.130549 0.990289
v 0.869766 0.177612 0.765105
v 0.462952 0.394837 0.958570
v 0.444042 0.195900 0.961615
v 1.670031 0.762718 -0.452223
v 1.657919 0.763390 -0.483495
v 1.655187 0.734647 -0.483055
v 1.667299 0.733974 -0.451783
v -0.575485 0.440652 0.985542
v -0.883932 0.326641 0.762824
v -0.821136 0.330129 0.600685
v -0.546009 0.130549 0.990289
v -0.869767 0.177612 0.765105
v -0.462952 0.394838 0.958570
v -0.444043 0.195900 0.961615
v -1.670031 0.762718 -0.452223
v -1.657920 0.763390 -0.483495
v -1.655188 0.734647 -0.483056
v -1.667299 0.733974 -0.451783
v 0.782844 0.321031 0.605583
v 0.425678 0.196920 0.914199
v 0.808641 0.177771 0.660058
v 0.424675 0.396963 0.859742
v 0.584920 0.136205 0.963225
v -0.882716 0.304152 0.514336
v -0.584920 0.136205 0.963225
v 0.495066 0.445117 0.777903
v -0.519594 0.132016 0.922084
v 0.882716 0.304152 0.514335
v -0.808641 0.177771 0.660058
v -0.425678 0.196920 0.914199
v 0.713920 0.351801 0.614249
v -0.884799 0.210034 0.622526
v 0.523078 0.132355 0.922391
v -0.439567 0.327249 0.916058
v -0.978122 0.292793 0.383830
v 0.818747 0.305003 0.601069
v 0.884799 0.210034 0.622526
v 0.978122 0.292793 0.383830
v 0.439567 0.327249 0.916058
v 0.695322 0.369505 0.616557
v 0.603813 0.158640 0.628873
v 0.670095 0.165968 0.620420
v -0.704293 0.377482 0.728873
v -0.695322 0.369505 0.616557
v -0.495066 0.445117 0.777903
v 0.704293 0.377482 0.728873
v 0.607915 0.148181 0.806381
v -0.713920 0.351800 0.614249
v -0.670095 0.165968 0.620420
v -0.603813 0.158640 0.628873
v -0.607915 0.148181 0.806382
v -0.784713 0.320197 0.605349
v -0.818748 0.305003 0.601069
v -0.424676 0.396963 0.859742
v 0.801733 0.213204 1.061086
v 0.908357 0.024101 0.871916
v 0.862149 0.063245 0.761326
v 0.646719 0.049066 1.067757
v 0.833860 -0.054781 0.875122
v 0.715558 0.238529 1.052441
v 0.616114 0.133230 1.056721
v 1.456182 -0.006101 -0.076639
v 1.447270 0.001449 -0.097969
v 1.432901 -0.013765 -0.097351
v 1.441813 -0.021315 -0.076021
v -0.801733 0.213204 1.061086
v -0.908357 0.024101 0.871917
v -0.862149 0.063245 0.761326
v -0.646719 0.049066 1.067757
v -0.833860 -0.054781 0.875123
v -0.715558 0.238529 1.052441
v -0.616113 0.133230 1.056721
v -1.456182 -0.006101 -0.076639
v -1.447270 0.001449 -0.097969
v -1.432901 -0.013765 -0.097351
v -1.441813 -0.021315 -0.076021
v 0.574301 0.122108 0.831307
v 0.624841 0.233361 0.940165
v -0.581256 0.156733 0.966859
v 0.562701 0.138636 0.886326
v 0.798620 0.032084 0.769779
v 0.777065 -0.012424 0.806609
v 0.681519 0.150976 0.813285
v 0.641488 0.068315 0.881686
v 0.558365 0.123913 0.856297
v 0.723287 0.279658 0.873340
v -0.641488 0.068315 0.881686
v 0.659575 0.285954 0.918455
v -0.574301 0.122108 0.831307
v 0.791369 0.167860 0.792810
v 0.795900 0.166874 0.816482
v -0.699995 0.029122 0.900250
v -0.760356 0.153760 0.797112
v 0.731359 0.018194 0.792108
v 0.611777 0.078667 0.984128
v -0.723287 0.279658 0.873340
v -0.791369 0.167860 0.792810
v -0.795900 0.166874 0.816482
v -0.588319 0.106158 0.838739
v 0.579305 0.164412 0.968626
v -0.558365 0.123913 0.856297
v -0.562701 0.138636 0.886326
v 0.788606 -0.016445 0.766815
v -0.731359 0.018194 0.792108
v 0.760356 0.153760 0.797112
v 0.571632 0.137803 0.914892
v 0.573041 0.111482 0.891420
v -0.682347 0.155373 0.813806
v 0.597763 0.133341 0.828142
v 0.592377 0.104744 0.824748
v -0.611777 0.078667 0.984128
v -0.798620 0.032084 0.769779
v -0.777065 -0.012424 0.806609
v -0.571632 0.137803 0.914893
v -0.573041 0.111482 0.891420
v -0.790126 -0.013018 0.764426
v -0.624841 0.233361 0.940165
v 0.699995 0.029122 0.900250
v -0.659575 0.285954 0.918456
v 0.452746 0.133989 0.945598
v 0.266890 0.297623 0.910355
v 0.293373 0.383981 0.817631
v 0.105717 -0.461192 1.071185
v 0.111418 -0.612248 1.032200
v 0.000000 -0.617230 1.033273
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
v 0.490775 0.098838 0.883053
v -0.293704 0.367849 0.831982
v 0.281523 0.227567 0.851320
v 0.459946 0.115488 0.875459
v 0.387367 0.161080 0.865640
v 0.451918 0.170564 0.916362
v 0.401830 0.208121 0.912171
v 0.290808 0.362301 0.822300
v 0.285746 0.288843 0.838122
v 0.287729 0.317621 0.831924
v -0.302884 0.282313 0.903892
v -0.320721 0.268938 0.905385
v 0.302883 0.282313 0.903892
v 0.320721 0.268938 0.905385
v -0.480596 0.149061 0.918761
v -0.451918 0.170564 0.916362
v -0.401831 0.208121 0.912171
v 0.480596 0.149061 0.918761
v -0.387367 0.161080 0.865640
v -0.482894 0.118109 0.900045
v -0.459947 0.115488 0.875459
v 0.482894 0.118109 0.900045
v -0.287729 0.317621 0.831924
v -0.281622 0.229011 0.851009
v -0.285746 0.288843 0.838122
v -0.496317 0.100038 0.878787
usemtl Material.002
s off
f 8/1/1 2/2/1 7/3/1
f 142/4/2 138/5/2 104/6/2
f 109/7/3 108/8/3 111/9/3
f 3/10/4 10/11/4 1/12/4
f 157/13/5 148/14/5 115/15/5
f 1/12/6 11/16/6 164/17/6
f 1/12/7 159/18/7 160/19/7
f 5/20/8 8/1/8 7/3/8
f 110/21/9 167/22/9 166/23/9
f 106/24/10 110/21/10 113/25/10
f 6/26/11 10/11/11 8/27/11
f 161/28/12 105/29/12 149/30/12
f 4/31/13 152/32/13 169/33/13
f 154/34/14 4/31/14 6/26/14
f 20/35/15 26/36/15 13/37/15
f 23/38/16 42/39/16 40/40/16
f 18/41/17 19/42/17 40/43/17
f 29/44/18 25/45/18 28/46/18
f 23/47/19 18/48/19 27/49/19
f 25/50/20 39/51/20 43/52/20
f 13/53/21 23/47/21 27/49/21
f 22/54/22 29/44/22 21/55/22
f 72/56/23 57/57/23 45/58/23
f 58/59/24 54/60/24 52/61/24
f 257/62/25 60/63/25 291/64/25
f 55/65/26 52/66/26 59/67/26
f 291/68/27 70/69/27 267/70/27
f 54/60/28 58/59/28 71/71/28
f 45/72/29 55/65/29 59/67/29
f 54/60/30 60/63/30 61/73/30
f 102/74/31 197/75/31 75/76/31
f 85/77/32 100/78/32 103/79/32
f 82/80/33 84/81/33 100/82/33
f 265/83/34 86/84/34 89/85/34
f 82/86/35 85/87/35 88/88/35
f 265/89/36 277/90/36 99/91/36
f 101/92/37 84/81/37 99/91/37
f 75/93/38 85/87/38 87/94/38
f 84/81/39 90/95/39 89/85/39
f 118/96/40 137/97/40 141/98/40
f 140/99/41 150/100/41 128/101/41
f 127/102/42 218/103/42 227/104/42
f 129/105/43 133/106/43 128/101/43
f 172/107/44 213/108/44 219/109/44
f 204/110/45 214/111/45 213/108/45
f 263/112/46 256/113/46 278/114/46
f 214/111/47 215/115/47 220/116/47
f 206/117/47 279/118/47 173/119/47
f 170/120/48 261/121/48 259/122/48
f 176/123/49 173/124/49 170/120/49
f 211/125/50 180/126/50 174/127/50
f 175/128/51 212/129/51 176/123/51
f 175/130/52 199/131/52 195/132/52
f 193/133/53 206/134/53 176/123/53
f 178/135/54 180/126/54 179/136/54
f 172/107/55 177/137/55 178/138/55
f 171/139/56 180/126/56 177/140/56
f 216/141/57 181/142/57 218/143/57
f 225/144/58 183/145/58 221/146/58
f 222/147/59 223/148/59 224/149/59
f 275/150/59 200/151/59 287/152/59
f 269/153/60 292/154/60 181/155/60
f 181/155/61 184/156/61 187/157/61
f 208/158/62 205/159/62 185/160/62
f 207/161/63 187/157/63 203/162/63
f 218/143/64 186/163/64 227/164/64
f 200/165/65 203/162/65 187/157/65
f 191/166/66 189/167/66 190/168/66
f 183/145/67 188/169/67 182/170/67
f 182/171/68 191/166/68 185/160/68
f 197/172/69 208/173/69 183/145/69
f 8/1/70 3/10/70 2/2/70
f 116/174/71 104/6/71 139/175/71
f 116/174/72 139/175/72 283/176/72
f 3/10/2 143/177/2 142/4/2
f 139/175/73 104/6/73 138/5/73
f 139/175/74 250/178/74 283/176/74
f 9/179/75 108/8/75 109/180/75
f 7/181/75 108/8/75 9/179/75
f 7/181/76 2/2/76 108/8/76
f 104/6/27 112/182/27 111/9/27
f 111/9/77 108/8/77 104/6/77
f 3/10/78 8/27/78 10/11/78
f 11/16/79 9/183/79 156/184/79
f 9/183/80 109/185/80 156/184/80
f 148/186/81 109/185/81 111/187/81
f 115/15/82 116/188/82 157/13/82
f 147/189/83 109/185/83 148/186/83
f 148/14/84 111/187/84 115/15/84
f 156/184/85 109/185/85 147/189/85
f 258/190/86 157/13/86 116/188/86
f 158/191/6 159/18/6 1/12/6
f 1/12/87 10/192/87 11/16/87
f 11/16/88 156/193/88 164/17/88
f 164/17/6 158/191/6 1/12/6
f 160/19/7 143/177/7 3/10/7
f 3/10/7 1/12/7 160/19/7
f 5/20/89 6/26/89 8/1/89
f 165/194/90 6/26/90 163/195/90
f 110/21/91 272/196/91 167/22/91
f 272/197/9 262/198/9 167/22/9
f 166/23/90 163/195/90 110/21/90
f 114/199/92 106/24/92 113/25/92
f 106/24/93 107/200/93 110/21/93
f 5/20/94 7/181/94 113/25/94
f 113/25/95 7/181/95 9/179/95
f 113/25/95 9/179/95 114/201/95
f 6/26/96 4/31/96 10/11/96
f 161/28/97 272/202/97 105/29/97
f 105/29/98 106/203/98 149/30/98
f 149/204/99 106/203/99 114/205/99
f 162/206/100 9/183/100 11/16/100
f 162/206/101 151/207/101 114/205/101
f 151/207/102 149/204/102 114/205/102
f 162/206/103 114/205/103 9/183/103
f 272/202/104 161/28/104 262/208/104
f 169/33/105 162/209/105 11/16/105
f 11/16/106 10/192/106 4/31/106
f 169/33/13 11/16/13 4/31/13
f 4/31/13 153/210/13 152/32/13
f 154/34/14 153/210/14 4/31/14
f 6/26/14 165/194/14 154/34/14
f 13/37/15 28/211/15 25/212/15
f 25/212/15 20/35/15 13/37/15
f 19/42/16 23/38/16 40/40/16
f 40/43/17 22/54/17 18/41/17
f 22/54/17 21/55/17 18/41/17
f 29/44/18 24/213/18 25/45/18
f 23/47/107 19/42/107 18/48/107
f 20/214/108 25/50/108 43/52/108
f 25/50/20 24/215/20 39/51/20
f 41/216/109 39/51/109 22/54/109
f 39/51/109 24/215/109 22/54/109
f 22/54/110 40/43/110 41/216/110
f 13/53/111 26/217/111 23/47/111
f 22/54/22 24/213/22 29/44/22
f 42/39/112 23/38/112 20/218/112
f 23/38/112 26/36/112 20/218/112
f 45/58/23 192/219/23 201/220/23
f 192/219/23 209/221/23 201/220/23
f 201/220/23 72/56/23 45/58/23
f 53/222/113 55/223/113 58/224/113
f 55/223/113 73/225/113 58/224/113
f 54/60/24 61/73/24 52/61/24
f 53/222/24 58/59/24 52/61/24
f 60/63/25 56/226/25 291/64/25
f 55/65/114 53/222/114 52/66/114
f 267/227/27 194/228/27 278/229/27
f 56/230/27 70/69/27 291/68/27
f 71/71/115 70/69/115 54/60/115
f 54/60/115 70/69/115 56/230/115
f 45/72/116 57/231/116 55/65/116
f 54/60/30 56/226/30 60/63/30
f 73/225/117 55/223/117 72/232/117
f 55/223/117 57/57/117 72/232/117
f 197/75/31 226/233/31 225/234/31
f 197/75/31 225/234/31 75/76/31
f 87/235/31 102/74/31 75/76/31
f 85/77/32 83/236/32 100/78/32
f 100/82/33 83/236/33 82/80/33
f 82/80/33 90/95/33 84/81/33
f 260/237/34 265/83/34 89/85/34
f 82/86/118 83/236/118 85/87/118
f 86/238/36 265/89/36 99/91/36
f 266/239/36 202/240/36 277/241/36
f 100/82/119 84/81/119 101/92/119
f 99/91/37 84/81/37 86/238/37
f 75/93/120 88/88/120 85/87/120
f 86/84/39 84/81/39 89/85/39
f 87/235/121 85/77/121 102/242/121
f 85/77/121 103/79/121 102/242/121
f 118/96/40 119/243/40 137/97/40
f 119/243/40 160/244/40 145/245/40
f 119/243/40 145/245/40 137/97/40
f 117/246/40 141/98/40 146/247/40
f 141/98/40 117/246/40 118/96/40
f 119/243/122 118/96/122 123/248/122
f 129/105/41 128/101/41 150/100/41
f 155/249/41 129/105/41 150/100/41
f 128/101/41 127/250/41 140/99/41
f 127/250/41 144/251/41 140/99/41
f 127/102/123 128/252/123 218/103/123
f 199/131/44 170/253/44 219/109/44
f 170/253/44 171/254/44 219/109/44
f 171/254/44 172/107/44 219/109/44
f 213/108/124 172/107/124 204/110/124
f 172/107/124 209/255/124 192/256/124
f 204/110/45 172/107/45 192/257/45
f 204/110/45 215/115/45 214/111/45
f 278/114/125 194/258/125 263/112/125
f 263/112/47 194/258/47 174/127/47
f 174/127/47 264/259/47 263/112/47
f 253/260/47 279/118/47 206/117/47
f 259/122/48 264/259/48 171/139/48
f 264/259/48 174/127/48 171/139/48
f 171/139/48 170/120/48 259/122/48
f 170/120/48 251/261/48 261/121/48
f 273/262/48 173/124/48 196/263/48
f 251/261/48 170/120/48 273/264/48
f 170/120/48 173/124/48 273/264/48
f 175/265/49 176/123/49 170/120/49
f 211/125/126 179/136/126 180/126/126
f 174/127/127 194/266/127 210/267/127
f 210/267/126 211/125/126 174/127/126
f 212/129/51 193/133/51 176/123/51
f 175/128/51 195/268/51 212/129/51
f 175/130/52 170/253/52 199/131/52
f 206/134/128 173/124/128 176/123/128
f 178/135/54 177/269/54 180/126/54
f 172/107/55 171/254/55 177/137/55
f 171/139/56 174/127/56 180/126/56
f 209/255/129 172/107/129 201/270/129
f 172/107/129 178/138/129 211/271/129
f 201/270/129 172/107/129 211/271/129
f 178/138/129 179/136/129 211/271/129
f 217/272/57 183/145/57 216/141/57
f 183/145/57 182/170/57 216/141/57
f 182/170/57 181/142/57 216/141/57
f 226/273/58 183/145/58 225/274/58
f 183/145/130 217/272/130 221/146/130
f 217/272/130 223/148/130 221/146/130
f 223/148/58 222/147/58 221/146/58
f 271/275/59 185/160/59 270/276/59
f 270/276/59 185/160/59 202/277/59
f 202/277/131 266/278/131 270/276/131
f 287/152/59 200/151/59 184/279/59
f 184/156/60 181/155/60 252/280/60
f 181/155/60 290/281/60 252/280/60
f 292/154/60 290/281/60 181/155/60
f 181/155/60 182/171/60 269/153/60
f 182/171/60 185/160/60 271/275/60
f 269/153/60 182/171/60 271/275/60
f 198/282/60 184/156/60 252/283/60
f 186/284/61 181/155/61 187/157/61
f 205/159/132 202/285/132 185/160/132
f 185/160/133 191/166/133 208/158/133
f 191/166/62 190/168/62 208/158/62
f 186/286/63 207/161/63 227/287/63
f 186/286/63 187/157/63 207/161/63
f 218/143/64 181/142/64 186/163/64
f 200/165/65 187/157/65 184/156/65
f 191/166/66 188/288/66 189/167/66
f 183/145/67 189/289/67 188/169/67
f 182/171/68 188/290/68 191/166/68
f 190/168/69 189/289/69 208/173/69
f 189/289/69 183/145/69 208/173/69
f 183/145/69 226/273/69 197/172/69
usemtl Material.003
f 33/291/16 38/292/16 30/293/16
f 32/294/17 41/295/17 40/296/17
f 39/297/18 36/298/18 43/299/18
f 33/300/134 40/301/134 42/302/134
f 34/303/20 36/304/20 35/305/20
f 34/303/109 32/294/109 38/292/109
f 20/306/135 33/300/135 42/302/135
f 32/294/22 39/297/22 41/295/22
f 31/307/112 33/291/112 37/308/112
f 72/309/136 201/310/136 211/311/136
f 65/312/113 69/313/113 62/314/113
f 64/315/24 71/316/24 58/317/24
f 194/318/25 267/319/25 254/320/25
f 267/321/25 70/322/25 255/323/25
f 65/324/137 58/325/137 73/326/137
f 211/327/27 210/328/27 66/329/27
f 66/329/115 64/315/115 69/313/115
f 72/330/138 65/324/138 73/326/138
f 64/315/30 70/322/30 71/316/30
f 63/331/117 65/312/117 68/332/117
f 208/333/139 197/334/139 102/335/139
f 94/336/32 98/337/32 95/338/32
f 202/339/34 205/340/34 285/341/34
f 286/342/34 96/343/34 99/344/34
f 100/345/140 94/346/140 103/347/140
f 93/348/37 95/349/37 98/337/37
f 102/350/141 94/346/141 97/351/141
f 93/348/39 101/352/39 99/344/39
f 94/336/121 92/353/121 97/354/121
f 146/247/40 145/245/40 330/355/40
f 121/356/142 142/357/142 143/358/142
f 214/359/143 138/360/143 142/357/143
f 117/361/144 195/362/144 199/363/144
f 193/364/145 329/365/145 328/366/145
f 121/356/146 126/367/146 120/368/146
f 156/369/147 327/370/147 325/371/147
f 164/372/148 332/373/148 158/374/148
f 282/375/149 250/376/149 139/377/149
f 157/378/149 258/379/149 206/380/149
f 125/381/150 123/382/150 126/367/150
f 119/243/122 123/248/122 124/383/122
f 118/384/151 126/367/151 123/385/151
f 119/243/152 125/381/152 121/356/152
f 129/105/153 154/386/153 165/387/153
f 223/388/154 217/389/154 163/390/154
f 203/391/155 338/392/155 339/393/155
f 136/394/156 131/395/156 130/396/156
f 343/397/157 149/398/157 151/399/157
f 169/400/158 345/401/158 347/402/158
f 274/403/159 200/404/159 275/405/159
f 136/394/160 134/406/160 135/407/160
f 128/252/161 136/394/161 130/396/161
f 135/407/162 129/105/162 131/395/162
f 104/6/163 108/8/163 2/2/163
f 110/21/164 5/20/164 113/25/164
f 43/408/15 36/409/15 20/410/15
f 36/409/15 31/307/15 20/410/15
f 31/307/15 37/308/15 20/410/15
f 33/291/16 34/411/16 38/292/16
f 30/293/17 38/292/17 40/296/17
f 38/292/17 32/294/17 40/296/17
f 39/297/18 35/412/18 36/298/18
f 33/300/165 30/293/165 40/301/165
f 34/303/20 31/413/20 36/304/20
f 34/303/109 35/305/109 32/294/109
f 20/306/166 37/414/166 33/300/166
f 32/294/22 35/412/22 39/297/22
f 31/307/112 34/411/112 33/291/112
f 211/311/167 63/331/167 72/309/167
f 63/331/23 68/332/23 72/309/23
f 65/312/113 66/415/113 69/313/113
f 62/314/24 69/313/24 58/317/24
f 69/313/24 64/315/24 58/317/24
f 254/320/25 210/416/25 194/417/25
f 70/322/25 67/418/25 255/323/25
f 65/324/168 62/314/168 58/325/168
f 276/419/27 255/420/27 67/421/27
f 210/328/27 254/422/27 276/423/27
f 67/421/27 66/329/27 276/423/27
f 66/329/27 63/424/27 211/327/27
f 276/423/27 66/329/27 210/328/27
f 64/315/115 66/329/115 67/421/115
f 72/330/169 68/425/169 65/324/169
f 64/315/30 67/418/30 70/322/30
f 63/331/117 66/415/117 65/312/117
f 97/354/31 92/353/31 102/335/31
f 92/353/170 208/333/170 102/335/170
f 94/336/32 91/426/32 98/337/32
f 101/352/33 93/348/33 100/427/33
f 93/348/33 98/337/33 100/427/33
f 98/337/33 91/426/33 100/427/33
f 277/428/34 202/429/34 285/341/34
f 277/430/34 286/342/34 99/344/34
f 100/345/171 91/426/171 94/346/171
f 285/431/36 205/432/36 289/433/36
f 205/432/36 208/434/36 95/349/36
f 289/433/36 205/432/36 95/349/36
f 92/435/36 95/349/36 208/434/36
f 95/349/36 96/436/36 289/433/36
f 96/436/36 286/437/36 289/438/36
f 95/349/37 93/348/37 96/436/37
f 102/350/172 103/347/172 94/346/172
f 96/343/173 93/348/173 99/344/173
f 94/336/121 95/338/121 92/353/121
f 146/247/40 330/439/40 117/246/40
f 145/245/40 160/244/40 159/440/40
f 143/358/142 160/244/142 119/243/142
f 119/243/142 121/356/142 143/358/142
f 214/359/143 220/441/143 138/360/143
f 220/441/174 282/375/174 139/377/174
f 138/360/143 220/441/143 139/377/143
f 142/357/143 121/356/143 213/442/143
f 121/356/143 120/368/143 213/442/143
f 120/368/143 219/443/143 213/442/143
f 213/442/143 214/359/143 142/357/143
f 199/363/144 219/443/144 118/384/144
f 219/443/144 120/368/144 118/384/144
f 118/384/144 117/361/144 199/363/144
f 195/362/144 117/361/144 212/444/144
f 329/365/145 212/444/145 336/445/145
f 206/446/145 328/366/145 340/447/145
f 121/356/146 125/381/146 126/367/146
f 148/448/147 326/449/147 147/450/147
f 147/450/147 326/449/147 327/370/147
f 122/451/175 340/452/175 344/453/175
f 117/246/176 330/439/176 335/454/176
f 158/374/148 332/373/148 330/455/148
f 156/456/148 331/457/148 164/372/148
f 258/379/149 253/458/149 206/380/149
f 122/451/149 157/378/149 206/380/149
f 125/381/150 124/459/150 123/382/150
f 118/384/151 120/368/151 126/367/151
f 119/243/152 124/383/152 125/381/152
f 153/460/41 324/461/41 152/462/41
f 154/386/41 129/105/41 155/249/41
f 153/460/41 154/386/41 155/249/41
f 163/390/153 131/395/153 165/387/153
f 131/395/153 129/105/153 165/387/153
f 217/389/154 216/463/154 130/396/154
f 130/396/154 131/395/154 217/389/154
f 131/395/154 163/390/154 217/389/154
f 163/390/154 166/464/154 223/388/154
f 166/464/154 167/465/154 224/466/154
f 223/388/154 166/464/154 224/466/154
f 167/465/154 168/467/154 224/466/154
f 128/252/123 130/396/123 216/463/123
f 218/103/123 128/252/123 216/463/123
f 227/104/123 207/468/123 127/102/123
f 207/468/155 334/469/155 333/470/155
f 339/393/155 207/468/155 203/391/155
f 136/394/156 135/407/156 131/395/156
f 162/471/177 341/472/177 151/399/177
f 342/473/178 337/474/178 132/475/178
f 151/399/177 341/472/177 343/397/177
f 127/250/179 333/476/179 324/477/179
f 152/462/158 324/478/158 345/401/158
f 162/479/158 347/402/158 346/480/158
f 168/467/180 167/465/180 262/481/180
f 274/403/180 262/482/180 161/483/180
f 161/483/181 200/404/181 274/403/181
f 348/484/180 132/475/180 161/483/180
f 161/483/182 132/475/182 200/404/182
f 136/394/160 133/485/160 134/406/160
f 129/105/43 134/486/43 133/106/43
f 128/252/161 133/487/161 136/394/161
f 135/407/162 134/486/162 129/105/162
f 145/245/40 159/440/40 330/355/40
f 156/369/147 147/450/147 327/370/147
f 164/372/148 331/457/148 332/373/148
f 153/460/41 155/249/41 144/488/41
f 348/489/183 342/473/183 132/475/183
f 343/397/184 348/490/184 149/398/184
f 169/400/158 152/462/158 345/401/158
f 159/440/40 158/374/40 330/491/40
f 335/492/145 336/445/145 212/444/145
f 212/444/145 117/361/145 335/492/145
f 329/365/145 193/364/145 212/444/145
f 122/451/145 206/446/145 340/447/145
f 206/446/185 193/364/185 328/366/185
f 148/448/147 323/493/147 326/449/147
f 122/451/147 344/453/147 323/494/147
f 156/456/148 325/495/148 331/457/148
f 148/496/149 157/378/149 323/497/149
f 157/378/149 122/451/149 323/497/149
f 144/251/41 127/250/41 324/477/41
f 153/460/41 144/498/41 324/461/41
f 127/102/155 207/468/155 333/470/155
f 337/499/155 338/392/155 200/500/155
f 338/392/186 203/391/186 200/500/186
f 200/500/155 132/475/155 337/499/155
f 339/393/155 334/469/155 207/468/155
f 162/471/187 346/501/187 341/472/187
f 162/479/158 169/400/158 347/402/158
f 161/483/180 149/502/180 348/484/180
usemtl Material
f 325/503/188 327/504/188 297/505/188
f 346/506/188 347/507/188 299/508/188
f 297/505/188 298/509/188 325/503/188
f 298/509/188 299/508/188 325/503/188
f 299/508/188 295/510/188 330/511/188
f 326/512/189 323/513/189 297/505/189
f 330/511/188 332/514/188 299/508/188
f 332/514/188 331/515/188 299/508/188
f 331/515/188 325/516/188 299/508/188
f 327/504/188 326/512/188 297/505/188
f 324/517/190 144/518/190 304/519/190
f 304/519/191 299/508/191 324/520/191
f 299/508/188 298/509/188 346/521/188
f 298/509/188 306/522/188 346/521/188
f 348/523/188 343/524/188 306/522/188
f 343/524/188 341/525/188 306/522/188
f 347/507/188 345/526/188 299/508/188
f 345/526/192 324/520/192 299/508/192
f 346/521/188 306/522/188 341/525/188
usemtl Material.001
f 155/527/15 150/528/15 28/529/15
f 14/530/16 18/531/16 12/532/16
f 137/533/17 145/534/17 21/535/17
f 16/536/18 144/537/18 15/538/18
f 14/539/193 145/534/193 146/540/193
f 28/541/20 140/542/20 29/543/20
f 29/543/194 141/544/194 21/545/194
f 155/546/195 14/539/195 144/547/195
f 16/536/22 146/548/22 141/549/22
f 14/530/112 13/550/112 27/551/112
f 51/552/23 192/553/23 45/554/23
f 48/555/113 52/556/113 44/557/113
f 44/557/24 52/556/24 61/558/24
f 49/559/196 50/560/196 268/561/196
f 46/562/197 109/563/197 108/564/197
f 268/565/27 60/566/27 257/567/27
f 61/568/115 60/566/115 47/569/115
f 115/570/198 111/571/198 173/572/198
f 283/573/199 282/574/199 104/575/199
f 47/569/30 49/559/30 46/562/30
f 48/555/117 45/554/117 59/576/117
f 81/577/31 225/578/31 221/579/31
f 82/580/32 78/581/32 74/582/32
f 114/583/200 79/584/200 76/585/200
f 78/586/200 79/584/200 114/587/200
f 89/588/37 77/589/37 80/590/37
f 105/591/201 272/592/201 288/593/201
f 168/594/202 272/595/202 110/596/202
f 77/589/39 76/585/39 79/597/39
f 78/581/121 75/598/121 81/577/121
f 230/599/203 263/600/203 264/601/203
f 263/600/204 254/602/204 278/603/204
f 255/604/205 232/605/205 291/606/205
f 258/607/206 116/608/206 280/609/206
f 232/605/207 228/610/207 231/611/207
f 231/611/208 233/612/208 234/613/208
f 233/614/209 261/615/209 251/616/209
f 233/617/210 259/618/210 261/619/210
f 196/620/211 268/621/211 234/613/211
f 253/622/212 280/609/212 279/623/212
f 236/624/213 238/625/213 237/626/213
f 230/599/214 235/627/214 236/628/214
f 229/629/215 238/625/215 235/630/215
f 230/599/216 237/626/216 276/631/216
f 239/632/217 269/633/217 271/634/217
f 285/635/218 241/636/218 270/637/218
f 272/638/219 274/639/219 288/640/219
f 265/641/219 243/642/219 286/643/219
f 239/644/220 243/642/220 242/645/220
f 245/646/221 239/644/221 242/645/221
f 249/647/222 248/648/222 289/649/222
f 245/646/223 252/650/223 290/651/223
f 269/633/224 244/652/224 292/653/224
f 284/654/225 198/655/225 245/646/225
f 275/656/226 288/640/226 274/639/226
f 248/648/227 246/657/227 247/658/227
f 241/636/228 246/659/228 240/660/228
f 240/661/229 249/647/229 243/642/229
f 248/648/230 247/662/230 241/636/230
f 28/529/15 13/550/15 155/527/15
f 13/550/15 17/663/15 155/527/15
f 14/530/16 27/551/16 18/531/16
f 12/532/17 18/531/17 145/534/17
f 18/531/17 21/535/17 145/534/17
f 16/536/18 140/664/18 144/537/18
f 14/539/193 146/540/193 15/665/193
f 14/539/193 12/532/193 145/534/193
f 150/666/20 140/542/20 28/541/20
f 140/542/20 16/667/20 29/543/20
f 16/667/109 141/544/109 29/543/109
f 141/544/231 137/533/231 21/545/231
f 155/546/195 17/668/195 14/539/195
f 144/547/195 14/539/195 15/665/195
f 16/536/22 15/538/22 146/548/22
f 14/530/112 17/663/112 13/550/112
f 51/552/23 204/669/23 192/553/23
f 48/555/113 59/576/113 52/556/113
f 47/569/24 46/562/24 61/558/24
f 46/562/24 44/557/24 61/558/24
f 196/670/232 173/671/232 268/561/232
f 173/671/233 49/559/233 268/561/233
f 109/672/197 49/673/197 48/674/197
f 48/674/197 44/557/197 46/562/197
f 108/564/197 109/672/197 48/674/197
f 46/562/197 108/564/197 48/674/197
f 109/563/197 46/562/197 49/673/197
f 50/675/27 60/566/27 268/676/27
f 47/569/115 60/566/115 50/675/115
f 104/575/199 48/674/199 111/571/199
f 111/571/199 48/674/199 49/673/199
f 173/572/234 111/571/234 49/673/234
f 173/572/235 279/677/235 280/678/235
f 173/572/236 280/678/236 115/570/236
f 280/678/199 116/679/199 115/570/199
f 282/574/199 220/680/199 104/575/199
f 220/680/199 215/681/199 104/575/199
f 215/681/199 204/682/199 51/683/199
f 51/683/199 48/674/199 215/681/199
f 48/674/199 104/575/199 215/681/199
f 104/575/199 116/684/199 283/573/199
f 47/569/30 50/560/30 49/559/30
f 48/555/117 51/552/117 45/554/117
f 81/577/31 75/598/31 225/578/31
f 82/580/32 88/685/32 78/581/32
f 82/580/33 74/582/33 90/686/33
f 74/582/33 76/585/33 90/686/33
f 76/585/33 77/589/33 90/686/33
f 284/687/237 80/688/237 79/597/237
f 184/689/238 284/687/238 79/597/238
f 184/689/239 198/690/239 284/687/239
f 113/691/200 114/583/200 76/585/200
f 78/586/200 114/587/200 113/691/200
f 78/586/200 113/691/200 76/585/200
f 74/582/200 78/586/200 76/585/200
f 284/692/36 260/693/36 89/588/36
f 80/590/36 284/694/36 89/588/36
f 90/695/37 77/589/37 89/588/37
f 288/593/240 287/696/240 184/697/240
f 106/698/202 79/584/202 78/586/202
f 78/586/202 110/596/202 106/698/202
f 288/593/241 184/697/241 105/591/241
f 184/697/242 79/584/242 106/698/242
f 105/591/243 184/697/243 106/698/243
f 110/596/202 78/586/202 222/699/202
f 78/586/202 81/700/202 222/699/202
f 81/700/202 221/701/202 222/699/202
f 222/699/202 224/702/202 110/596/202
f 224/702/201 168/594/201 110/596/201
f 80/688/39 77/589/39 79/597/39
f 78/581/121 88/685/121 75/598/121
f 264/601/203 259/618/203 228/703/203
f 228/703/203 229/704/203 264/601/203
f 229/704/203 230/599/203 264/601/203
f 230/599/244 276/705/244 254/602/244
f 254/602/245 267/706/245 278/603/245
f 263/600/204 230/599/204 254/602/204
f 283/707/204 250/708/204 282/709/204
f 255/604/205 276/710/205 232/605/205
f 232/605/205 231/611/205 291/606/205
f 231/611/205 268/711/205 291/606/205
f 268/711/205 257/712/205 291/606/205
f 291/606/205 267/713/205 255/604/205
f 232/605/207 229/629/207 228/610/207
f 231/611/208 228/610/208 233/612/208
f 276/631/246 237/626/246 238/625/246
f 238/625/246 232/605/246 276/631/246
f 273/714/209 234/613/209 251/616/209
f 234/613/209 233/614/209 251/616/209
f 233/617/210 228/703/210 259/618/210
f 231/611/212 234/613/212 268/621/212
f 273/715/247 196/620/247 234/613/247
f 253/622/212 258/607/212 280/609/212
f 236/624/213 235/716/213 238/625/213
f 230/599/214 229/704/214 235/627/214
f 229/629/215 232/605/215 238/625/215
f 230/599/248 236/628/248 237/626/248
f 271/634/217 270/637/217 241/636/217
f 241/636/217 240/660/217 271/634/217
f 240/660/217 239/632/217 271/634/217
f 270/637/218 281/717/218 266/718/218
f 266/718/249 277/719/249 285/635/249
f 285/635/218 289/720/218 241/636/218
f 270/637/218 266/718/218 285/635/218
f 168/721/250 262/722/250 272/723/250
f 272/638/251 262/724/251 274/639/251
f 286/643/219 277/725/219 265/641/219
f 265/641/219 260/726/219 284/727/219
f 284/727/219 242/645/219 265/641/219
f 242/645/219 243/642/219 265/641/219
f 243/642/252 289/728/252 286/643/252
f 239/644/220 240/661/220 243/642/220
f 245/646/221 244/729/221 239/644/221
f 243/642/253 249/647/253 289/649/253
f 290/651/254 292/730/254 244/731/254
f 244/731/254 245/646/254 290/651/254
f 269/633/224 239/632/224 244/652/224
f 198/655/255 252/732/255 245/646/255
f 245/646/226 242/645/226 284/654/226
f 275/656/226 287/733/226 288/640/226
f 248/648/227 249/647/227 246/657/227
f 241/636/228 247/662/228 246/659/228
f 240/661/229 246/734/229 249/647/229
f 289/649/230 248/648/230 241/636/230
f 297/505/256 300/735/256 298/509/256
f 294/736/257 335/737/257 330/738/257
f 294/736/258 299/508/258 302/739/258
f 300/735/259 306/522/259 298/509/259
f 303/740/260 324/741/260 333/742/260
f 303/740/261 299/508/261 304/519/261
f 297/505/262 296/743/262 300/735/262
f 294/736/263 293/744/263 336/745/263
f 293/744/263 340/746/263 328/747/263
f 329/748/263 293/744/263 328/747/263
f 329/748/263 336/745/263 293/744/263
f 336/745/263 335/749/263 294/736/263
f 330/738/264 295/510/264 294/736/264
f 294/736/265 295/510/265 299/508/265
f 293/744/266 296/743/266 323/750/266
f 340/751/267 293/744/267 344/752/267
f 296/743/268 297/505/268 323/753/268
f 344/752/269 293/744/269 323/754/269
f 300/735/270 305/755/270 306/522/270
f 337/756/271 301/757/271 338/758/271
f 301/757/271 303/740/271 334/759/271
f 338/758/271 301/757/271 339/760/271
f 333/761/271 334/759/271 303/740/271
f 334/759/271 339/760/271 301/757/271
f 303/740/260 304/519/260 324/741/260
f 303/740/258 302/739/258 299/508/258
f 348/762/272 306/522/272 305/755/272
f 305/755/273 301/757/273 348/763/273
f 301/757/274 337/764/274 342/765/274
f 301/757/275 342/765/275 348/766/275
usemtl Material.004
f 302/739/276 309/767/276 294/736/276
f 305/755/277 313/768/277 301/757/277
f 307/769/278 316/770/278 315/771/278
f 307/769/279 319/772/279 311/773/279
f 303/740/280 313/768/280 314/774/280
f 294/736/281 308/775/281 293/744/281
f 302/739/276 314/774/276 310/776/276
f 296/743/282 308/775/282 307/769/282
f 300/735/283 312/777/283 305/755/283
f 300/735/284 307/769/284 311/773/284
f 314/774/285 321/778/285 322/779/285
f 312/777/286 321/778/286 313/768/286
f 309/767/287 316/770/287 308/775/287
f 310/776/288 317/780/288 309/767/288
f 312/777/289 319/772/289 320/781/289
f 314/774/288 318/782/288 310/776/288
f 302/739/276 310/776/276 309/767/276
f 305/755/277 312/777/277 313/768/277
f 307/769/278 308/775/278 316/770/278
f 307/769/279 315/771/279 319/772/279
f 303/740/280 301/757/280 313/768/280
f 294/736/281 309/767/281 308/775/281
f 302/739/276 303/740/276 314/774/276
f 296/743/282 293/744/282 308/775/282
f 300/735/283 311/773/283 312/777/283
f 300/735/284 296/743/284 307/769/284
f 314/774/285 313/768/285 321/778/285
f 312/777/286 320/781/286 321/778/286
f 309/767/287 317/780/287 316/770/287
f 310/776/288 318/782/288 317/780/288
f 312/777/289 311/773/289 319/772/289
f 314/774/288 322/779/288 318/782/288
usemtl Material.006
f 104/6/290 2/2/290 142/4/290
f 2/2/291 3/10/291 142/4/291
f 6/26/292 5/20/292 163/195/292
f 5/20/293 110/21/293 163/195/293
usemtl yellow
f 316/770/294 318/782/294 315/771/294
f 318/782/295 322/779/295 321/778/295
f 317/780/295 318/782/295 316/770/295
f 318/782/296 319/772/296 315/771/296
f 321/778/297 320/781/297 318/782/297
f 320/781/298 319/772/298 318/782/298`;

var yellowMTL =
    `newmtl Material
Kd 0.495847 0.495847 0.495847
newmtl Material.001
Kd 0.032441 0.032441 0.032441
newmtl Material.002
Kd 0.058111 0.046913 0.048498
newmtl Material.003
Kd 0.070358 0.070358 0.070358
newmtl Material.004
Kd 0.044900 0.043711 0.045184
newmtl Material.006
Kd 0.105485 0.105485 0.105485
newmtl yellow
Kd 0.800000 0.780731 0.000000`;

var yellowMTL_HIT =
    `newmtl Material
Kd 1.000000 0.333834 0.304001
newmtl Material.001
Kd 0.183263 0.085364 0.086656
newmtl Material.002
Kd 0.264107 0.087208 0.085673
newmtl Material.003
Kd 0.426214 0.199761 0.178651
newmtl Material.004
Kd 0.520433 0.185291 0.175679
newmtl Material.006
Kd 0.441158 0.218394 0.235417
newmtl yellow
Kd 0.800000 0.780731 0.000000`;