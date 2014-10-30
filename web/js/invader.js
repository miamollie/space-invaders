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



//When an invader receives a hit, it animates somehow then removes itself from the fleet
Invader.prototype.receivedHit = function(otherThing){
    console.log("invader HIT");
    this.dom_element.style.border = "thick solid red";
    this.fleet.receivedHit(otherThing);// Pass the hit on to the fleet    
    otherThing.dom_element.parentNode.removeChild(otherThing.dom_element); //Delete the missile from the screen
}
