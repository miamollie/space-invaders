
/* F L E E T */

function Fleet(game_screen, num_invaders){
    //inheritance
    SuperElement.call( this, [0] );

    this.missileFrequency = 5000; // initially invaders fire roughly every 5 seconds

    this.invaders = [];
    this.game_screen = game_screen;


    //make a new DOM element
    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("id", "fleet");

    //add DOM element to the screen
    game_screen.dom_element.appendChild( this.dom_element );


    // Speed that the fleet moves from left to right and down, which will be updated as the invaders are destroyed
    this.setX(20);
    this.setY(5);

    //Speed of movement
    this.offsetX = 0.5;
    this.offsetY = 4;

    //Direction of movement
    this.direction = 1; // starts by going right

    var x = 0;
    var y = 0;
    var fleet_width = 0;

    //Fill up the fleet
    // TTT: inconsistency, why is there no space after if/for. Although i would prefer no space on all of them
    for( var i = 1; i < num_invaders + 1; i++ ){
        this.invaders[i - 1] = new Invader(this,{x: x, y: y});
        x += 81;
        // TTT: inconsistency, why is there no space after if/for. Although i would prefer no space on all of them
        if((i % 10 == 0 ) && (i > 0) ){
            y += 50;
            fleet_width = x;
            x = 0;
        }
    };

    this.setWidth(fleet_width); // set width of the fleet to one row of invaders
    this.setHeight(y); // set height of fleet to one column of invaders

}

//More inheritance stuff, note that "create()" doesn't work on older engines
Fleet.prototype = Object.create(SuperElement.prototype);
Fleet.prototype.constructor = Fleet;

// TTT: indentation, and what the comment about?!
 /*What does a fleet do?*/

//Move the whole fleet
Fleet.prototype.move = function() {
    var current_position = this.getX();
    var right_edge = this.game_screen.width() - this.width();
    var left_edge = 0;

    //if the fleet hits the right edge, go down and change direction
    if( (current_position >= right_edge) && (this.direction == (1)) ){
        this.direction = (-1);
        this.setY(this.getY() + this.offsetY);
    }

    // TTT: inconsistency, why is there no space after if. Although i would prefer no space on all of them
    //if the fleet hits the right edge, go down and change this.direction
    else if( (current_position <= left_edge) && (this.direction == (-1)) ){
        this.direction = 1;
        this.setY(this.getY() + this.offsetY);
    }

    //otherwise keep moving
    else {
        this.setX(this.getX() + (this.offsetX * this.direction));
    }

};

//Among the remaining invaders, randomly fire
Fleet.prototype.randomFire = function() {
    var firingInvader = Math.floor((Math.random() * (this.invaders.length- 1) + 0)); // pick an invader between 0 and number of remaining invaders in fleet
    var missile =  this.invaders[firingInvader].fireMissile();
    return missile;
}



//Deal with a hit
Fleet.prototype.receivedHit = function(otherThing) {
    console.log("hit passed to fleet");

    //now call collision detection on the invaders TODO opptomise to invaders in column x
    // TTT: inconsistency, why is there no space after if/for. Although i would prefer no space on all of them
    for( var i = 0; i < this.invaders.length; i++ ){
        if( this.invaders[i].overlaps(otherThing) ){ // IT'S BROKEN HERE - this *if* never evaluates to true...because the action has already been performed.. so maybe you *have* to write it the opposite way...? It's an infinite loop... you have one call the other call the other...
            //remove that invader
            this.invaders.splice(i, 1);
        }
    }



    //update the width and or height of the fleet if needed
        // if the removed invader was at an end of the longest row update the width; do you keep track of which row is longest?
        //how do we know if it comes off the right or left? Maybe it doesn't matter?
            // this.setWidth();

        //if the invader removed was the last in its column
            // this.setHeight(0);

    //Change the speed the fleet moves at: incremet speed of movement
        //this.offsetX++;// TODO: how much faster does it start moving?
}


