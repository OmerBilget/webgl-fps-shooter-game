//main file that game runs on all event handlers handled here
var delay;

var moving = false;
var move_direction = [1, 0, 0];

var tmp_vector = [0, 0, 0];
var rotateMatrix = mat4.create();

var lock;

var elem = document.documentElement;
//-----------------------------------------------------------------//
//object declarations


//game 
var game = new GAME();


//weapons
var assault_rifle = new ASSAULT_RIFLE([1.5, -0.8, -5.6], [0, deg2rad(180), 0], 0.3, [1.5, -0.8, -5], 0,rifle_damage, rifle_cooldown, rifle_max_ammo, rifle_bullet_life, rifle_bullet_speed, rifle_ammo_create_location, rifle_spread, rifle, rifleMTL);
var sniper_rifle = new SNIPER_RIFLE([1.5, -0.8, -5.6], [0, 0, 0], 0.5, [2.0, -0.8, -3], 1, sniper_damage, sniper_cooldown,sniper_max_ammo, sniper_bullet_life, sniper_bullet_speed, sniper_ammo_create_location, sniper_spread, sniperOBJ, sniperMTL);
var rocket_launcher = new ROCKET_LAUNCHER([1.5, -0.8, -5.6], [0, 0, 0], 1.5, [2.5, 0, -4.7], 2,rocket_launcher_damage, rocket_launcher_cooldown, rocket_launcher_max_ammo, rocket_launcher_bullet_life, rocket_launcher_bullet_speed, rocket_launcher_ammo_create_location, rocket_launcher_spread, rocketLauncherOBJ, rocketLauncherMTL);
var gun_list = [assault_rifle, sniper_rifle, rocket_launcher];
var selected_gun_index = 0;

var deltatime;

//bullets

var player_bullet_assault_rifle = new Bullet(1, 0, 0, 0, bulletObj, assault_rifle.damage,1); //assault rifle bullet
var player_bullet_sniper_rifle = new Bullet(1, 0, 0, 1, bulletObj, sniper_rifle.damage,4); //sniper rifle bullet
var enemy_bullet_blue = new Bullet(0, 0.8, 1, 2, bulletObj, blue_damage,1); //blue enemy bullet
var player_rocket = new ROCKET(rocketOBJ, rocketMTL, 0, 1, 3.7, 0.1, 5, 0.15, 0.33, 25);
var enemy_rocket = new ROCKET(rocketOBJ, rocketenemyMTL, 1, 1, 1.2, 0.02, 3, 0.11, 0.2, 50);

//pool 
var pool = new POOL(60, player_bullet_assault_rifle, player_bullet_sniper_rifle, enemy_bullet_blue);

//enemies
var blue = new BLUE(blue_cooldown, blue_max_bullet, blue_move_time, blue_speed, blue_rotate_speed, enemy_bullet_blue, blue_scale, blue_damage, blue_max_health);
var yellow = new YELLOW(yellow_cooldown, yellow_max_bullet, yellow_move_time, yellow_speed, yellow_rotate_speed, enemy_bullet_blue, yellow_scale, yellow_damage, yellow_max_health);
var green = new GREEN(green_cooldown, green_max_bullet, green_move_time, green_speed, green_rotate_speed, enemy_bullet_blue, green_scale, green_damage, enemy_rocket, green_max_health);

//for test new features to activate enemy_list[0]=e1 active_length_enemy_list=1

//var e1=new BLUE_INSTANCE(blue.max_health,blue.max_health,[1,5,0],[0,0,0],blue,0);
//var e2=new YELLOW_INSTANCE(yellow.max_health,yellow.max_health,[10,20,10],[0,0,0],yellow,1);
//var e3=new GREEN_INSTANCE(green.max_health,green.max_health,[20,10,-20],[0,0,0],green,2);

//static array for memory efficiency
var enemy_list = new Array(15).fill(undefined, 0, 10);
var active_length_enemy_list = 0;
var enemy_count = 0;

