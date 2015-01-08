
/* F L E E T */

function Fleet(gameScreen){
    //inheritance
    SuperElement.call( this );


    //Display attributes
    this.gameScreen = gameScreen;

    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("id", "fleet");

    console.log("gameScreen: " + this.gameScreen);
    this.gameScreen.appendChild( this.dom_element );

    this.setX(0);
    this.setY(47);

    // Animation Attributes
    this.missileFrequency = 4000; // initially invaders fire roughly every 4 seconds
    this.changeIcon = 500;

    //Speed of movement
    this.offsetX = 0.5;
    this.offsetY = 4;

    //Direction of movement
    this.direction = 1; // starts by going right


    //Fleet invaders
    this.invaders = [];
    this.statuses = [];

    var x = -20; //This needs to be -(Invader.MarignLeft)
    var y = 0;
    var fleet_width = 0;


    //Fill up the fleet
    for( var i = 0; i < 5; i++ ){
        this.invaders[i] = new Array(10);
        this.statuses[i] = new Array(10);


        for( var j = 0; j < 10; j++ ){
            this.invaders[i][j] = new Invader(this, {x: x, y: y});
            x += this.invaders[i][j].outerWidth();
            this.statuses[i][j] = 1;
        }

        y += this.invaders[i][0].outerHeight();
        fleet_width = x;
        x = -this.invaders[i][0].marginLeft();

    }

    this.setWidth(fleet_width); // set width of the fleet to one row of invaders - TODO even this height and width should be set by the updateDimension() method
    this.setHeight(y - this.invaders[0][0].marginBottom()); // set height of fleet to one column of invaders

    //Define the fleet extremities for use with height and width updates TODO- if we were being swanky, we would make it possible to change the number of invaders, and have all these value set dynamically rather than statically... Mia is being lazy
    //Object which tracks the cells which is the left, right, and bottom extremity of the array;
    this.extremities = {
        left: { r: 4, c: 0 }, //leftmost extremity starts at bottom left
        right: {r: 4, c: 9 }, //rightmost extremity starts at bottom right
        bottom: 0
    }

    this.updateLeft = false;
    this.updateRight = false;
    this.updateBottom = false;


}

//More inheritance stuff, note that "create()" doesn't work on older engines
Fleet.prototype = Object.create(SuperElement.prototype);
Fleet.prototype.constructor = Fleet;


/*What does a fleet do?*/

//Move the whole fleet
Fleet.prototype.move = function() {

    var current_position = this.getX();
    var right_edge = parseFloat(this.gameScreen.parentNode.style.width) - this.width();
    var left_edge = 0;

    //if the fleet hits the right edge, go down and change direction
    if( (current_position >= right_edge) && (this.direction == (1)) ){
        this.direction = (-1);
        this.setY(this.getY() + this.offsetY);
        if( this.updateRight ){
            this.setWidth(this.width() - this.invaders[0][0].outerWidth());
            this.updateRight = false;

        } else if( this.updateBottom ){
            this.setWidth(this.height() - this.invaders[0][0].outerHeight());
            this.updateBottom = false;

        }

    }

    //if the fleet hits the right edge, go down and change this.direction
    else if( (current_position <= left_edge) && (this.direction == (-1)) ){
        this.direction = 1;
        this.setY(this.getY() + this.offsetY);
        if( this.updateLeft ){
            //TO-DO update the coordinates of all invaders to be  - width of one invader on the x-axis
            this.setWidth(this.width() - this.invaders[0][0].outerWidth());
            this.updateLeft = false;

        } else if ( this.updateBottom ){
            this.setWidth(this.height() - this.invaders[0][0].outerHeight());
            this.updateBottom = false;

        }

    }

    //otherwise keep moving
    else {
        this.setX(this.getX() + (this.offsetX * this.direction));
    }

};

