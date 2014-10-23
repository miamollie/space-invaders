
function SuperElement( lives ){
    this.lives = lives; // shane dont know what this is for, mia do know
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

SuperElement.prototype.getX = function(  ) {
    x = parseFloat(getComputedStyle( this.dom_element, null).left);    
    return x;
};

SuperElement.prototype.setY = function( y ) {
    this.dom_element.style.top = y + "px";
};

SuperElement.prototype.getY = function( y ) {
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
    var hitX;
    var hitY;


    // x-axis overlap
    if ( (element2_x >= element1_x) && (element2_x <= element1_x_w ) )  
    {
        //leftmost coordinate inside
        hitX = element2_x;

    } else if ( (element2_x_w >=  element1_x) && (element2_x_w <= element1_x_w ) ) { 
        //rightmost coordinate inside
        hitX = element2_x_w;
    }

    //If overlapping on the x-axis
    if (hitX)
    {
        //find out if Y-axis overlaps
       if ( (element2_y >= element1_y) && (element2_y <= element1_y_h) ) 
       {
            //top coordinate inside
            hitY = element2_y;

       } else if ( (element2_y_h <=  element1_y) && (element2_y_h >= element1_y_h) ){
            //bottom coordinate inside
            hitY = element2_y_h;    
        
       }
    }
     
    //if Overlapping in the X and Y   
    if(hitY) {
        //send off collision warning        
        this.receivedHit(otherThing); //TODO- write received hit method which will be different for Launcher, Invader and Bunker
        //Delete the missile from the screen

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
    // console.log("New Missile Coordinates: X " + missile.getX() + " Y " +  missile.getY()) ;
    // console.log("Was fired by object at: X " + this.getX() + " Y " +  this.getY()) ;
    return missile;
}



/* S C R E E N */
function GameScreen(){
    //Inheritance
    SuperElement.call( this, [0] ); 
    
    //make a new DOM element
    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("id", "game_screen");
    this.invaderMissiles = [];
    this.launcherMissiles = [];

}

//More inheritance stuff, note that "create()" doesn't work on older engines
GameScreen.prototype = Object.create(SuperElement.prototype);
GameScreen.prototype.constructor = GameScreen;


/* L A U N C H E R */
function Launcher(game_screen){
    // Inheritance
    SuperElement.call( this, [3] ); 
    
    this.game_screen = game_screen;
    
    //make a new DOM element   
    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("id", "launcher");
   
    game_screen.dom_element.appendChild( this.dom_element );
   
    this.setX(game_screen.width()/2 - this.width()/2);
    this.setY(game_screen.height() - this.height()); 

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
    //make sure the launcher stays on the screen
    var right_edge = this.game_screen.width();        
    if(this.getX() >= right_edge - launcher_width){        
        this.setX(right_edge - launcher_width);
    }else{    
        var tempX = this.getX();        
        this.setX(tempX + 5);            
    }

};




Launcher.prototype.receivedHit = function(otherThing){
    // this.lives --;
    console.log("Launcher Hit!");
    otherThing.dom_element.parentNode.removeChild(otherThing.dom_element); //Delete the missile from the screen
}


/* M I S S I L E */
function Missile(gun, game_screen){
    // Inheritance
    SuperElement.call( this, [0] ); 

    //Gun is the thing that fired the missile; 
    //Link a missile to a launcher
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
    if(this.getY() < 0 + missile_height){ 
        this.game_screen.dom_element.removeChild(this.dom_element);
    }
    
};


Missile.prototype.goDown = function() {          
    var missile_height = this.height();
    this.setY(this.getY()+2);

    //if it drops lower than the game screen
    if(this.getY() > this.game_screen.height() ){ 
        this.game_screen.dom_element.removeChild(this.dom_element);
    }
    
};




/* I N V A D E R */
function Invader(fleet, coords){
        // Inheritance
    SuperElement.call( this, [1] );     
    
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
    this.dom_element.parentNode.removeChild(this.dom_element); //Delete the Invader from the screen
    otherThing.dom_element.parentNode.removeChild(otherThing.dom_element); //Delete the missile from the screen
    console.log("invader HIT");
}


/* F L E E T */

function Fleet(game_screen, num_invaders){
    //inheritance
    SuperElement.call( this, [0] ); 

    this.missileFrequency = 5000; // initially invaders fire roughly every 5 seconds
    
    this.invaders = [];
    this.game_screen = game_screen;
    

    //make a new DOM element   
    this.dom_element = document.createElement("div");
    this.dom_element.setAttribute("id", "fleet");
   
    //add DOM element to the screen
    game_screen.dom_element.appendChild( this.dom_element );
   

    // Speed that the fleet moves from left to right and down, which will be updated as the invaders are destroyed   
    this.setX(20);
    this.setY(5);

    //Speed of movement
    this.offsetX = 0.5;
    this.offsetY = 4;

    //Direction of movement
    this.direction = 1; // starts by going right

    var x = 0;
    var y = 0;
    var fleet_width = 0;    
    //Fill up the fleet
    for (var i = 1; i < num_invaders + 1; i++) {
        this.invaders[i - 1] = new Invader(this,{x: x, y: y});            
        x += 50;        
        if ((i % 10 == 0 ) && (i > 0) ){            
            y += 50;
            fleet_width = x;
            x = 0;            
        }
    };

    this.setWidth(fleet_width); // set width of the fleet to one row of invaders
    this.setHeight(y); // set height of fleet to one column of invaders

}

//More inheritance stuff, note that "create()" doesn't work on older engines
Fleet.prototype = Object.create(SuperElement.prototype);
Fleet.prototype.constructor = Fleet;

 /*What does a fleet do?*/

//Move the whole fleet
Fleet.prototype.move = function() {
    var current_position = this.getX(); 
    var right_edge = this.game_screen.width() - this.width();
    var left_edge = 0;


    //if the fleet hits the right edge, go down and change direction
    if( (current_position >= right_edge) && (this.direction == (1)) ){
        this.direction = (-1);
        this.setY(this.getY() + this.offsetY);

    }
    
    //if the fleet hits the right edge, go down and change this.direction
    else if ( (current_position <= left_edge) && (this.direction == (-1)) )  {
        this.direction = 1;
        this.setY(this.getY() + this.offsetY);        
    } 

    //otherwise keep moving
    else {        
        this.setX(this.getX() + (this.offsetX * this.direction));                
    }

};



//Among the remaining invaders, randomly fire
Fleet.prototype.randomFire = function() {
    var firingInvader = Math.floor((Math.random() * (this.invaders.length- 1) + 0)); // pick an invader between 0 and number of remaining invaders in fleet
    var missile =  this.invaders[firingInvader].fireMissile();  
    return missile;
}



Fleet.prototype.receivedHit = function(otherThing) {  

    console.log("fleet HIT");

    //now call collision detection on the invaders TODO opptomise to invaders in column x
    for (var i = 0; i < this.invaders.length; i++) {
        if(this.invaders[i].overlaps(otherThing)){
            console.log("found collision at: " +  i);
            //remove that invader   
            // console.log("Invader X " + this.invaders[i].getX() +  " Missile X " + otherThing.getX());  // YOU ARE HERE
            this.invaders.splice(i, 1);
        }
    };



    //update the width and or height of the fleet if needed
        // if the removed invader was at an end of the longest row update the width; do you keep track of which row is longest?
        //how do we know if it comes off the right or left? Maybe it doesn't matter?
            // this.setWidth();

        //if the invader removed was the last in its column
            // this.setHeight(0);

    //Change the speed the fleet moves at: incremet speed of movement
        //this.offsetX++;// TODO: how much faster does it start moving?
        //this.offsetY++;// TODO: how much faster does it start moving?
}


/* B U N K E R */
// function Bunker(){
//     SuperElement.apply( this, [0, 0] );
// }

// Bunker.prototype.receivedHit {
//     this.lives --;
//     //and somehow undraw some of it

// }
