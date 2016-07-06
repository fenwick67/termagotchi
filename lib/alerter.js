//Alerter

//draw an alert on the screen  
  
module.exports = function(context,text,margin){
  var margin = margin || 2;
  context.textStyle = 'bright.white';
  context.fillStyle = 'blue';
  context.lineStyle = 'black.bright';
  
  context.drawBorderedRect(margin,margin,context.getWidth() - 2*margin,context.getHeight() - 2*margin,text);
    
}