//Among the remaining invaders, randomly fire
Fleet.prototype.randomFire = function(gameScreen) {

    var firingInvaderX = Math.floor((Math.random() * (this.invaders.length - 1) + 0)); // pick an invader between 0 and number of remaining invaders in fleet
    var firingInvaderY = Math.floor((Math.random() * (this.invaders[0].length - 1) + 0)); //
    var missile = new Missile(gameScreen);
    console.log("invaderX: " +  firingInvaderX + " invaderY" + firingInvaderY);
    missile.setX(this.getX() + this.invaders[firingInvaderX][firingInvaderY].getX() + ( (this.invaders[firingInvaderX][firingInvaderY].width()) - (missile.width())) );
    missile.setY(this.getY() + this.invaders[firingInvaderX][firingInvaderY].getY());
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
        var invaderHitIndexX = null;

        //now call collision detection on the invaders TODO opptomise to invaders in column x
        for( invaderHitIndexX = 0; invaderHitIndexX < this.invaders.length; invaderHitIndexX++ ){
            for(var invaderHitIndexY = 0; invaderHitIndexY < this.invaders[invaderHitIndexX].length; invaderHitIndexY++){
                if( (xRelHit >= this.invaders[invaderHitIndexX][invaderHitIndexY].getX()) && ( xRelHit  <= (this.invaders[invaderHitIndexX][invaderHitIndexY].getX() + this.invaders[invaderHitIndexX][invaderHitIndexY].outerWidth())) ){

                    if( (yRelHit >= this.invaders[invaderHitIndexX][invaderHitIndexY].getY()) && ( yRelHit <= (this.invaders[invaderHitIndexX][invaderHitIndexY].getY() + this.invaders[invaderHitIndexX][invaderHitIndexY].outerHeight())) ){
                        //send off collision warning
                        this.receivedHit(otherThing, invaderHitIndexX, invaderHitIndexY);
                        return true;
                    }
                }
            }

        }
    }

    return false;

};


//Deal with a hit
Fleet.prototype.receivedHit = function(otherThing, invaderHitIndexX, invaderHitIndexY) {

    //delete that invader and remove it from the screen
    // this.invaders[invaderHitIndexX].dom_element.classList.add("explosion");
    this.statuses[invaderHitIndexX][invaderHitIndexY] = 0;
    this.dom_element.removeChild(this.invaders[invaderHitIndexX][invaderHitIndexY].dom_element);
    this.invaders[invaderHitIndexX].splice(invaderHitIndexY, 1);

    //update the width and or height of the fleet if needed
    this.statuses[invaderHitIndexX][invaderHitIndexY] = 0;
    this.updateDimensions();

    //Increase the speed of movement of the fleet
    this.offsetX += 0.05;//
    this.changeIcon -= 1;


}



Fleet.prototype.animate = function() {
    //Swap the display sprite of the invaders
    for( var i = 0; i < this.invaders.length; i++ ){
        for( var j = 0; j < this.invaders[i].length; j++){
            this.invaders[i][j].dom_element.classList.toggle("second");
        }
    }
}


//Update the extremities of the fleet based on remaining invaders
Fleet.prototype.updateExtremities =  function() {

    var currentLeftExtremity = {
        r: 0,
        c: this.statuses[0].length
    };

    var currentRightExtremity = {
        r: 0,
        c: 0
    };


    var currentBottomExtremity = this.extremities.bottom;

    var tempLeft = 0;
    var tempRight = 0;

        //Loop through rows starting at the top

        for( var r = 0; r < this.statuses.length; r++ ){

            //Find first occurrence of 0 in row r
            tempLeft = this.statuses[r].indexOf(1);

            if( (tempLeft != (-1)) && (tempLeft <= currentLeftExtremity.c)){
                console.log("left update");
                //set this row's left as the leftmost left
                currentLeftExtremity.c =  tempLeft;
                currentLeftExtremity.r = r;
            }


             //Find last occurrence of 0 in row r
             tempRight = this.statuses[r].lastIndexOf(1);

             if( (tempRight != (-1)) && (tempRight >= currentRightExtremity.c)){
                console.log("right update");
                 //set this row's left as the leftmost left
                 currentRightExtremity.c =  tempRight;
                 currentRightExtremity.r = r;
             }

             //find out if the whole row is zeros

            if (tempRight == (-1)){ // i.e. if there are no 1s in the row
                console.log("bottom update");
                currentBottomExtremity = r -1;
            }

        }



        //if an update to the extremities is detected, update height and width accordingly
        if( (this.extremities.left.r > currentLeftExtremity.r) || (this.extremities.left.c != currentLeftExtremity.c) ){
            // update the coordinates of all the invaders and reduce the width of the DOM element
            this.extremities.left.r =  currentLeftExtremity.r;
            this.extremities.left.c = currentLeftExtremity.c;
            this.updateLeft = true;
        }


        // console.log("this row " + this.extremities.right.r + " current row: " + currentRightExtremity.r + "  this column: " +  this.extremities.right.c + " current column: " + currentRightExtremity.c);
        if( (this.extremities.right.r < currentRightExtremity.r) || (this.extremities.right.c != currentRightExtremity.c)){
            // update the coordinates of all the invaders and reduce the width of the DOM element
            this.extremities.right.r =  currentRightExtremity.r;
            this.extremities.right.c = currentRightExtremity.c;
            this.updateRight = true;

        }

        if( this.extremities.bottom < currentBottomExtremity ){
            // update the coordinates of all the invaders and reduce the width of the DOM element
            this.extremities.bottom.c = currentBottomExtremity;
            this.updateBottom = true;

        }


    }




//Update the extremities of the fleet based on remaining invaders
Fleet.prototype.updateDimensions =  function() {



}



