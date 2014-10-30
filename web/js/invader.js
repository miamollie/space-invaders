/* I N V A D E R */
function Invader(fleet, coords){
        // Inheritance
    SuperElement.call( this);

    this.fleet = fleet;

    //make a new DOM element
    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("class", "invader");

    //add DOM element to the screen
    this.fleet.dom_element.appendChild( this.dom_element );

    this.setX(coords.x);
    this.setY(coords.y);


}

//More inheritance stuff, note that "create()" doesn't work on older engines
Invader.prototype = Object.create(SuperElement.prototype);
Invader.prototype.constructor = Invader;



