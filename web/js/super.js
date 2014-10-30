
function SuperElement( ){
}

SuperElement.prototype.width = function() {
    return parseFloat(getComputedStyle( this.dom_element, null).width);
};

SuperElement.prototype.height = function() {
    return parseFloat(getComputedStyle( this.dom_element, null).height);
};

SuperElement.prototype.setX = function( x ) {
    this.dom_element.style.left = x + "px";
};

SuperElement.prototype.getX = function( ) {
    x = parseFloat(getComputedStyle( this.dom_element, null).left);
    return x;
};

SuperElement.prototype.setY = function( y ) {
    this.dom_element.style.top = y + "px";
};

SuperElement.prototype.getY = function( ) {
    y = parseFloat(getComputedStyle( this.dom_element, null).top);
    return y;
};

SuperElement.prototype.setWidth = function( width ) {
    this.dom_element.style.width = width + "px";
};

SuperElement.prototype.setHeight = function( height ) {
    this.dom_element.style.height = height + "px";
};


//Collision Detection for all Game Elements
SuperElement.prototype.overlaps = function(otherThing){

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

    //If overlapping on the x-axis
    if( (element2_y >= element1_y) && (element2_y <= element1_y_h) ){
        //top coordinate inside
        isHitY = true; // element2_y;
        yCoordHit = element2_y_h;

    } else if( (element2_y_h <=  element1_y) && (element2_y_h >= element1_y_h) ){
        //bottom coordinate inside
        isHitY = true;
        yCoordHit = element2_y_h;
    }


    console.log("Hit X: " + isHitX + " hit Y : " + isHitY );
    //if Overlapping in the X and Y
    if(isHitY && isHitX){
        //send off collision warning
        this.receivedHit(otherThing, xCoordHit, yCoordHit);
        return true;
    }

    return false;

}

//Fire Missile

//Any object can fire a missile from its current position
SuperElement.prototype.fireMissile = function() {
    var missile = new Missile(this, game_screen);
    missile.setX(this.getX() + ((this.width()/2) - (missile.width()/2) ));
    missile.setY(this.getY());
    return missile;
}