//enemy_list.push(e1);
//enemy_list.push(e2);
//enemy_list.push(e3);

var mouse_move_timer = 0;


//environment
const scale_constant = 2.3;
const z = 0.9;
var sphere = new DOME([0, 0, 0], 300 * scale_constant, [1, 0.05, 0], [0.0, 0.0, 0.3]);
var ground = new GROUND([0, 0, 0], 2, [0.5, 0.3, 0], [0, 0, 0]);
var sun = new SUN([150 * scale_constant, 50 * scale_constant, 200 * scale_constant], 20 * scale_constant, [1, 0.4, 0.1]);
var planet = new PLANET([100 * z, 300, -300 * z], [-10, 0, 0], 100);
var moon = new MOON([0, 200, 0], [0, 0, 0], 21, [0.4, 0.4, 0.4], planet, 2, 0.0007, 220, 0.002);


//portal
var portal = new PORTAL([0, 100, 0], 2, blue, yellow, green);



//ui
var player_health_bar = new PLAYER_HEALTH_BAR(-0.95, -0.35, 0.1, 0.01, [1, 0, 0], [0, 1, 0], 0.8);
var cross = new CROSS();
var cross_sniper = new CROSS_SNIPER();
var figure=new FIGURE([-4,1.5,-8],[0,0,0],0.09,figureOBJ,figureMTL);
var press_enter_sign=new PRESS_ENTER_SIGN([2.0,0,-4],[0,0,0],0.07,[1,0,0]);
var hit_box=new HIT();
//player
var player = new PLAYER(0, 7, 0, assault_rifle, player_health_bar);



//---------------------------------------------------------//

var webgl;
var fullscreen_mode = false;
//mouse move event variables

var previous_mouse_coordinates = [0, 0];
var mouse_coordinates = [0, 0];
var pitch = 0;
var p_limit = [-30, 85];
var yaw = 0;
var rotate_amount = 0.2;//sensitivity

//bullet array
//static size for memory efficiency change active size on add or delete elements
var bullet_array_player_rifle = new Array(60).fill(undefined, 0, 60);
var active_length_player_rifle = 0;
var bullet_array_player_sniper_rifle = new Array(20).fill(undefined, 0, 20);
var active_length_player_sniper = 0;
var bullet_array_enemy_blue = new Array(250).fill(undefined, 0, 250);
var active_length_enemy_rifle = 0;
var rocket_array_player = new Array(20).fill(undefined, 0, 20);
var active_length_player_rocket = 0;
var rocket_array_enemy = new Array(20).fill(undefined, 0, 20);
var active_length_enemy_rocket = 0;


var p2 = new Array(16);//temporary projection matrix for resize events





