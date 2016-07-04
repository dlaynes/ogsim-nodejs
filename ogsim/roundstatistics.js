//statistics of a battle round
var Attackstatistics = require('./attackstatistics');

var roundstatistics = function(attackGroup, defenseGroup){

    this.results = [];
    this.attackGroup = attackGroup;
    this.defenseGroup = defenseGroup;
};

roundstatistics.prototype.init = function(attstats, dfstats){
    this.attstats = attstats;
    this.dfstats = dfstats;
    this.update( 0 );
};

roundstatistics.prototype.update = function( round ){
    var ft,
        attCompressed = [],
        dfCompressed = [],
        i,
        stats;

    for(i=0; i < this.attackGroup.fleets.length; i++ ){
        ft = this.attackGroup.fleets[i];
        stats = ft.getStats();
        //console.log(stats);
        attCompressed.push( stats );
    }

    for(i=0; i < this.defenseGroup.fleets.length; i++ ){
        ft = this.defenseGroup.fleets[i];
        stats = ft.getStats();
        //console.log(stats);
        dfCompressed.push( stats );
    }

    this.results.push({
        "attack_fleet" : {
            "current": attCompressed,
            "attack_points": this.attstats.ap,
            "shield_defense": this.attstats.sp,
            "number_of_shoots" : this.attstats.sh
        },
        "defense_fleet" : {
            "current": dfCompressed,
            "attack_points": this.dfstats.ap,
            "shield_defense": this.dfstats.sp,
            "number_of_shoots" : this.dfstats.sh
        },
        "round" : round
    } ) ;

};

module.exports = roundstatistics;