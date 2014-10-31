
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
    this.setY(20);

    //Speed of movement
    this.offsetX = 0.5;
    this.offsetY = 4;

    //Direction of movement
    this.direction = 1; // starts by going right

    var x = -10; //This needs to be -(Invader.MarignLeft)
    var y = 0;
    var fleet_width = 0;

    //Fill up the fleet
    for( var i = 1; i < num_invaders + 1; i++ ){
        this.invaders[i - 1] = new Invader(this, {x: x, y: y});

        x += this.invaders[i-1].outerWidth();

        if( (i % 10 == 0 ) ){
            y += this.invaders[i-1].outerHeight();
            fleet_width = x;
            x = -this.invaders[i-1].marginLeft();
        }
    }

    this.setWidth(fleet_width); // set width of the fleet to one row of invaders
    this.setHeight(y - this.invaders[0].marginBottom()); // set height of fleet to one column of invaders

}

//More inheritance stuff, note that "create()" doesn't work on older engines
Fleet.prototype = Object.create(SuperElement.prototype);
Fleet.prototype.constructor = Fleet;


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



//Fleet's Very own special overlaps methog
Fleet.prototype.overlaps = function(otherThing) {


    //Width Variables
    var element1_x = this.getX();
    var element2_x = otherThing.getX();
    var element1_x_w = this.getX() + this.width();
    var element2_x_w = otherThing.getX() + otherThing.width();

    //Height Variables
    var element1_y = this.getY();
    var element2_y = otherThing.getY();
    var element1_y_h = this.getY() + this.height();
    var element2_y_h = otherThing.getY() + otherThing.height()

    //Hit Location
    var isHitX = false;
    var isHitY = false;
    var xCoordHit = null;
    var yCoordHit = null;

    // x-axis overlap
    if( (element2_x >= element1_x) && (element2_x <= element1_x_w ) ){
        //leftmost coordinate inside
        isHitX = true;
        xCoordHit = element2_x;

    } else if( (element2_x_w >=  element1_x) && (element2_x_w <= element1_x_w ) ){
        //rightmost coordinate inside
        isHitX = true;
        xCoordHit = element2_x_w;
    }

    // y-axis overlap
    if( (element2_y >= element1_y) && (element2_y <= element1_y_h) ){
        //top coordinate inside
        isHitY = true; // element2_y;
        yCoordHit = element2_y_h;

    } else if( (element2_y_h <=  element1_y) && (element2_y_h >= element1_y_h) ){
        //bottom coordinate inside
        isHitY = true;
        yCoordHit = element2_y_h;
    }


    //if Overlapping in the X and Y of the fleet, then check the invaders
    if( isHitY && isHitX ){

        var xRelHit = xCoordHit - this.getX();
        var yRelHit = yCoordHit - this.getY();

        //Keet track of the invader that's been hit
        var invaderHitIndex = null;

        //now call collision detection on the invaders TODO opptomise to invaders in column x
        for( invaderHitIndex = 0; invaderHitIndex < this.invaders.length; invaderHitIndex++ ){

            if( (xRelHit >= this.invaders[invaderHitIndex].getX()) && ( xRelHit  <= (this.invaders[invaderHitIndex].getX() + this.invaders[invaderHitIndex].outerWidth())) ){

                if( (yRelHit >= this.invaders[invaderHitIndex].getY()) && ( yRelHit <= (this.invaders[invaderHitIndex].getY() + this.invaders[invaderHitIndex].outerHeight())) ){
                    //send off collision warning
                    this.receivedHit(otherThing, invaderHitIndex);
                    return true;

                }
            }
        }
    }

    return false;

};


//Deal with a hit
Fleet.prototype.receivedHit = function(otherThing, invaderHitIndex) {

    //delete that invader and remove it from the screen
    this.dom_element.removeChild(this.invaders[invaderHitIndex].dom_element);
    this.invaders.splice(invaderHitIndex, 1);

    //update the width and or height of the fleet if needed
        // if the removed invader was at an end of the longest row update the width; do you keep track of which row is longest?
        //how do we know if it comes off the right or left? Maybe it doesn't matter?
            // this.setWidth();

        //if the invader removed was the last in its column
            // this.setHeight(0);

    //Change the speed the fleet moves at: incremet speed of movement
        //this.offsetX++;// TODO: how much faster does it start moving?
}