window.onload = function () {

    //setup canvas
    var canvas = document.getElementById("my_canvas");
    canvas_pointer = canvas;
    var gl = canvas.getContext('webgl');
    if (!gl) {
        throw new Error("Webgl is not supported");
    }

    //add player input
    canvas.addEventListener("mousemove", mousemove);
    canvas.addEventListener("mousedown", mouseclick);
    canvas.addEventListener("mouseup", shutdown);

    //canvas.width=window.screen.width;
    //canvas.height=window.screen.height;
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    lock = canvas;


    //mouse pointer lock 
    canvas.requestPointerLock = canvas.requestPointerLock ||
        canvas.mozRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock ||
        document.mozExitPointerLock;

    
    var keystate = new Array(10);
    for (var i = 0; i < 10; i++) {
        keystate[i] = false;
    }


    window.addEventListener('keydown', function (e) {
        if (e.key == 'w') {
            keystate[0] = true;
        }
        if (e.key == 'a') {
            keystate[1] = true;
        }
        if (e.key == 's') {
            keystate[2] = true;
        }
        if (e.key == 'd') {
            keystate[3] = true;
        }
    }, true);
    
    window.addEventListener('keyup', function (e) {
        if (e.key == 'w') {
            keystate[0] = false;
        }
        if (e.key == 'a') {
            keystate[1] = false;
        }
        if (e.key == 's') {
            keystate[2] = false;
        }
        if (e.key == 'd') {
            keystate[3] = false;
        }
    }, true);


   
    //set webgl canvas
    gl.viewport(0, 0, canvas.width, canvas.height);
    webgl = gl;


    //create shaders
    var program = initShader(gl, vertexShaderText, fragmentShaderText);
    var program2d = initShader(gl, vertexShader2d, fragmentShader2D);
    var diffuseLightingProgram = initShader(gl, vertexShaderDF, fragmentShaderDF);
    var planetProgram = initShader(gl, vertexShaderPlanetDF, fragmentShaderPlanetDF);
    var lunarProgram = initShader(gl, vertexShaderMoonDF, fragmentShaderMoonDF);
    var portalProgram = initShader(gl, vertexShaderPortal, fragmentShaderPortal);
    var hitProgram=initShader(gl,vertexShaderhit2d,fragmentShaderhit2D);
    var figureProgram=initShader(gl,vertexShaderfigureDF,fragmentShaderFigureDF);


    //set programs
    sphere.program = program;
    ground.program = program;
    sun.program = program;
    planet.program = planetProgram;
    moon.program = lunarProgram;

    blue.program = program;
    yellow.program = program;
    green.program = program;

    portal.program = portalProgram;

    assault_rifle.program = program;
    sniper_rifle.program = program;
    rocket_launcher.program = program;

    player_bullet_assault_rifle.program = program;
    player_bullet_sniper_rifle.program = program;
    enemy_bullet_blue.program = program;
    player_rocket.program = program;
    figure.program=figureProgram;
    press_enter_sign.program=figureProgram;
    hit_box.program=hitProgram;


    //setup multiplication matrices

    //P*V*W

    //for every different shader there must be unique uniform
    //get locations and send as parameters
    var world = gl.getUniformLocation(program, 'matrixWorld');
    var view = gl.getUniformLocation(program, 'matrixView');
    var projection = gl.getUniformLocation(program, 'matrixProjection');

    var pos = gl.getAttribLocation(program, 'vertPosition');
    var color = gl.getAttribLocation(program, 'vertColor');

    var pos2d = gl.getAttribLocation(program2d, 'vertPosition');
    var color2d = gl.getAttribLocation(program2d, 'vertColor');

    var worldDF = gl.getUniformLocation(diffuseLightingProgram, 'matrixWorld');
    var viewDF = gl.getUniformLocation(diffuseLightingProgram, 'matrixView');
    var projectionDF = gl.getUniformLocation(diffuseLightingProgram, 'matrixProjection');
    var normalMatrixDF = gl.getUniformLocation(diffuseLightingProgram, 'matrixNormal');

    var posDF = gl.getAttribLocation(diffuseLightingProgram, 'vertexPosition');
    var colorDF = gl.getAttribLocation(diffuseLightingProgram, 'vertexColor');
    var lightDirectionDF = gl.getUniformLocation(diffuseLightingProgram, 'light_direction');
    var lightColorDF = gl.getUniformLocation(diffuseLightingProgram, 'lightColor');
    var normalLocationDF = gl.getAttribLocation(diffuseLightingProgram, 'Normal');

    var worldPlanetDF = gl.getUniformLocation(planetProgram, 'matrixWorld');
    var viewPlanetDF = gl.getUniformLocation(planetProgram, 'matrixView');
    var projectionPlanetDF = gl.getUniformLocation(planetProgram, 'matrixProjection');
    var normalMatrixPlanetDF = gl.getUniformLocation(planetProgram, 'matrixNormal');

    var posPlanet = gl.getAttribLocation(planetProgram, 'vertexPosition');
    var colorPlanet = gl.getAttribLocation(planetProgram, 'vertexColor');
    var lightDirectionPlanet = gl.getUniformLocation(planetProgram, 'light_direction');
    var lightColorPlanet = gl.getUniformLocation(planetProgram, 'lightColor');
    var normalLocationPlanet = gl.getAttribLocation(planetProgram, 'Normal');

    var worldLunarDF = gl.getUniformLocation(lunarProgram, 'matrixWorld');
    var viewLunarDF = gl.getUniformLocation(lunarProgram, 'matrixView');
    var projectionLunarDF = gl.getUniformLocation(lunarProgram, 'matrixProjection');
    var normalMatrixLunarDF = gl.getUniformLocation(lunarProgram, 'matrixNormal');
    var normalLocation = gl.getAttribLocation(lunarProgram, 'Normal');

    var posLunar = gl.getAttribLocation(lunarProgram, 'vertexPosition');
    var colorLunar = gl.getAttribLocation(lunarProgram, 'vertexColor');
    var lightDirectionLunar = gl.getUniformLocation(lunarProgram, 'light_direction');
    var lightlocationLunar = gl.getUniformLocation(lunarProgram, 'light_location');
    var lightColorLunar = gl.getUniformLocation(lunarProgram, 'lightColor');
    var distLunar = gl.getUniformLocation(lunarProgram, 'center_dist');

    var worldPortal = gl.getUniformLocation(portalProgram, 'matrixWorld');
    var viewPortal = gl.getUniformLocation(portalProgram, 'matrixView');
    var projectionPortal = gl.getUniformLocation(portalProgram, 'matrixProjection');

    var posPortal = gl.getAttribLocation(portalProgram, 'vertPosition');
    var colorPortal = gl.getAttribLocation(portalProgram, 'vertColor');

    var center = gl.getUniformLocation(portalProgram, 'center');
    var portalRatio = gl.getUniformLocation(portalProgram, 'ratio');

    var poshit=gl.getAttribLocation(hitProgram,'vertexPosition');
    var perhit=gl.getUniformLocation(hitProgram,'percentage');
    var colorhit=gl.getUniformLocation(hitProgram,'color');
    var worldfigureDF = gl.getUniformLocation(figureProgram, 'matrixWorld');
    var viewfigureDF = gl.getUniformLocation(figureProgram, 'matrixView');
    var projectionfigureDF = gl.getUniformLocation(figureProgram, 'matrixProjection');
    var normalMatrixfigureDF = gl.getUniformLocation(figureProgram, 'matrixNormal');

    var posfigureDF = gl.getAttribLocation(figureProgram, 'vertexPosition');
    var colorfigureDF = gl.getAttribLocation(figureProgram, 'vertexColor');
    var lightDirectionfigureDF = gl.getUniformLocation(figureProgram, 'light_direction');
    var lightColorfigureDF = gl.getUniformLocation(figureProgram, 'lightColor');
    var normalLocationfigureDF = gl.getAttribLocation(figureProgram, 'Normal');

    //create buffer

    sphere.createBufferData(gl);
    sun.createBufferData(gl);
    assault_rifle.createBufferData(gl);
    sniper_rifle.createBufferData(gl);
    sniper_rifle.createBufferDataReloadSniper(gl);
    rocket_launcher.createBufferData(gl);
    rocket_launcher.createBufferDataRocketNoTarget(gl);
    rocket_launcher.createBufferDataRocketReload(gl);

    player_bullet_assault_rifle.createBufferData(gl);
    player_bullet_sniper_rifle.createBufferData(gl);
    enemy_bullet_blue.createBufferData(gl);

    ground.createBufferData(gl);

    blue.createBufferData(gl);
    yellow.createBufferData(gl);
    green.createBufferData(gl);

    portal.createBufferData(gl);
    planet.createBufferData(gl);
    moon.createBufferData(gl);

    cross.createBufferData(gl);
    cross_sniper.createBufferData(gl);
    player_health_bar.createBufferData(gl);
    figure.createBufferData(gl);
    press_enter_sign.createBufferData(gl);
    hit_box.createBufferData(gl);

    /*
    var w=new Float32Array(16) ;
    var v=new Float32Array(16) ;
    var p=new Float32Array(16) ;
    var n=new Float32Array(16) ;
    */

    var w = new Array(16);
    var v = new Array(16);
    var p = new Array(16);
    var n = new Array(16);

    //perspective matrix setup
    mat4.perspective(p, deg2rad(55), canvas.width / canvas.height, 0.1, 1000.0);
    

    var identitymatrix = new Float32Array(16);
    mat4.identity(identitymatrix);

     
    var partition = 0; //divide bullet collision to two frames

    //render
    var prev = 0;
    delay = 0;
    var rotation = vec3.create();
    const t = 1000 / 60;
    game.state=0; 

    var loop = function (now) {


        //apply rotation player
        deltatime = now - prev;
        deltatime /= t;//divided by t because values calculated for 60 fps this way 60 fps deltatime=1 on higher or lower fps this value changes
        prev = now;

        if(player.health<0){
            game.end_game(pool,player);
            keystate[0]=false;
            keystate[1]=false;
            keystate[2]=false;
            keystate[3]=false;

        }
        if (game.state == 1) {
            
            move_player(keystate, player, rotation);
            player.ground_check();

            if (player.fire_state == true) {
                fire_bullet();
            }

            if (player.equipped_gun.delay > 0) {
                player.equipped_gun.delay -= deltatime*t;
            }
            if (player.equipped_gun.delay <= 0) {
                player.equipped_gun.delay = 0;
                player.fire_ready = true;
            }
            if(rocket_launcher.delay>0){
                rocket_launcher.delay-=deltatime*t;
            }





            //fps rotation calculations 
            if (mouse_move_timer < 5) {
                vec3.copy(player.lookingto, vecz);
                vec3.rotateX(player.lookingto, player.lookingto, origin_vec, deg2rad(pitch));
                vec3.rotateY(player.lookingto, player.lookingto, origin_vec, deg2rad(yaw));
            }


            //================================================================================
            //game logic
            destroy_enemies(enemy_list, portal);

            check_bullet_array_player_rifle(bullet_array_player_rifle, pool);
            update_bullet_array(bullet_array_player_rifle, active_length_player_rifle);

            check_bullet_array_player_sniper(bullet_array_player_sniper_rifle, pool);
            update_bullet_array(bullet_array_player_sniper_rifle, active_length_player_sniper);

            check_bullet_array_enemy(bullet_array_enemy_blue, pool);
            update_bullet_array(bullet_array_enemy_blue, active_length_enemy_rifle);

            check_rocket_array_player(rocket_array_player, pool);
            update_rocket_array(rocket_array_player, active_length_player_rocket);

            check_rocket_array_enemy(rocket_array_enemy, pool);
            update_rocket_array(rocket_array_enemy, active_length_enemy_rocket);

            collision_enemy_rocket(rocket_array_enemy, player);
            enemy_AI(enemy_list, player, bullet_array_enemy_blue, rocket_array_enemy, pool);

            player_bullet_collision_rifle(bullet_array_player_rifle, enemy_list, 3.7, partition);
            player_bullet_collision_sniper(bullet_array_player_sniper_rifle, enemy_list, 8);
            rocket_collision(rocket_array_player, 6, rocket_launcher.damage);

            bullet_collision_rocket_array(bullet_array_player_rifle, rocket_array_enemy, 6, assault_rifle.damage, active_length_player_rifle);
            bullet_collision_rocket_array(bullet_array_player_sniper_rifle, rocket_array_enemy, 6, sniper_rifle.damage, active_length_player_sniper);
            bullet_collision_enemy(bullet_array_enemy_blue, player, 5, blue.damage);

            portal.check_status(enemy_list, deltatime);
            moon.orbit(origin_vec); 



            clearCanvas(gl);


            //=================================================================================
            //render 
            gl.useProgram(program);

            draw_sky(gl, sphere, program, identitymatrix, w, v, p, world, view, projection, pos, color);
            draw_gun(gl, player, player.equipped_gun, program, identitymatrix, yaw, pitch, w, v, p, world, view, projection, pos, color);
            draw_object(gl, sun, program, identitymatrix, w, v, p, world, view, projection, pos, color);
            draw_enemies(enemy_list, player, gl, program, identitymatrix, w, v, p, world, view, projection, pos, color);
            draw_bullet_array(gl, bullet_array_player_rifle, player_bullet_assault_rifle, program, identitymatrix, w, v, p, world, view, projection, pos, color, active_length_player_rifle);
            draw_bullet_array(gl, bullet_array_player_sniper_rifle, player_bullet_sniper_rifle, program, identitymatrix, w, v, p, world, view, projection, pos, color, active_length_player_sniper);
            draw_bullet_array_enemy(gl, bullet_array_enemy_blue, enemy_bullet_blue, program, identitymatrix, w, v, p, world, view, projection, pos, color);
            draw_rocket_array(gl, rocket_array_player, player_rocket, program, identitymatrix, w, v, p, world, view, projection, pos, color, active_length_player_rocket);
            draw_rocket_array(gl, rocket_array_enemy, enemy_rocket, program, identitymatrix, w, v, p, world, view, projection, pos, color, active_length_enemy_rocket);



            draw_player_health_bar(gl, player_health_bar, program2d, pos2d, color2d);
            if (player.equipped_gun.id == 0) {
                draw_cross(gl, cross, program2d, pos2d, color2d);
            } else if (player.equipped_gun.id == 1) {
                draw_cross_sniper(gl, cross_sniper, program2d, pos2d, color2d);
            }




            draw_ground_DF(gl, ground, sun, diffuseLightingProgram, identitymatrix, w, v, p, worldDF, viewDF, projectionDF, normalMatrixDF, posDF, colorDF, normalLocationDF, lightDirectionDF, lightColorDF);

            //draw with alpha enabled
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            if (portal.life > 30 * deltatime) {
                gl.useProgram(portalProgram);

            }
        
            draw_planet(gl, planet, sun, planetProgram, identitymatrix, w, v, p, n, worldPlanetDF, viewPlanetDF, projectionPlanetDF, normalMatrixPlanetDF, posPlanet, colorPlanet, lightDirectionPlanet, lightColorPlanet, normalLocationPlanet);
            draw_moon(gl, moon, sun, lunarProgram, identitymatrix, w, v, p, n, worldLunarDF, viewLunarDF, projectionLunarDF, normalMatrixLunarDF, posLunar, colorLunar, normalLocation, lightDirectionLunar, lightColorLunar, lightlocationLunar, distLunar);
            draw_portal(gl, portal, portalProgram, identitymatrix, w, v, p, worldPortal, viewPortal, projectionPortal, posPortal, colorPortal, center, portalRatio);
            
            if(player.hit>0){
                draw_hit(gl,player,hit_box,hitProgram,poshit,perhit,(player.hit/player.max_hit),colorhit,hit_box.color);
                player.hit-=1*deltatime;
            }
            if(player.heal>0){
                if(player.hit<=0){
                    draw_hit(gl,player,hit_box,hitProgram,poshit,perhit,(player.heal/player.max_heal),colorhit,hit_box.healcolor);
                }
                player.heal-=1*deltatime;
            }
            mouse_move_timer += 1;
            partition += 1;
            partition %= 2;
        }else if(game.state==0){
            clearCanvas_mainmenu(gl);
            draw_figure_DF(gl,figure,figureProgram,identitymatrix,w,v,p,worldfigureDF,viewfigureDF,projectionfigureDF,normalMatrixfigureDF,posfigureDF,colorfigureDF,normalLocationfigureDF,lightDirectionfigureDF,lightColorfigureDF);
            draw_press_enter_sign_DF(gl,press_enter_sign,figureProgram,identitymatrix,w,v,p,worldfigureDF,viewfigureDF,projectionfigureDF,normalMatrixfigureDF,posfigureDF,colorfigureDF,normalLocationfigureDF,lightDirectionfigureDF,lightColorfigureDF);
            
        }
        requestAnimationFrame(loop);

    }
    requestAnimationFrame(loop);
}


