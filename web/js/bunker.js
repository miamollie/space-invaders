/* B U N K E R */
function Bunker(game_screen, x, y){
    SuperElement.apply( this );


    this.bunkerBlocks = [];
    this.game_screen = game_screen;


    //make a new DOM element
    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("class", "bunker");

    //add DOM element to the screen
    game_screen.dom_element.appendChild( this.dom_element );

    this.setX(x);
    this.setY(y);

    //set up the bunker blocks to build the bunker; using 20 as initial value.
    //First 12 go in a row TODO make bunker legs
    //TODO optimize so height and width of bunker is set dynamically

    var x = 0;
    var y = 0;
    var bunkerWidth = 0;
    var bunkerHeight = 0;

    for( var i = 1; i < 13; i++ ){
    	this.bunkerBlocks[i - 1] = new BunkerBlock(this, {x: x, y: y});
    	x += this.bunkerBlocks[i - 1].width();

    	if( i % 6 == 0 ){
			y += this.bunkerBlocks[i - 1].height();
            bunkerWidth = i * this.bunkerBlocks[i - 1].width();
            x = 0;
    	}

    	bunkerHeight = y;
    }

    this.setWidth(bunkerWidth - this.getX());
    this.setHeight(bunkerHeight - this.getY());
}


//More inheritance stuff, note that "create()" doesn't work on older engines
Bunker.prototype = Object.create(SuperElement.prototype);
Bunker.prototype.constructor = Bunker;


//Bunker's Very own special overlaps methog
Bunker.prototype.overlaps = function(otherThing){

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


    //if Overlapping in the X and Y of the bunker, then check the blocks
    if( isHitY && isHitX ){

        var xRelHit = xCoordHit - this.getX();
        var yRelHit = yCoordHit - this.getY();

        //Keet track of the bunkerBlock that's been hit
        var bunkerBlockHitIndex = null;

        //now call collision detection on the bunkerBlocks TODO opptomise to bunkerBlocks in column x
        for( bunkerBlockHitIndex = 0; bunkerBlockHitIndex < this.bunkerBlocks.length; bunkerBlockHitIndex++ ){

            if( (xRelHit >= this.bunkerBlocks[bunkerBlockHitIndex].getX()) && ( xRelHit  <= (this.bunkerBlocks[bunkerBlockHitIndex].getX() + this.bunkerBlocks[bunkerBlockHitIndex].outerWidth())) ){

                if( (yRelHit >= this.bunkerBlocks[bunkerBlockHitIndex].getY()) && ( yRelHit <= (this.bunkerBlocks[bunkerBlockHitIndex].getY() + this.bunkerBlocks[bunkerBlockHitIndex].outerHeight())) ){
                    //send off collision warning
                    this.receivedHit(otherThing, bunkerBlockHitIndex);
                    return true;

                }
            }
        }
    }

    return false;

};



Bunker.prototype.receivedHit = function(otherThing, bunkerBlockHitIndex) {

	//Delete a part of the bunker
	this.dom_element.removeChild(this.bunkerBlocks[bunkerBlockHitIndex].dom_element);
    this.bunkerBlocks.splice(bunkerBlockHitIndex, 1);


};


