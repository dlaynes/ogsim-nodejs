var prettyHrtime = require('pretty-hrtime'); //leave this line alone
//process.hrtime = require('browser-process-hrtime'); //Uncomment this line when using browserify

var timer = function(){
    this.records = {};
};

timer.prototype.start = function(id){
    this.records[id] = {
        start : process.hrtime(),
        end: null
    };
};

timer.prototype.end = function(id){

    if(!this.records[id]){
        console.log( "Timer "+id+" not available!!");
        return;
    }

    this.records[id].end = process.hrtime(this.records[id].start);
};

timer.prototype.buildResults = function(){

    var precision = 6,
        elapsed;

    for( var id in this.records ){
        if(!this.records.hasOwnProperty(id)){ continue; }

        if(!this.records[id].end){
            console.log( "Timer "+id+" not closed!!");
            continue;
        }

        this.records[id].description = prettyHrtime(this.records[id].end, {precise:true});
        delete this.records[id].start;
        delete this.records[id].end;
    }

};

module.exports = timer;