function player_bullet_collision_rifle(bullet_array, enemy_list, range, partition) {
    for (let i = 0; i < active_length_enemy_list; i++) {
        bullet_collision_rifle(bullet_array, enemy_list[i], range, assault_rifle.damage, partition);
    }
}


function player_bullet_collision_sniper(bullet_array, enemy_list, range) {
    for (let i = 0; i < active_length_enemy_list; i++) {
        bullet_collision_sniper(bullet_array, enemy_list[i], range, sniper_rifle.damage);
    }
}





function clearCanvas(gl) {
    gl.clearColor(1.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.disable(gl.BLEND);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
    
}


function clearCanvas_mainmenu(gl) {
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.disable(gl.BLEND);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);
}




//handle other input events
document.addEventListener('keydown', (e) => {
    let name = e.key;
    

    //select gun
    if (name == 'q') {

        selected_gun_index -= 1;
        if (selected_gun_index < 0) {
            selected_gun_index = 2;
        }

        player.equipped_gun = gun_list[selected_gun_index];
        if (player.equipped_gun.delay <= 0) {
            player.fire_ready = true;
        }
        
    } else if (name == 'e') {

        selected_gun_index += 1;
        if (selected_gun_index > 2) {
            selected_gun_index = 0;
        }

        player.equipped_gun = gun_list[selected_gun_index];
        if (player.equipped_gun.delay <= 0) {
            player.fire_ready = true;
        }

    } else if (name == 'r') {
        vec3.add(player.coordinate, player.coordinate, direction_up);
    } else if (name == 't') {
        vec3.add(player.coordinate, player.coordinate, direction_down);
    } else if (name == 'l') {
        lock.requestPointerLock();
    } else if (name == 'f') {
        if (fullscreen_mode == false) {
            fullscreen(lock);

            fullscreen_mode = true;
        } else {
            exitfullscreen();
            fullscreen_mode = false;
        }
    }else if (name == 'p') {
        if(game.peace_mode==false){
            game.peace_mode=true;
            game.peace(portal);
            game.score=0;
            game.killed=0;
        }else{
            game.peace_mode=false;
            game.war(portal);
            
        }
    } else if (name == 'x') {
        if(game.invincible_mode==false){
            game.invincible_mode=true;
        }else{
            game.invincible_mode=false;
        }
    } else if(name==='Enter'){
        if(game.state==0){
            game.start_game(player,player_health_bar);
            game.state=1;
        }
    }
}, false);



