

/* L A U N C H E R */
function Launcher(gameScreen){
    // Inheritance
    SuperElement.call( this);

    this.lives = 3;

    this.gameScreen = gameScreen;

    //make a new DOM element
    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("id", "launcher");

    this.gameScreen.appendChild( this.dom_element );

    this.setX((parseFloat(this.gameScreen.parentNode.style.width))/2 - this.width()/2);
    this.setY(parseFloat(this.gameScreen.parentNode.style.height) - this.height());

}

//More inheritance stuff, note that "create()" doesn't work on older engines
Launcher.prototype = Object.create(SuperElement.prototype);
Launcher.prototype.constructor = Launcher;


/* What does the launcher do! */

//Move the launcher left
Launcher.prototype.goLeft = function() {
    //make sure the launcher stays on the screen
    if(this.getX() <= 0 ){
        this.setX(0);
    }else{
        this.setX(this.getX() - 5);
    }
};

//Move the launcher right
Launcher.prototype.goRight = function() {

    var launcher_width = this.width();
    var right_edge = parseFloat(this.gameScreen.parentNode.style.width);

    //make sure the launcher stays on the screen
    if(this.getX() >= right_edge - launcher_width){
        this.setX(right_edge - launcher_width);
    }else{
        var tempX = this.getX();
        this.setX(tempX + 5);
    }
};




Launcher.prototype.receivedHit = function(otherThing){
    this.lives --;
}


