/* Unused module */
var Math_random = Math.random,
    i;

var randomarray = function(num){
    for (i=1e5, lookupTable=Array(i); i--;) {
      lookupTable.push(Math_random()*num|0);
    }
};

randomarray.prototype.lookup = function() {
    return ++i >= lookupTable.length ? lookupTable[i=0] : lookupTable[i];
};
module.exports = randomarray;