function move_player(keystate, player, rotation) {
    mouse_move_timer = 0;
    let move = false;
    if (keystate[0]) { //w
        vec3.copy(player.move_direction, vecz);
        move = true;
    }
    if (keystate[1]) { //a
        vec3.copy(player.move_direction, vecx_negative);
        move = true;
    }
    if (keystate[2]) { //s
        vec3.copy(player.move_direction, vecz_negative);
        move = true;
    }
    if (keystate[3]) { //d
        vec3.copy(player.move_direction, vecx);
        move = true;
    }
    if (move) {
        vec3.rotateY(rotation, player.move_direction, origin_vec, deg2rad(yaw));
        vec3.scale(rotation, rotation, player.movement_speed * deltatime)
        vec3.add(player.coordinate, player.coordinate, rotation);
        if (player.bound_check() == false) {
            vec3.sub(player.coordinate, player.coordinate, rotation);
        }
    }

}





//--------------------------------------------------------------------

function mousemove(e) {

    pitch += (e.movementY * rotate_amount) * -1;
    if (pitch > p_limit[1]) {
        pitch = p_limit[1];
    }
    if (pitch < p_limit[0]) {
        pitch = p_limit[0];
    }
    yaw += (e.movementX * rotate_amount) * -1;
    yaw %= 360;


}

