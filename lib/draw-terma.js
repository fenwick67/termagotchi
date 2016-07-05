// draw terma

// draw the terma and his status bars
var _ = require('lodash');

var BAR_WIDTH = 10;
var CHART_X = 35;
var CHART_Y = 5;

module.exports = function(canvas,terma,x,y){
  
  drawGraphs(canvas,terma,x,y);
  drawTitle(canvas,terma,x,y);
  drawTerma(canvas,terma,x,y);
  
  //lala
  return;  
}

var stats = ['comfort','bladder','energy','fun','stomach'];

function drawTitle(ctx,terma,xOffset,yOffset){
  ctx.textStyle = 'bright.green';
  ctx.fillStyle = "black";
  ctx.fillRect(xOffset+5,yOffset+2,terma.name.length,1,terma.name);
}
// get terma's stats and show them
function drawGraphs(canvas,terma,x,y){
 stats.forEach(function(stat,index){
   //draw a chart
   drawChart(canvas,CHART_X+x,CHART_Y+index+y,terma.status[stat],stat);
 });
 
}

function drawChart(ctx,x,y,value,text){
  var title = _.padStart(text,10) + ': ';
  ctx.textStyle = 'white.bright';
  ctx.fillStyle = "black";
  ctx.fillRect(x,y,12,1,title);
  
  if (value < .3333){
    ctx.lineStyle = "bright.red";
  }else if (value < .6){
    ctx.lineStyle = "yellow";
  }else{
    ctx.lineStyle = "bright.green";
  }
  //draw bars
  var count = Math.round(value * 10);
  if (count = 0){
    return;
  }
  ctx.drawLine(x+12,y,x+12+count,y);  
}



function drawTerma(){
  
}

  
  