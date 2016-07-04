/* Statistics of a fleet group */

var attackstatistics = function() {
    this.ap = 0; /* Damage points per turn */
    this.sp = 0; /* Shield usage per turn */
    this.sh = 0; /* Amount of shots */
};

attackstatistics.prototype.reset = function(){
    this.ap = 0;
    this.sp = 0;
    this.sh = 0;
};

module.exports = attackstatistics;