function mouseclick(e) {
    if (player.equipped_gun.id == 0) {
        player.fire_state = true;
    } else if (player.equipped_gun.id == 1) {
        if (player.fire_ready == true) {
            player.fire_state = true;
        }
    } else if (player.equipped_gun.id == 2) {
        if (player.fire_ready == true) {
            player.fire_state = true;
        }
    }
    rotate_amount = 0.6;

}

function shutdown(e) {
    player.fire_state = false;
    rotate_amount = 1;
}






function fire_bullet() {
    if (player.fire_ready == true) {
        if (player.equipped_gun.id == 0) { //assault rifle
            create_bullet_player_rifle(player, bullet_array_player_rifle, player_bullet_assault_rifle, pool);
            player.fire_ready = false;
            player.equipped_gun.delay = player.equipped_gun.cooldown;
        } if (player.equipped_gun.id == 1) { //sniper rifle
            create_bullet_sniper(player, bullet_array_player_sniper_rifle, player_bullet_sniper_rifle, pool);
            player.fire_ready = false;
            player.equipped_gun.delay = player.equipped_gun.cooldown;
        } if ((player.equipped_gun.id == 2)) { //rocket launcher
            var enemy;
            enemy = select_enemy(player, enemy_list);
            if (enemy != null) {
                if (enemy.health > 0 && rocket_launcher.delay<=0) {
                    create_rocket(player, rocket_array_player, player_rocket, enemy, pool);
                    player.fire_ready = false;
                    player.equipped_gun.delay = player.equipped_gun.cooldown;
                    player.selected_enemy = enemy;
                    player.selected_enemy.type.emergency(enemy, player, rocket_array_player[active_length_player_rocket - 1]);
                }
            }
        }
    }
}


