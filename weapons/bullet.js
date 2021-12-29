class Bullet {
    vertices = [];
    faces = [];
    arraybuffer = [];
    buffer;
    program;
    id;
    damage;
    scale;
    constructor(r, g, b, id, bulletOBJ, damage,scale) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.id = id;
        this.scale=scale;
        parseBullet(bulletOBJ, this,this.scale );
        this.arraybuffer = new Float32Array(createBufferColor(this, [r, g, b]));
        this.damage = damage;
    }
    createBufferData(gl){
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER,this.arraybuffer,gl.STATIC_DRAW);
    }
}

class Bullet_instance {
    life;
    velocity;
    rotationX;
    rotationY;
    parent;
    constructor(coordinate, direction, speed, rotationX, rotationY, life, type) {
        this.coordinate = coordinate;
        this.direction = direction;
        this.speed = speed;
        this.velocity = [0,0,0];
        vec3.scale(this.velocity, direction, speed);
        this.life = life;
        this.rotationX = rotationX;
        this.rotationY = rotationY;
        this.type = type;
    }
    move_bullet() {
        if (this.life > 0) {
            this.life -= 1;
            vec3.add(this.coordinate, this.coordinate, this.velocity);
        }

    }
    generate(coordinate, direction, speed, rotationX, rotationY, life, type){
        this.coordinate = coordinate;
        this.direction = direction;
        this.speed = speed;
        vec3.scale(this.velocity, direction, speed);
        this.life = life;
        this.rotationX = rotationX;
        this.rotationY = rotationY;
        this.type = type;
    }
}


class Bullet_instance_target {
    life;
    velocity;
    rotationX;
    rotationY;
    start;
    target;
    parent;
    type;
    constructor(coordinate, direction, speed, rotationX, rotationY, start, target, life, parent, type) {
        this.coordinate = coordinate;
        this.direction = direction;
        this.speed = speed;
        this.velocity = vec3.create();
        vec3.scale(this.velocity, direction, speed);
        this.life = life;
        this.start = start;
        this.target = target;
        this.rotationX = rotationX;
        this.rotationY = rotationY;
        this.parent = parent;
        this.type = type;
    }
    move_bullet() {
        if (this.life > 0) {
            this.life -= 1;
            vec3.add(this.coordinate, this.coordinate, this.velocity);
        }
    }

    generate(coordinate, direction, speed, rotationX, rotationY, start, target, life, parent, type){
        this.coordinate = coordinate;
        this.direction = direction;
        this.speed = speed;
        vec3.scale(this.velocity, direction, speed);
        this.life = life;
        this.start = start;
        this.target = target;
        this.rotationX = rotationX;
        this.rotationY = rotationY;
        this.parent = parent;
        this.type = type;
    }
}

function draw_bullet(gl, bullet_instance, type, program, identitymatrix, w, v, p, world, view, projection) {




    mat4.translate(w, identitymatrix, bullet_instance.coordinate);
    mat4.rotateY(w, w, deg2rad(bullet_instance.rotationY));
    mat4.rotateX(w, w, deg2rad(bullet_instance.rotationX));
    vec3.add(player.camera_coordinates, player.coordinate, player.lookingto);
    glMatrix.mat4.lookAt(v, player.coordinate, player.camera_coordinates, direction_up);//camera 


    gl.uniformMatrix4fv(world, gl.FALSE, w);
    gl.uniformMatrix4fv(view, gl.FALSE, v);
    gl.uniformMatrix4fv(projection, gl.FALSE, p);
    glMatrix.mat4.identity(identitymatrix);
    gl.drawArrays(gl.TRIANGLES, 0, type.arraybuffer.length / 6);
}




