var async = require("async");
var Timer = require('./timer');

var config = require('./config');
var Group = require('./group');
var Roundstatistics = require('./roundstatistics');
var Attackstatistics = require('./attackstatistics');

var Tools = require('./tools');

/* Battle between 2 fleet groups */
var battle = function( attackerList, defenderList, numSimulations, afterFunction ){
    this.timer = new Timer(attackerList, defenderList);
    this.timer.start("battle");
    this.timer.start("init");

    /* We initialize the groups */
    this.attGroup = new Group(attackerList, config.pricelist, config.rapidfire);
    this.dfGroup = new Group(defenderList, config.pricelist, config.rapidfire);
    this.report = new Roundstatistics(this.attGroup, this.dfGroup);
    this.attstats = new Attackstatistics();
    this.dfstats = new Attackstatistics();

    

    this.afterFunction = afterFunction;
    this.handleRounds();
};

battle.prototype.handleRounds = function(rounds){
    /* We initialize each group fleets */
    this.init( );
    /* We begin the battle */
    this.battle( );
};

battle.prototype.init = function(){

    this.timer.start("expand_att");
    this.attGroup.expand();
    this.timer.end("expand_att");

    this.timer.start("expand_df");
    this.dfGroup.expand();
    this.timer.end("expand_df");

    //initial state of the battle
    this.report.init(this.attstats, this.dfstats); //Will give 0,0,0 in the attack statistics

    this.timer.end('init');
};

battle.prototype.battle = function(){

    var self = this, exitRounds, round = 1;

    while(1){
        if(!this.attGroup.expandedFleet.length){
            console.log("Attackers do not have operational ships, in round "+round);
            exitRounds = true;
        }
        if(!this.dfGroup.expandedFleet.length){
            console.log("Defenders do not have operational ships, in round "+round);
            exitRounds = true;
        }
        if(exitRounds){
            break;
        }

        /* TODO: check if both attacking groups are too weak to damage each other */

        //attack loop
        self.timer.start("battle_round_"+round); //Timer start
        //Attackers attack defenders. Defenders attack attackers :)
        self.attGroup.attack(self.dfGroup, self.attstats);
        self.dfGroup.attack(self.attGroup, self.dfstats);
        self.timer.end("battle_round_"+round); //Timer end

        //clean loop
        self.timer.start("battle_clean_"+round);
        self.attGroup.clean(); //remove destroyed ships
        self.dfGroup.clean();
        self.timer.end("battle_clean_"+round);

        //build report for this round
        self.report.update(round);

        //reset round statistics
        self.attstats.reset();
        self.dfstats.reset();

        round++;
        if(round > 6){
            break;
        }
    }

    self.timer.end("battle");

    self.timer.buildResults();
    if(self.afterFunction){
        self.afterFunction(self.timer.records, self.report.results);
    }
};

module.exports = battle;
