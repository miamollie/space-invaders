


/* S C R E E N */
function GameScreen(){
    //Inheritance
    SuperElement.call( this );

    //make a new DOM element : got some fixing to do here to work with the game screen types
    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("id", "game_screen");
    this.threshold = 400; // TODO what should this value be?
    this.launcherMissiles = [];
    this.invaderMissiles = [];

}

//More inheritance stuff, note that "create()" doesn't work on older engines
GameScreen.prototype = Object.create(SuperElement.prototype);
GameScreen.prototype.constructor = GameScreen;