function check_bullet_array_player_rifle(bullet_array,pool) {
    if (active_length_player_rifle > 0) {
        if (bullet_array[0].life <= 0) {
            pool.returnplayerbullet_rifle(bullet_array[0]);
            shift_left_array(bullet_array,active_length_player_rifle);
            active_length_player_rifle-=1;
        }
    }
}
function check_bullet_array_player_sniper(bullet_array,pool) {
    if (active_length_player_sniper> 0) {
        if (bullet_array[0].life <= 0) {
            pool.returnplayerbullet_sniper(bullet_array[0]);
            shift_left_array(bullet_array,active_length_player_sniper);
            active_length_player_sniper-=1;
        }
    }
}function check_bullet_array_enemy(bullet_array,pool) {
    if (active_length_enemy_rifle> 0) {
        if (bullet_array[0].life <= 0) {
            pool.returnbullet_enemy( bullet_array[0]);
            shift_left_array(bullet_array,active_length_enemy_rifle);
            active_length_enemy_rifle-=1;
        }
    }
}
function update_bullet_array(bullet_Array,len) {

    for (var i = 0; i < len; i++) {
        bullet_Array[i].move_bullet();
    }

}


function create_bullet_player_rifle(player, bullet_array, type,pool) {
    let bullet =pool.getplayerbullet_rifle();
    let bullet_coordinate = bullet.coordinate;
    let bullet_direction = bullet.direction;
    
    vec3.copy(tmp_vector, player.lookingto);
    vec3.scale(tmp_vector, tmp_vector, player.equipped_gun.ammo_create_location);
    vec3.copy(bullet_coordinate, player.equipped_gun.translation);
    vec3.add(bullet_coordinate, bullet_coordinate, tmp_vector);
    vec3.copy(bullet_direction, player.lookingto);
    let random_factor = player.equipped_gun.spread;
    vec3.rotateX(bullet_direction, bullet_direction, origin_vec, deg2rad((Math.random() * 2*random_factor)-random_factor));
    vec3.rotateY(bullet_direction, bullet_direction, origin_vec , deg2rad((Math.random() * 2*random_factor)-random_factor));
    vec3.rotateZ(bullet_direction, bullet_direction, origin_vec, deg2rad((Math.random() * 2*random_factor)-random_factor));
 
    bullet.generate(bullet_coordinate, bullet_direction, player.equipped_gun.ammo_speed + Math.random() / 7, pitch - 90, yaw, player.equipped_gun.ammo_life, type);
    bullet_array[active_length_player_rifle]=bullet;
    active_length_player_rifle+=1;

}
function create_bullet_sniper(player, bullet_array, type,pool) {
    let bullet =pool.getplayerbullet_sniper();
    let bullet_coordinate = bullet.coordinate;
    let bullet_direction = bullet.direction;
    vec3.copy(tmp_vector, player.lookingto);
    vec3.scale(tmp_vector, tmp_vector, player.equipped_gun.ammo_create_location);
    vec3.copy(bullet_coordinate, player.equipped_gun.translation);
    vec3.add(bullet_coordinate, bullet_coordinate, tmp_vector);
    vec3.copy(bullet_direction, player.lookingto);
    let random_factor = player.equipped_gun.spread;
    vec3.rotateX(bullet_direction, bullet_direction, origin_vec, deg2rad((Math.random() * 2*random_factor)-random_factor));
    vec3.rotateY(bullet_direction, bullet_direction, origin_vec , deg2rad((Math.random() * 2*random_factor)-random_factor));
    vec3.rotateZ(bullet_direction, bullet_direction, origin_vec, deg2rad((Math.random() * 2*random_factor)-random_factor));
    bullet.generate(bullet_coordinate, bullet_direction, player.equipped_gun.ammo_speed + Math.random() / 7, pitch - 90, yaw, player.equipped_gun.ammo_life, type);
    bullet_array[active_length_player_sniper]=bullet;
    active_length_player_sniper+=1;
}




