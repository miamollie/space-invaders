
function Game(){

    //Initial setup
    this.score = 0; //tracks player score
    this.gameResult = null; //gameResult == false if player loses or true if player wins
    this.gameScreen = null;

    //Game elements
    this.launcher = null;
    this.fleet = null;
    this.missile =  null;
    this.bunkers = [];
    this.gameScreen = null;
    this.invaderMissiles = [];
    this.launcherMissiles = [];

    //time keeping - TODO this needs to be better
    this.clock = null;
    this.oldTime = 0;
    this.oldIconTime = 0;


    // this.threshold = 400; // TODO what should this value be; if invaders get below this line it's game Over!

}



//Initialise the game
Game.prototype.initialise = function(windowWidth, windowHeight) {

    this.gameScreen = document.getElementById('playScreen');

    this.launcher =  new Launcher(this.gameScreen);
    this.fleet = new Fleet(this.gameScreen);

    //Determine what the bunker margins should be
    var margin;
    var gameScreenWidth = parseFloat(this.gameScreen.parentNode.style.width);

    var bunkerX = 0;
    var bunkerY = 450; //TODO associate bunkerX and bunkerY with width of gameScreen
    for( var i = 0; i < 3; i++ ){
        this.bunkers.push(new Bunker(this.gameScreen, bunkerX, bunkerY));

        margin =  (gameScreenWidth/3 - parseFloat(this.bunkers[0].dom_element.style.width)) / 2;
        this.bunkers[i].dom_element.style.marginLeft = margin + "px";
        this.bunkers[i].dom_element.style.marginRight = margin + "px";

        bunkerX += gameScreenWidth/3;
    }
};



//Fire an object from your current position
Game.prototype.fireMissile = function( firingPlayer) {
    var missile = new Missile(this.gameScreen);
    missile.setX(firingPlayer.getX() + ((firingPlayer.width()/2) - (missile.width()/2) ));
    missile.setY(firingPlayer.getY());
    return missile;
}


// Update and display the new player score
Game.prototype.updateScore = function( ) {
    this.score += 10;
    var scoreHolder = document.getElementById("score");
    scoreHolder.innerHTML =  "SCORE: " + this.score;
}
// Update and display the new player score
Game.prototype.updateLives = function( ) {
    console.log("this.launcher.lives: " + this.launcher.lives);
    var lifeHolder = document.getElementById('lives'); //get the span inside the score h2 tag
    lifeHolder.innerHTML = "LIVES: " + this.launcher.lives;
}


//Update the game state
Game.prototype.update = function() {

    var now = 0;
    var timeDif = 0;
    var iconTimeDif = 0;


    // Move the fleet
    this.fleet.move();


    //Move the launcher missiles
    for( var i = 0; i < this.launcherMissiles.length; i++ ){
        this.launcherMissiles[i].goUp();

        //if a missile goes off the screen remove it from the array and hide it somehow
        if( this.launcherMissiles[0].getY() <= 0 ){
            this.gameScreen.removeChild(this.launcherMissiles[0].dom_element);
            this.launcherMissiles.shift();
        }

    }


    // Randomly Fire - at a frequency dictated by the state of the game
    now = Date.now(); // new date with number of milliseconds since 1970
    timeDif = now - this.oldTime;
    if( timeDif > this.fleet.missileFrequency ){
        this.invaderMissiles.push(this.fleet.randomFire(this.gameScreen));
        this.oldTime = now; //reset oldTime to now
    }


    // Move the invader bombs down
    for( var i = 0; i < this.invaderMissiles.length; i++ ){
        this.invaderMissiles[i].goDown();
        //if a missile goes off the screen remove it from the array and hide it somehow
        if( this.invaderMissiles[0].getY() >= parseFloat(this.gameScreen.parentNode.style.height) ){
            this.gameScreen.removeChild(this.invaderMissiles[0].dom_element);
            this.invaderMissiles.shift();
        }
    }


    // check for invader hits
    for( var i = 0; i < this.launcherMissiles.length; i++ ){
        if( this.fleet.overlaps(this.launcherMissiles[i]) ){
                this.gameScreen.removeChild(this.launcherMissiles[i].dom_element); //Delete the missile from the screen
                this.launcherMissiles.splice(i, 1); //remove the missile from the array
                this.updateScore(); //update the player score and print it to the screen
        }
    }


    // check for bunker hits by launcher
    for( var i = 0; i < this.launcherMissiles.length; i++ ){
        for( var j = 0; j < this.bunkers.length; j++ ){
            if( this.launcherMissiles.length > 0 ){     //This IF statement is necessary because otherwise at line :170 we might splice off the last in the array
                if( this.bunkers[j].overlaps(this.launcherMissiles[i]) ){
                    this.gameScreen.removeChild(this.launcherMissiles[i].dom_element); //Delete the missile from the screen
                    this.launcherMissiles.splice(i, 1);
                }
            }
        }
    }


    // // check for launcher hits
    for( var i = 0; i < this.invaderMissiles.length; i++ ){
        if( this.launcher.overlaps(this.invaderMissiles[i]) ){
            this.gameScreen.removeChild(this.invaderMissiles[i].dom_element); //Delete the missile from the screen
            this.invaderMissiles.splice(i, 1); // Remove the missile from the array
            this.updateLives();
        }

        //Check for bunker hits by invaders
        for( var j = 0; j < this.bunkers.length; j++ ){
            if( this.invaderMissiles.length > 0 ){
                if( this.bunkers[j].overlaps(this.invaderMissiles[i]) ){
                    this.gameScreen.removeChild(this.invaderMissiles[i].dom_element); //Delete the missile from the screen
                    this.invaderMissiles.splice(i, 1);

                }
            }
        }
    }



    //Make the invaders Change appearance -  TODO, should this be a function of fleet, whatever the case there is definitely a better way of doing this... but I'm sleepy now
    iconTimeDif = now - this.oldIconTime;
    if( iconTimeDif > this.fleet.changeIcon ){
        this.fleet.animate();
        this.oldIconTime = now;
    }

    //Player has lost -- end game
    if( (this.launcher.lives <= 0) || (this.fleet.getY() + this.fleet.height() > this.threshold) ){
        //End the game
        this.gameResult = false;
        this.pause();
    }

    //Player has won -- end game
    if( (this.fleet.invaders.length <= 0) ){
        //End the game
        this.gameResult = true;
        this.pause();
    }

    //Display screen for end of game
    var endMessage  =  document.getElementById("endMessage");
    var pauseButton  =  document.getElementById("pause");
    var replayButton  =  document.getElementById("replay");
    console.log("game result: " + game.gameResult);
    if ( game.gameResult!= null ) {
        console.log("here");
        if ( this.gameResult )  {
            endMessage.innerHTML = "Congratulations!";
        } else if ( !this.gameResult ) {
            endMessage.innerHTML = "Boo... you lose.";
        }

        endScreen.style.display = 'block';
        playScreen.style.display = 'none';
        pauseButton.style.visibility = 'hidden';
        replayButton.style.visibility = 'visible'; //replay button becomes visible

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
        var missile = this.fireMissile(this.launcher);
        this.launcherMissiles.push(missile);
    }

}


Game.prototype.play = function() {

    //this is the game God thingy mabobby; it's written as a function like this because of the scope of 'set Interval' TODO - could replace this with Paul Irish's thingy
    var t = this;
    this.clock = setInterval( function(){ t.update(); }, 25 );

};

Game.prototype.pause = function() {
    //stop the clock
    clearInterval(this.clock);
};












