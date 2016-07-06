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
  var status = terma.getState().status; 
  
  stats.forEach(function(stat,index){
   //draw a chart
    drawChart(canvas,CHART_X+x,CHART_Y+index+y,status[stat],stat);
  });
  
}

function drawChart(ctx,x,y,value,text){
  var title = _.padStart(text,10) + ': ';
  ctx.textStyle = 'white.bright';
  ctx.fillStyle = "black";
  ctx.fillRect(x,y,25,1,title);
  
  if (value < .3333 || !value){
    ctx.lineStyle = "bright.red";
  }else if (value < .6){
    ctx.lineStyle = "yellow";
  }else{
    ctx.lineStyle = "bright.green";
  }
  //draw bars
  //console.log(value);
  
  var count = Math.min(Math.round(value * 10),10) -1;
  if (count < 0){
    return;
  }
  //console.log(count);
  ctx.drawLine(x+12,y,x+12+count,y);  
}


function drawTerma(){//load the image file and replace with terma's colros
  
}
