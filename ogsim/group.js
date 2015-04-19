var Fleet = require('./fleet');
var Tools = require('./tools');
//var Randomarray = require('./randomarray');

/* New attacking or defending Group */
var group = function(fleetdataList, pricelist, rapidfire){
    var ft;
    this.fleets = [];
    this.expandedFleet = [];

    /* List of fleets present in the group, each one has unique characteristics and unit types (ships and defenses)
    The script will merge all the fleets from a SAC group into one giant array, but first, we are initializing the control objects
    */
    for(var i=0; i<fleetdataList.length; i++){
        ft = new Fleet(fleetdataList[i].fleet, pricelist, rapidfire, fleetdataList[i].military_tech,
            fleetdataList[i].defense_tech, fleetdataList[i].hull_tech, fleetdataList[i].player_id );
        this.fleets.push(ft);
    }
    this.fleetdataList = fleetdataList;
};

//Convert the configuration values into a large array of data
group.prototype.expand = function(){
    var fte = [];
    for(var i=0, ft; i<this.fleets.length; i++){
        ft = this.fleets[i];

        //same performance. It doesn't change anything
        ft.expandTo(this.expandedFleet);
        //this.expandedFleet = this.expandedFleet.concat( ft.expand() );
    }
}

//Remove lost ships from the current fleet group
group.prototype.clean = function(){
    var cleanList = [], ship, i, l = this.expandedFleet.length;

    //Nope, using filter() or similar makes this method really slow
    for(i=0; i<l; i++){
        ship = this.expandedFleet[i];
        if(ship[0]){
            ship[1] = ship[2].s;
            cleanList.push(ship);
        } else {
            ship = null;
        }
    }
    this.expandedFleet = cleanList;

    /*
    //Sloooowwwww in V8, due to splice, and the reversal loop   
    var i = this.expandedFleet;
    while (i--) {
        ship = this.expandedFleet[i];
        if(ship[0]){
            ship[1] = ship[2].s;
        } else {
            this.expandedFleet.splice(i, 1);
        }
    }
    */
};


group.prototype.attack = function(contrary, stats){
    var m = contrary.expandedFleet.length, /* Amount of enemy ships */
        ft = null, /* UnitType of the current ship */
        Dm = 0, /* Attack points of the current ship */
        Dc = 0, /* Attack points required to bypass the Large Shield Dome defenses */
        f = null, /* Current Ship */
        uk = 0, /* Random defensive ship Index */
        u = null, /* Random defensive ship */
        ut = null, /* UnitType of the defensive ship */
        De = 0.0, /* Damage done after destroying the shields */
        xp = 0.0, /* probability of an explosion */
        c, /* Amount of ships in the ally group */
        i = -1, /* Ally loop index */
        rn = false; /* Let the current ship attack again, or not? */

    //we save the base amount of shoots, and the amount of ships in the ally fleet group.
    c = stats.sh = this.expandedFleet.length;
    while( ++i < c ){
    //for(var i=0; i<c; i++){
        f = this.expandedFleet[i];
        ft = f[2];
        Dm = ft.d;
        Dc = Dm * 100;
        rn = false;

        //Current Ship loop
        do{
            stats.ap = stats.ap + Dm; //We shoot! and we update the statistics accordingly

            //We pick a random target in the opposite fleet group
            uk = Math.random() * m|0;
            u = contrary.expandedFleet[uk];
            ut = u[2]; //we save the unit type of the target

            // Is this ship still operational? Well, let's check if it resists the shot
            if(u[0]){

                //Shield wasn't strong enough to ignore the shot (Large Shield Domes)
                if( Dc > u[2].s ){

                    //Shield wasn't strong enough to survive the shot
                    if(Dm > u[1] ){
                        De = Dm - u[1]; // New damage, after substracting the shield points of the current target
                        stats.sp = stats.sp + u[1]; // We update the shield damage statistics
                        //target's shield is not zero
                        u[1] = 0;

                        if( De < u[0] ){ //Check if the ships "health" is higher than the damage

                            u[0] = u[0] - De; //We substract health points from the target

                            // Probability of an explosion
                            xp = ( ut.h - u[0] ) / ut.h;
                            if(  ( xp > 0.3 ) && Math.random() < xp ) {
                                u[0] = 0; // Kaboom
                                ut.x = ut.x + 1; // <- Increasing the number of explosions in the unittype statistics
                            }

                        } else {
                            u[0] = 0; // Kaboom. The target did not survive that shot
                            ut.x = ut.x + 1; // <- Increasing the number of explosions in the statistics
                        }
                    } else {
                        u[1] = u[1] - Dm; // The shield survived the shot. We decrease the shield points of the target
                        stats.sp = stats.sp + Dm; // We update the shield damage statistics
                    }

                    // Actualizamos los datos (No es necesario, ya que en javascript los arrays son objetos pasados por referencia)
                    //contrary.expandedFleet[uk] = u;


                // Unefective shot
                } else {
                    stats.sp = stats.sp + Dm; // We update the shield damage statistics
                    break; //We leave the single ship loop, because there are no ships with rapidfire against Large Shield Domes
                    //(and the attack completely failed)
                }
            }

            //Rapid fire calculations. Do we have rapidfire rules available? (for both attacking ship and target)
            if( ft.rf[ut.i] ){
                //Do we get another turn?
                if ( Math.random() < ft.rf[ut.i] ){
                    stats.sh = stats.sh + 1; //Yes we did. We update the total amount of shots
                    // We stay in the ship loop
                    rn = true;
                } else {
                    rn = false; // We leave the ship loop
                }
            } else {
                rn = false; // We leave the ship loop
            }

        } while(rn);
        //End of the fleet group loop
    }

};

group.prototype.getReports = function(){
    //TODO
};

module.exports = group;