function deg2rad(degree) {
    return degree * Math.PI / 180;
}

var line_end = [0, 0, 0];
var line = [0, 0, 0];
var t = [0, 0, 0];
var p2 = [0, 0, 0];

function dist_to_line3D(line_direction, point, line_start, enemy) {

    vec3.copy(line_end, line_start);
    vec3.copy(line, line_direction);
    vec3.scale(line, line, 700);
    vec3.add(line_end, line_start, line);

    vec3.sub(tmp_vector, point, line_start);
    t = vec3.dot(tmp_vector, line_direction);

    vec3.scale(p2, line_direction, t);
    vec3.add(p2, p2, line_start);
    var dist = vec3.distance(point, p2);
    vec3.sub(tmp_vector, enemy.translation, line_start);
    var d = vec3.length(tmp_vector);
    var angle = vec3.angle(tmp_vector, line_direction);
    if (angle < 5 * Math.PI / 180 && dist < 5) {
        return true;
    }
    return false;

}


function select_enemy(player, enemy_list) {

    for (let i = 0; i < active_length_enemy_list; i++) {
        if (dist_to_line3D(player.lookingto, enemy_list[i].translation, player.coordinate, enemy_list[i]) == true) {
            return enemy_list[i];
        }
    }
    return null;
}




//enter fullscreen
function fullscreen(canvas) {
    if (canvas.RequestFullScreen) {
        canvas.RequestFullScreen();
    } else if (canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen();
    } else if (canvas.mozRequestFullScreen) {
        canvas.mozRequestFullScreen();
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
    } else {
        alert("This browser doesn't support fullscreen");
    }
}

// Exit fullscreen
function exitfullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else {
        alert("Exit fullscreen doesn't work");
    }
}


function shift_left_array(array, len) {
    for (let i = 0; i < len - 1; i++) {
        array[i] = array[i + 1];
    }
}