function draw_bullet_array(gl, bullet_array, type, program, identitymatrix, w, v, p, world, view, projection, pos, color,active_len) {
    const len = active_len;
    if (len == 0) {
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,type.buffer);
    gl.vertexAttribPointer(pos, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(color, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(pos);
    gl.enableVertexAttribArray(color);
    for (let i = 0; i < len; i++) {
        if (bullet_array[i].life > 0) {
            draw_bullet(gl, bullet_array[i], type, program, identitymatrix, w, v, p, world, view, projection);
        }
    }
}


function parseBullet(text, object,scale) {
    const linelist = text.split('\n');
    for (var i = 0; i < linelist.length; i++) {
        const tmp = linelist[i].split(' ');
        if (tmp[0] === '#') {
            continue;  //v 1 2 3 r g b
        }
        const type = tmp.shift();
        if (type === 'v') {
            for (var j = 0; j < tmp.length; j++) {
                tmp[j] = Number(tmp[j])*scale; // tmp=[v1,v2,v3,[r,g,b]];
            }
            object.vertices.push(tmp);
        } else if (type === 'f') {
            var list = [];
            for (var j = 0; j < tmp.length; j++) {
                const vertice_index = tmp[j].split('/');
                for (var k = 0; k < vertice_index.length; k++) {
                    vertice_index[k] = Number(vertice_index[k] - 1);
                }
                list.push(vertice_index);
            }
            object.faces.push(list); //list=[[1,2,3],[4,5,6],[7,8,9]]; only use 1,4,7 vertice index

        }
    }

}


//player bullets
function bullet_collision_rifle(bullet_array, target_object, collision_range, damage,partition) {
    const len = active_length_player_rifle;
    if (len == 0) {
        return;
    }
    if (target_object.health <= 0) {
        return;
    }
    var start_index=0;
    var end_index=Math.floor(len/2);
    if(partition==1){
        start_index+=end_index;
        end_index=len;
    }
    for (var i = start_index; i < end_index; i++) {
        if (bullet_array[i].life == 0) {
            continue;
        }
        let dist = vec3.distance(bullet_array[i].coordinate, target_object.translation);
        if (dist <= collision_range) { // if bullet is colliding with target

            bullet_array[i].life = 0;
            target_object.health -= damage; // damage target 
            target_object.hit = 10;
            if (target_object.health <= 0) {
                game.kill(target_object.id);
                player.heal_player(target_object.id);
                target_object.state = 3; //death state

               
                vec3.copy(target_object.move_direction, bullet_array[i].direction);
                target_object.move_speed = 0.1;
                target_object.frame = 0;
                return;
            }
        }
    }
}

function bullet_collision_sniper(bullet_array, target_object, collision_range, damage) {
    const len = active_length_player_sniper;
    if (len == 0) {
        return;
    }
    if (target_object.health <= 0) {
        return;
    }
    for (var i = 0; i < len; i++) {
        if (bullet_array[i].life == 0) {
            continue;
        }
        let dist = vec3.distance(bullet_array[i].coordinate, target_object.translation);
        if (dist <= collision_range) { // if bullet is colliding with target
            console.log("collision");
            bullet_array[i].life = 0;
            target_object.health -= damage; // damage target 
            target_object.hit = 10;

            if (target_object.health <= 0) {
                game.kill(target_object.id);
                player.heal_player(target_object.id);
                target_object.state = 3; //death state
                 
                let direction = vec3.create();
                vec3.copy(direction, bullet_array[i].direction);
                target_object.move_direction = direction; //fall to the ground;
                target_object.move_speed = 0.1;
                target_object.frame = 0;
                return;
            }else{
                 vec3.scale(tmp_vector,bullet_array[i].direction,sniper_hit_pulse);
                 vec3.copy(target_object.sniper_hit_vector,tmp_vector);
                 target_object.sniper_hit_counter=50;
            } 
        }
    }
}


function bullet_collision_rocket_array(bullet_array, rocket_array, collision_range, damage,active_len) {
    const len = active_len;
    const rocket_array_len = active_length_enemy_rocket;
    if (len == 0 || rocket_array_len == 0) {
        return;
    }
    for (var i = 0; i < len; i++) {
        if (bullet_array[i].life == 0) {
            continue;
        }
        for (let j = 0; j < rocket_array_len; j++) {
            if(rocket_array[j].life<=0){
                continue;
            }
            let dist = vec3.distance(bullet_array[i].coordinate, rocket_array[j].translation);
            if (dist <= collision_range) { // if bullet is colliding with target
                
                bullet_array[i].life = 0;
                rocket_array[j].health -= damage; // damage target 

                if (rocket_array[j].health <= 0) {

                    rocket_array[j].life = 0;
                    console.log("hit the rocket");

                }
                break;
            }
        }
    }
}


function bullet_collision_enemy(bullet_array,player, collision_range, damage) {
    const len = active_length_enemy_rifle;
    if (len == 0) {
        return;
    }
    if (player.health <= 0) {
        return;
    }
    for (var i = 0; i < len; i++) {
        if (bullet_array[i].life == 0) {
            continue;
        }
        let dist = vec3.distance(bullet_array[i].coordinate, player.coordinate);
        if (dist <= collision_range) { // if bullet is colliding with target

            bullet_array[i].life = 0;
            player.damage_player(damage);
            if (player.health <= 0) {
                return;
            }
        }
    }
}


const bulletObj =
`v 0.000000 -0.876459 -0.245930
v 0.000000 0.101036 -0.222649
v 0.192276 -0.876459 -0.153335
v 0.174074 0.101036 -0.138819
v 0.239764 -0.876459 0.054725
v 0.217066 0.101036 0.049544
v 0.106705 -0.876459 0.221575
v 0.096604 0.101036 0.200599
v -0.106705 -0.876459 0.221575
v -0.096604 0.101036 0.200599
v -0.239764 -0.876459 0.054725
v -0.217066 0.101036 0.049544
v -0.192276 -0.876459 -0.153335
v -0.174074 0.101036 -0.138819
v 0.121250 0.353404 -0.096694
v -0.000000 0.353404 -0.155085
v 0.151196 0.353404 0.034510
v 0.067289 0.353404 0.139727
v -0.067289 0.353404 0.139727
v -0.151196 0.353404 0.034510
v -0.121250 0.353404 -0.096694
v -0.000000 0.610596 0.000000
f 2/1/1 3/2/1 1/3/1
f 4/4/2 5/5/2 3/2/2
f 6/6/3 7/7/3 5/5/3
f 8/8/4 9/9/4 7/7/4
f 10/10/5 11/11/5 9/9/5
f 4/4/6 17/12/6 6/6/6
f 12/13/7 13/14/7 11/11/7
f 14/15/8 1/16/8 13/14/8
f 9/17/9 11/18/9 3/19/9
f 16/20/10 21/21/10 22/22/10
f 10/10/11 20/23/11 12/13/11
f 2/1/12 15/24/12 4/4/12
f 6/6/13 18/25/13 8/8/13
f 12/13/14 21/21/14 14/15/14
f 8/8/15 19/26/15 10/10/15
f 14/15/16 16/20/16 2/27/16
f 20/23/17 19/26/17 22/28/17
f 18/25/18 17/12/18 22/29/18
f 15/24/19 16/30/19 22/31/19
f 21/21/20 20/23/20 22/32/20
f 19/26/21 18/25/21 22/33/21
f 17/12/22 15/24/22 22/34/22
f 2/1/1 4/4/1 3/2/1
f 4/4/2 6/6/2 5/5/2
f 6/6/3 8/8/3 7/7/3
f 8/8/4 10/10/4 9/9/4
f 10/10/5 12/13/5 11/11/5
f 4/4/6 15/24/6 17/12/6
f 12/13/7 14/15/7 13/14/7
f 14/15/8 2/27/8 1/16/8
f 13/35/9 1/36/9 11/18/9
f 1/36/9 3/19/9 11/18/9
f 3/19/9 5/37/9 7/38/9
f 7/38/9 9/17/9 3/19/9
f 10/10/11 19/26/11 20/23/11
f 2/1/12 16/30/12 15/24/12
f 6/6/13 17/12/13 18/25/13
f 12/13/14 20/23/14 21/21/14
f 8/8/15 18/25/15 19/26/15
f 14/15/16 21/21/16 16/20/16`;

