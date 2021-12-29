/*
player 
has three different weapons 
moves 360 degrees
*/

class PLAYER{
    coordinate;  
    camera_coordinates;
    lookingto;
    equipped_gun;
    guncoordinates;
    health;
    max_health;
    state;
    height;
    movement_radius;
    movement_speed;
    fire_ready;
    fire_state;
    selected_enemy;
    healthbar;
    move_direction;
    target_coordinate;
    target_lookingto;
    player_movement_center;
    hit;
    max_hit;
    heal;
    max_heal;
    constructor(x,y,z,gun,healthbar){
        this.coordinate=[x,y,z];
        this.lookingto=[0,0,-1];
        this.guncoordinates=[1.2,-0.1,0.2];
        this.camera_coordinates=[0,0,0];
        this.equipped_gun=gun;
        this.max_health=100;
        this.health=this.max_health;
        this.height=3;
        this.movement_radius=120;
        this.movement_speed=0.9;
        this.fire_ready=true;
        this.fire_state=false;
        this.laser=new LASER([0,0,0],[0,0,0],[1,0,0]);
        this.laser.create_array_buffer_laser([0,0,0],[0,0,0]);
        this.selected_enemy=null;
        this.move_direction=[0,0,0];
        this.healthbar=healthbar;
        this.target_coordinate=[0,0,0];
        vec3.copy(this.target_coordinate,this.coordinate);
        this.target_lookingto=[0,0,-1];
        this.player_movement_center=[0,7,0];
        this.hit=0;
        this.heal=0;
        this.max_hit=player_max_hit;
        this.max_heal=player_max_heal;
    }

    ground_check(){
        var y_coordinate=this.coordinate[1]-this.height;
        if(y_coordinate<0){
            this.coordinate[1]=this.height;
        }
    }
    bound_check(){
        var dist=vec3.distance(this.coordinate,this.player_movement_center);
        if(dist>this.movement_radius){
            return false;
        }
        return true;
    }
    //deal damage to the player when enemy attack
    damage_player(damage){
        if(game.invincible_mode==true){
            return;
        }
        this.health-=damage;
        let percentage=(this.health)/this.max_health;
        if(percentage<0){
            percentage=0;
        }
        this.healthbar.edit_array_buffer(percentage);//change healthbar
        
        if(damage>0){
            this.hit=this.max_hit;//activate hit effect
        }
    }
    //heal player when player kills enemies
    heal_player(id){
        if(id==0){
             this.health+=blue_heal;
        }else if(id==1){
             this.health+=yellow_heal;
        }else if(id==2){
             this.health+=green_heal;
        }
        if(this.health>this.max_health){
            this.health=this.max_health;
        }
        let percentage=(this.health)/this.max_health;
        if(percentage<0){
            percentage=0;
        }
        this.heal=this.max_heal; //activate heal effect
        this.healthbar.edit_array_buffer(percentage);//change health bar

    }

}





function draw_gun(gl,player,gun,program,identitymatrix,yaw,pitch,w,v,p,world,view,projection,pos,color){
    if(player.equipped_gun.id==0){
        draw_assault_rifle(gl,player,gun,identitymatrix,yaw,pitch,w,v,p,world,view,projection,pos,color);
    }else if(player.equipped_gun.id==1){
        draw_sniper_rifle(gl,player,gun,identitymatrix,yaw,pitch,w,v,p,world,view,projection,pos,color,program);
    }else if(player.equipped_gun.id==2){
        draw_rocket_launcher(gl,player,gun,identitymatrix,yaw,pitch,w,v,p,world,view,projection,pos,color);
    }
}

