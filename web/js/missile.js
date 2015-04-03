/* M I S S I L E */
function Missile(gameScreen){
    // Inheritance
    SuperElement.call( this );

    this.gameScreen =  gameScreen;
    //make a new DOM element
    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("class", "missile");
    this.gameScreen.appendChild( this.dom_element );
}

//Inheritance
Missile.prototype = Object.create(SuperElement.prototype);
Missile.prototype.constructor = Missile;

//Move up the Screen
Missile.prototype.goUp = function() {
    this.setY(this.getY()-5);
};

//Move down the Screen
Missile.prototype.goDown = function() {
    this.setY(this.getY()+5);
};
