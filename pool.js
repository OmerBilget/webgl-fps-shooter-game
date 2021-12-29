//pool object for projectiles if a projectile is end of its life instead of delete and create new return projectile to the pool and reuse 
class POOL{
    bullet_pool_player_rifle=[];
    bullet_pool_player_sniper=[];
    bullet_pool_enemy=[];
    rocket_pool_player=[];
    rocket_pool_enemy=[];
    constructor(poolnumber,rifle_bullet_player,sniper_bullet_player,rifle_bullet_enemy,player_rocket_type,enemy_rocket_type){
        for(let i=0;i<poolnumber;i++){
            this.bullet_pool_player_rifle.push([new Bullet_instance([0,0,0],[0,0,0],1,0,0,100,rifle_bullet_player),true]);
        }
        for(let i=0;i<15;i++){
            this.bullet_pool_player_sniper.push([new Bullet_instance([0,0,0],[0,0,0],1,0,0,100,sniper_bullet_player),true]);
        }
        for(let i=0;i<200;i++){
            this.bullet_pool_enemy.push([new Bullet_instance_target([0,0,0],[0,0,0],1,0,0,undefined,undefined,undefined,undefined,rifle_bullet_enemy),true]);
        }
        for(let i=0;i<5;i++){
            this.rocket_pool_player.push([new ROCKET_INSTANCE([0,0,0],[0,0,0],undefined,undefined,undefined,undefined,undefined,undefined),true]);
        }
        for(let i=0;i<20;i++){
            this.rocket_pool_enemy.push([new ROCKET_INSTANCE_ENEMY([0,0,0],[0,0,0],undefined,undefined,undefined,undefined,undefined,undefined),true]);
        }
    }
    getplayerbullet_rifle(){
        for(let i=0;i<this.bullet_pool_player_rifle.length;i++){
            if(this.bullet_pool_player_rifle[i][1]){
                this.bullet_pool_player_rifle[i][1]=false;
                return this.bullet_pool_player_rifle[i][0];
            }
        }
        alert("error");
        return null;
    }

    returnplayerbullet_rifle(object){
        for(let i=0;i<this.bullet_pool_player_rifle.length;i++){
            if(this.bullet_pool_player_rifle[i][1]==false){
                this.bullet_pool_player_rifle[i][1]=true;
                this.bullet_pool_player_rifle[i][0]=object;
                return;
            }
        }
        alert("error");
        return ;
    }

    getplayerbullet_sniper(){
        for(let i=0;i<this.bullet_pool_player_sniper.length;i++){
            if(this.bullet_pool_player_sniper[i][1]){
                this.bullet_pool_player_sniper[i][1]=false;
                return this.bullet_pool_player_sniper[i][0];
            }
        }
        alert("error");
        return null;
    }

    returnplayerbullet_sniper(object){
        for(let i=0;i<this.bullet_pool_player_sniper.length;i++){
            if(this.bullet_pool_player_sniper[i][1]==false){
                this.bullet_pool_player_sniper[i][1]=true;
                this.bullet_pool_player_sniper[i][0]=object;
                return;
            }
        }
        alert("error");
        return ;
    }

    getbullet_enemy(){
        for(let i=0;i<this.bullet_pool_enemy.length;i++){
            if(this.bullet_pool_enemy[i][1]){
                this.bullet_pool_enemy[i][1]=false;
                return this.bullet_pool_enemy[i][0];
            }
        }
        alert("error");
        return null;
    }

    returnbullet_enemy(object){
        for(let i=0;i<this.bullet_pool_enemy.length;i++){
            if(this.bullet_pool_enemy[i][1]==false){
                this.bullet_pool_enemy[i][1]=true;
                this.bullet_pool_enemy[i][0]=object;
                return;
            }
        }
        alert("error");
        return ;
    }

    getrocket_player(){
        for(let i=0;i<this.rocket_pool_player.length;i++){
            if(this.rocket_pool_player[i][1]){
                this.rocket_pool_player[i][1]=false;
                return this.rocket_pool_player[i][0];
            }
        }
        alert("error 1");
        return null;
    }
    returnrocket_player(object){
        for(let i=0;i<this.rocket_pool_player.length;i++){
            if(this.rocket_pool_player[i][1]==false){
                this.rocket_pool_player[i][1]=true;
                this.rocket_pool_player[i][0]=object;
                return;
            }
        }
        alert("error 2");
        return ;
    }

    getrocket_enemy(){
        for(let i=0;i<this.rocket_pool_enemy.length;i++){
            if(this.rocket_pool_enemy[i][1]){
                this.rocket_pool_enemy[i][1]=false;
                return this.rocket_pool_enemy[i][0];
            }
        }
        alert("error 3");
        return null;
    }
    returnrocket_enemy(object){
        for(let i=0;i<this.rocket_pool_enemy.length;i++){
            if(this.rocket_pool_enemy[i][1]==false){
                this.rocket_pool_enemy[i][1]=true;
                this.rocket_pool_enemy[i][0]=object;
                return;
            }
        }
        alert("error 4");
        return ;
    }

    
    
}