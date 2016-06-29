//intro program

var _ = require('lodash');

var intro = [
    "A strange new being has been discovered.",
    "These beings live in our computers, we have decided to call them Termagotchis.",
    "Nobody knows anything about them... they just showed up one day.",
    "If you can manage to keep them healthy, it is said that they will bring you great joy.",  
  ];
  
module.exports = function(args,done){
  
  var p = this;
  
  //print intro strings
  var idx = 0;
  p.writeln(intro[0]);
  
  p.on('enter',function(){
    idx++;
    if (idx >= intro.length){
      if (done){return done();}
      return;
    }else{
      p.writeln(intro[idx]);
    }
  });
  
}