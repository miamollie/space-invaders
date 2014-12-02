
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

    console.log("Fleet on object creation: " + this.fleet);
}



Game.prototype.initialise = function() {


    //Initialise the game
    this.game_screen = new GameScreen();
    document.body.appendChild(this.game_screen.dom_element);
    this.launcher =  new Launcher(this.game_screen);
    this.fleet = new Fleet(this.game_screen);

    console.log("Fleet on initialise: " + this.fleet);

    var bunkerX = 250;
    var bunkerY = 450; //TODO associate bunkerX and bunkerY width of game_screen
    for( var i = 0; i < 3; i++ ){
        this.bunkers.push(new Bunker(this.game_screen, bunkerX, bunkerY));
        bunkerX += 250;
    }
};


Game.prototype.update = function() {
    console.log("Fleet on update: " + this.fleet);

    var now = 0;
    var oldTime = 0;
    var oldIconTime = 0;
    var timeDif = 0;
    var iconTimeDif = 0;

    //set up the controls
    this.onkeydown = function(e){
        //make launcher go right
        if( e.keyCode == 68 ){
            this.launcher.goRight();

            //make launcher go left
        } else if( e.keyCode == 65 ){
            this.launcher.goLeft();

            //launcher fires a missile
        }  else if( e.keyCode == 32 ){
            this.game_screen.launcherMissiles.push(launcher.fireMissile());
        }
    }



    // Move the fleet
    this.fleet.move();


    //Move the launcher missiles
    for( var i = 0; i < this.game_screen.launcherMissiles.length; i++ ){
        this.game_screen.launcherMissiles[i].goUp();

        //if a missile goes off the screen remove it from the array and hide it somehow
        if( this.game_screen.launcherMissiles[0].getY() <= 0 ){
            this.game_screen.dom_element.removeChild(this.game_screen.launcherMissiles[0].dom_element);
            this.game_screen.launcherMissiles.shift();
        }

    }


    // Randomly Fire - at a frequency dictated by the state of the game
    now = Date.now(); // new date with number of milliseconds since 1970
    timeDif = now - oldTime;
    if( timeDif > fleet.missileFrequency ){
        this.game_screen.invaderMissiles.push(fleet.randomFire());
        oldTime = now; //reset oldTime to now
    }


    // Move the invader bombs down
    for( var i = 0; i < this.game_screen.invaderMissiles.length; i++ ){
        this.game_screen.invaderMissiles[i].goDown();
        //if a missile goes off the screen remove it from the array and hide it somehow
        if( this.game_screen.invaderMissiles[0].getY() >= this.game_screen.height() ){
            this.game_screen.dom_element.removeChild(this.game_screen.invaderMissiles[0].dom_element);
            this.game_screen.invaderMissiles.shift();
        }
    }




    // check for invader hits
    if( this.game_screen.launcherMissiles.length > 0 ){
        for( var i = 0; i < this.game_screen.launcherMissiles.length; i++ ){
            if( this.fleet.overlaps(this.game_screen.launcherMissiles[i]) ){
                this.game_screen.dom_element.removeChild(this.game_screen.launcherMissiles[i].dom_element); //Delete the missile from the screen
                this.game_screen.launcherMissiles.splice(i, 1); //remove the missile from the array
            }
        }
    }

    // check for bunker hits
    if( this.game_screen.launcherMissiles.length > 0 ){
        for( var i = 0; i < this.game_screen.launcherMissiles.length; i++ ){
            for( var j = 0; j < bunkers.length; j++ ){
                if( this.bunkers[j].overlaps(this.game_screen.launcherMissiles[i]) ){
                    this.game_screen.dom_element.removeChild(this.game_screen.launcherMissiles[i].dom_element); //Delete the missile from the screen
                    this.game_screen.launcherMissiles.splice(i, 1);
                }
            }
        }
    }


    // check for launcher hits
    if( this.game_screen.invaderMissiles.length > 0 ){
        for( var i = 0; i < this.game_screen.invaderMissiles.length; i++ ){
            //Check for launcher hits
            if( this.launcher.overlaps(this.game_screen.invaderMissiles[i]) ){
                this.game_screen.dom_element.removeChild(this.game_screen.invaderMissiles[i].dom_element); //Delete the missile from the screen
                this.game_screen.invaderMissiles.splice(i, 1); // Remove the missile from the array
            }

            //Check for bunker hits
            for( var j = 0; j < bunkers.length; j++ ){
                if( this.bunkers[j].overlaps(this.game_screen.invaderMissiles[i]) ){
                    this.game_screen.dom_element.removeChild(this.game_screen.invaderMissiles[i].dom_element); //Delete the missile from the screen
                    this.game_screen.invaderMissiles.splice(i, 1);

                }
            }
        }
    }


    //Make the invaders Change appearance -  TODO, should this be a function of fleet, whatever the case there is definitely a better way of doing this... but I'm sleepy now
    iconTimeDif = now - oldIconTime;
    if( iconTimeDif > fleet.changeIcon ){
        fleet.animate();
        oldIconTime = now;
    }


    if( (this.launcher.lives <= 0) || (this.fleet.invaders.length == 0) || (this.fleet.getY() + this.fleet.height() > this.game_screen.threshold) ){
        //End the game
        this.end();

    }

};




Game.prototype.play = function() {

    //this is the game God thingy mabobby
    this.clock = setInterval( this.update, 25 );
    console.log("Fleet on play: " + this.fleet);

};

Game.prototype.pause = function() {
    //stop the clock
    clearInterval(this.clock);
    //stop the controls
};

Game.prototype.end = function() {
    //Pause the game
    this.pause();


    //remove any remaining invaders

    //print a Game Over message with win/lose message
};









