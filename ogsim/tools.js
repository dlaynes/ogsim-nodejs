/* Misc tools */
var tools = function(){
};

/* Class functions */
tools.fillArray = function(val, num){

  var data = [], i=0;
  //while(i<num) {
  for(var i=0; i<num; i++){
    data.push(val.slice(0));
    //i++;
  }
  return data;

  /* Slower
  var data = new Array(num);
  var i=0;
  while (i<num) {
      data[i] = val.slice(0);
      i++;
  }
  return data;
  */
};

//TODO: please use me
tools.calcAverage = function(datalist){
  if(!datalist.length){ return 0; }
  if(datalist.length==1){ return datalist[0]; }

  var sum = 0;
  for(var i=0; i<datalist.length; i++ ){
    sum += datalist[i];
  }
  return sum / datalist.length;
};

//TODO: please use me
tools.calcStandardDeviation = function(datalist){
  if(!datalist.length){ return [0, 0]; }
  if(datalist.length==1){ return [0, datalist[0]]; } //avoid infinites

  var sum = 0, avg = tools.calcAverage(datalist), sdp;
  for(var i=0; i<datalist.length; i++ ){
    sum += (datalist[i] - avg) * (datalist[i] - avg);
  }
  sdp = (1 / (datalist.length - 1 ) ) * sum;
  return [Math.sqrt(sdp), avg];
};

tools.appendToArray = function(data, val, num){
    for(var i=0; i<num; i++){
        data.push(val.slice(0));
    }
};

tools.bytesToSize = function(bytes) {
   if(bytes === 0) return '0 Byte';
   var k = 1000;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
};

module.exports = tools;