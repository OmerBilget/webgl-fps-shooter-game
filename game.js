//game handler 
//state 0  main menu
//state 1  game

class GAME{
    state;
    score;
    killed;
    peace_mode;
    invincible_mode;
    constructor(){
        this.state=0;
        this.score=0;
        this.killed=0;
        this.peace_mode=false;
        this.invincible_mode=false;
    }

    start_game(player,player_health_bar){
        this.state=1;
        this.score=0;
        this.killed=0;
        player.health=player.max_health;
        player_health_bar.edit_array_buffer(1);
        active_length_enemy_list=0;
    }

    end_game(pool,player){
        this.state=0;
        //delete remaining enemies
        for(let i=0;i<active_length_enemy_list;i++){
            enemy_list[i]=undefined;
        }
        //return to pool remaining bullets
        active_length_enemy_list=0;
        for(let i=0;i<active_length_player_rifle;i++){
            pool.returnplayerbullet_rifle(bullet_array_player_rifle[i]);
            bullet_array_player_rifle[i]=undefined;
        }
        active_length_player_rifle=0;

        for(let i=0;i<active_length_player_sniper;i++){
            pool.returnplayerbullet_sniper(bullet_array_player_sniper_rifle[i]);
            bullet_array_player_sniper_rifle[i]=undefined;
        }
        active_length_player_sniper=0;

        for(let i=0;i<active_length_player_rocket;i++){
            pool.returnrocket_player(rocket_array_player[i]);
            rocket_array_player[i]=undefined;
        }
        active_length_player_rocket=0;
        
        for(let i=0;i<active_length_enemy_rifle;i++){
            pool.returnbullet_enemy(bullet_array_enemy_blue[i]);
            bullet_array_enemy_blue[i]=undefined;
        }
        active_length_enemy_rifle=0;

        for(let i=0;i<active_length_enemy_rocket;i++){
            pool.returnrocket_enemy(rocket_array_enemy[i]);
            rocket_array_enemy[i]=undefined;
        }
        active_length_enemy_rocket=0;
        console.log(pool);
        player.coordinate[0]=0;
        player.coordinate[1]=player.height;
        player.coordinate[2]=0;
        player.health=player.max_health;
        player.fire_state=false;
        player.fire_ready=true;
        player.hit=0;
        player.heal=0;
        player.equipped_gun=assault_rifle;
        assault_rifle.delay=0;
        sniper_rifle.delay=0;
        rocket_launcher.delay=0;
        alert(" killed "+ this.killed.toString() +" enemies "+ "score : "+ this.score.toString());
    }
    kill(id){
       if(id==0){
           this.blue_kill();
       }else if(id==1){
           this.yellow_kill();
       }else if(id==2){
           this.green_kill();
       }
    }
    blue_kill(){
        this.killed+=1;
        this.score+=blue_score;
    }

    yellow_kill(){
        this.killed+=1;
        this.score+=yellow_score;
    }

    green_kill(){
        this.killed+=1;
        this.score+=green_score;
    }
    peace(portal){
        active_length_enemy_list=0;
        portal.enabled=false;
        portal.life=0;
    }
    war(portal){
        portal.enabled=true;
    }
}