


/* S C R E E N */
function GameScreen(){
    //Inheritance
    SuperElement.call( this, [0] );

    //make a new DOM element
    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("id", "game_screen");
    this.threshold = 400; // TODO what should this value be?

}

//More inheritance stuff, note that "create()" doesn't work on older engines
GameScreen.prototype = Object.create(SuperElement.prototype);
GameScreen.prototype.constructor = GameScreen;
