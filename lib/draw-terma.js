// draw terma

// draw the terma and his status bars
var _ = require('lodash');
var evos = require('../evos')

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
  var left = 5;
  var top = 2;
  
  ctx.textStyle = 'bright.green';
  ctx.fillStyle = "black";
  ctx.fillRect(xOffset+left,yOffset+top,terma.name.length,1,terma.name);
  
  var s = '(' + terma.sex.charAt(0).toUpperCase() + ')';
  if (s == '(M)'){
    ctx.textStyle = 'blue.bright';
  }else{
    ctx.textStyle = 'magenta.bright';
  }  
  ctx.fillRect(xOffset+left+terma.name.length+1,yOffset+top,s.length,1,s);
  
  var ageS = 'Age: ' + terma.age.toFixed(2);
  
  ctx.textStyle = 'green.bright';
  ctx.fillRect(xOffset+left+terma.name.length+1+4,yOffset+top,ageS.length,1,ageS);
    
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

// TODO better anim system than just incrementing every time
var animIndex = 0;
function drawTerma(ctx,terma,xOffset,yOffset){//load the image file and replace with terma's colors
  animIndex ++;
  var images = evos.imagesForAnim(terma.evo,terma.mood,terma.colors);  
  animIndex = animIndex % images.length;
  var image = images[animIndex];
  
  ctx.drawImage(xOffset + 1,yOffset + 4,image.width,image.height,image.data)
}

