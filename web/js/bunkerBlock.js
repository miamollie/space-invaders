/* B U N K E R */
function BunkerBlock(bunker, coords){
    SuperElement.apply( this );
    this.bunker = bunker;


    //make a new DOM element
    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("class", "bunkerBlock");

    //add DOM element to the screen
    bunker.dom_element.appendChild( this.dom_element );

    this.setX(coords.x);
    this.setY(coords.y);

}

//More inheritance stuff, note that "create()" doesn't work on older engines
BunkerBlock.prototype = Object.create(SuperElement.prototype);
BunkerBlock.prototype.constructor = BunkerBlock;