/* M I S S I L E */
function Missile(gun, game_screen){
    // Inheritance
    SuperElement.call( this );

    this.game_screen =  game_screen;
    //make a new DOM element
    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("class", "missile");
    game_screen.dom_element.appendChild( this.dom_element );
}

//More inheritance stuff, note that "create()" doesn't work on older engines
Missile.prototype = Object.create(SuperElement.prototype);
Missile.prototype.constructor = Missile;

/*What does a Missile do?!*/

//Move up the Screen

Missile.prototype.goUp = function() {
    var missile_height = this.height;
    this.setY(this.getY()-2);

    //if it goes higher than the game screen
    if(this.getY() < (0 + missile_height) ){
        this.game_screen.dom_element.removeChild(this.dom_element);
    }
};


Missile.prototype.goDown = function() {
    this.setY(this.getY()+2);

    //if it drops lower than the game screen
    if(this.getY() > this.game_screen.height() ){
        this.game_screen.dom_element.removeChild(this.dom_element);
    }
};
