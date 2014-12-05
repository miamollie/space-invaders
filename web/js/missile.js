/* M I S S I L E */
function Missile(gameScreen){
    // Inheritance
    SuperElement.call( this );

    this.gameScreen =  gameScreen;
    //make a new DOM element
    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("class", "missile");
    this.gameScreen.dom_element.appendChild( this.dom_element );
}

//More inheritance stuff, note that "create()" doesn't work on older engines
Missile.prototype = Object.create(SuperElement.prototype);
Missile.prototype.constructor = Missile;

/*What does a Missile do?!*/

//Move up the Screen

Missile.prototype.goUp = function() {
    this.setY(this.getY()-2);
};


Missile.prototype.goDown = function() {
    this.setY(this.getY()+2);
};
