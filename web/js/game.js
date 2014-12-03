
function Game(){

    //Initial setup
    this.score = 0;
    this.clock = null;
    this.launcher = null;
    this.fleet = null;
    this.missile =  null;
    this.bunkers = [];
    this.game_screen = null;
    this.invaderMissiles = [];
    this.launcherMissiles = [];

}



//Initialise the game
Game.prototype.initialise = function() {

    this.game_screen = new GameScreen();
    document.body.appendChild(this.game_screen.dom_element);
    this.launcher =  new Launcher(this.game_screen);
    this.fleet = new Fleet(this.game_screen);

    var bunkerX = 250;
    var bunkerY = 450; //TODO associate bunkerX and bunkerY width of game_screen
    for( var i = 0; i < 3; i++ ){
        this.bunkers.push(new Bunker(this.game_screen, bunkerX, bunkerY));
        bunkerX += 250;
    }
};




//set up the controls
Game.prototype.onkeydown = function(e) {
    //make launcher go right
    if( e.keyCode == 68 ){
        this.launcher.goRight();

        //make launcher go left
    } else if( e.keyCode == 65 ){
        this.launcher.goLeft();

        //launcher fires a missile
    }  else if( e.keyCode == 32 ){
        this.launcherMissiles.push(this.fireMissile(this.launcher));
    }
}



//Fire an object from your current position
Game.prototype.fireMissile = function( firingPlayer) {
    var missile = new Missile(this.game_screen);
    missile.setX(firingPlayer.getX() + ((firingPlayer.width()/2) - (missile.width()/2) ));
    missile.setY(firingPlayer.getY());
    return missile;
}



//Update the game state
Game.prototype.update = function() {

    var now = 0;
    var oldTime = 0;
    var oldIconTime = 0;
    var timeDif = 0;
    var iconTimeDif = 0;


    // Move the fleet
    this.fleet.move();


    // //Move the launcher missiles
    for( var i = 0; i < this.launcherMissiles.length; i++ ){
        this.launcherMissiles[i].goUp();

        //if a missile goes off the screen remove it from the array and hide it somehow
        if( this.launcherMissiles[0].getY() <= 0 ){
            this.game_screen.dom_element.removeChild(this.launcherMissiles[0].dom_element);
            this.launcherMissiles.shift();
        }

    }


    // Randomly Fire - at a frequency dictated by the state of the game
    now = Date.now(); // new date with number of milliseconds since 1970
    timeDif = now - oldTime;
    if( timeDif > this.fleet.missileFrequency ){
        this.invaderMissiles.push(this.fleet.randomFire());
        oldTime = now; //reset oldTime to now
    }


    // Move the invader bombs down
    for( var i = 0; i < this.invaderMissiles.length; i++ ){
        this.invaderMissiles[i].goDown();
        //if a missile goes off the screen remove it from the array and hide it somehow
        if( this.invaderMissiles[0].getY() >= this.game_screen.height() ){
            this.game_screen.dom_element.removeChild(this.invaderMissiles[0].dom_element);
            this.invaderMissiles.shift();
        }
    }




    // check for invader hits
    if( this.launcherMissiles.length > 0 ){
        for( var i = 0; i < this.launcherMissiles.length; i++ ){
            if( this.fleet.overlaps(this.launcherMissiles[i]) ){
                this.game_screen.dom_element.removeChild(this.launcherMissiles[i].dom_element); //Delete the missile from the screen
                this.launcherMissiles.splice(i, 1); //remove the missile from the array
            }
        }
    }

    // check for bunker hits
    if( this.launcherMissiles.length > 0 ){
        for( var i = 0; i < this.launcherMissiles.length; i++ ){
            for( var j = 0; j < this.bunkers.length; j++ ){
                if( this.bunkers[j].overlaps(this.launcherMissiles[i]) ){
                    this.game_screen.dom_element.removeChild(this.launcherMissiles[i].dom_element); //Delete the missile from the screen
                    this.launcherMissiles.splice(i, 1);
                }
            }
        }
    }


    // check for launcher hits
    if( this.invaderMissiles.length > 0 ){
        for( var i = 0; i < this.invaderMissiles.length; i++ ){
            //Check for launcher hits
            if( this.launcher.overlaps(this.invaderMissiles[i]) ){
                this.game_screen.dom_element.removeChild(this.invaderMissiles[i].dom_element); //Delete the missile from the screen
                this.invaderMissiles.splice(i, 1); // Remove the missile from the array
            }

            //Check for bunker hits
            for( var j = 0; j < bunkers.length; j++ ){
                if( this.bunkers[j].overlaps(this.invaderMissiles[i]) ){
                    this.game_screen.dom_element.removeChild(this.invaderMissiles[i].dom_element); //Delete the missile from the screen
                    this.invaderMissiles.splice(i, 1);

                }
            }
        }
    }


    //Make the invaders Change appearance -  TODO, should this be a function of fleet, whatever the case there is definitely a better way of doing this... but I'm sleepy now
    iconTimeDif = now - oldIconTime;
    if( iconTimeDif > this.fleet.changeIcon ){
        this.fleet.animate();
        oldIconTime = now;
    }


    if( (this.launcher.lives <= 0) || (this.fleet.invaders.length == 0) || (this.fleet.getY() + this.fleet.height() > this.game_screen.threshold) ){
        //End the game
        this.end();

    }

};



Game.prototype.play = function() {

    //this is the game God thingy mabobby
    var t = this;
    this.clock = setInterval( function(){ t.update(); }, 25 );


};

Game.prototype.pause = function() {
    //stop the clock
    clearInterval(this.clock);

    //stop the controls -  somehow overwrite onkeydown() function?
};

Game.prototype.end = function() {
    //Pause the game
    this.pause();

    //print a Game Over message with win/lose message use ReplaceChild
};









