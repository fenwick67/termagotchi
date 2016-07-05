//main interface

var Canvas = require('burlap-canvas')
var drawTerma = require('../lib/draw-terma');
var _ = require('lodash');
var util = require('util');

var TERMA_X = 1;
var TERMA_Y = 1;

module.exports = function(terma,program,done){
    
  console.log(util.inspect(program.cli));
  
  var canvas = new Canvas({
    write:program.write,
    getWidth: function(){return process.stdout?process.stdout.columns:100},//TODO fix this in xplat-cli so we can get height/width.  Pass an object in the constructor.
    getHeight: function(){return process.stdout?process.stdout.rows:100}  
  });
  
  var ctx = canvas;
  
  // draw terma
  function draw(){
    //ctx.clear();
    drawTerma(canvas,terma,TERMA_X,TERMA_Y);
    drawButtons(position);    
    drawHelpIfEnabled();
  }
  
  var helpShown = false;
  function toggleHelp(){
    helpShown = !helpShown;
    if (!helpShown){
      ctx.clear();
      draw();
    }
  }  
  function drawHelpIfEnabled(){//TODO
    if (helpShown){drawHelp()}
  }
  function drawHelp(){
    ctx.lineStyle = "blue";
    ctx.fillStyle="black";
    ctx.textStyle="white";
    ctx.drawBorderedRect(1,1,40,20,"Some help will go here.  Press H to close.");
  }
  
  var position = [4,0];// which button selected (row,column)
  
  var buttons = [// butons to show and which functions they run
    [
      ["Feed",fs],
      ["Play",fs],
      ["Nap",fs],
      ["Toilet",fs],
      ["Bath",fs]
    ],
    [
      ["help",toggleHelp]
    ]
  ];

  function fs(){}
  

  function drawButtons(){
    
    var BUTTON_ROW_WIDTH = 70;
    var BUTTON_X = 2;
    var BUTTON_Y = 34;
    var BUTTON_SPACING = 1;
    var BUTTON_HEIGHT = 3;
        
    var biggestRowCount = 0;// number of buttons I have to show in the widest row
    var maxSize = 0;
    
    //get the number of buttons in rows and string length of each button
    
    buttons.forEach(function(row,rowIdx){
      var rowCount = 0;
      row.forEach(function(pair,colIdx){
        maxSize = Math.max(pair[0],maxSize);
        rowCount ++
      });
      biggestRowCount = Math.max(biggestRowCount,rowCount);      
    });
    
    // now take the biggest row count and calculate button size based on padding
    
    var totalButtonWidth = BUTTON_ROW_WIDTH - BUTTON_SPACING*(1+biggestRowCount);
    
    var buttonWidth = Math.floor( totalButtonWidth / biggestRowCount );
    
    
    // draw buttons
    
    //draw the active one as blue
    
    ctx.textStyle = 'bright.white';
    ctx.lineStyle = 'bright.yellow';
    ctx.fillStyle= "green";
    
    buttons.forEach(function(row,rowIdx){
      row.forEach(function(pair,colIdx){
        if (rowIdx == position[0] && colIdx == position[1]){
          //draw brighjt
          
          ctx.lineStyle = 'bright.yellow';
          ctx.fillStyle="blue";
        }else{
          
          ctx.lineStyle = 'yellow';
          ctx.fillStyle="green";
        }
        
        var txt = _.pad(pair[0],buttonWidth-2);
        
        var x = BUTTON_X + colIdx*(buttonWidth+BUTTON_SPACING) + BUTTON_SPACING;
        var y = BUTTON_Y + rowIdx*(BUTTON_HEIGHT+BUTTON_SPACING) + BUTTON_SPACING;
                 
        ctx.drawBorderedRect(x,y,buttonWidth,BUTTON_HEIGHT,txt);
        
      });    
    });      
    
  }
     
  var ESC = String.fromCharCode(27);
  var ENTER = '\r';
  var ARROW_UP = ESC + '[A';
  var ARROW_DOWN = ESC + '[B';
  var ARROW_RIGHT = ESC + '[C';
  var ARROW_LEFT = ESC + '[D';
  var REFRESH = 'r';
  
  //listen for keypresses
  program.on('data',function(str){
    console.log(str);
    if (contains(str,'h')){
      toggleHelp();
    }else if (contains(str,ARROW_LEFT)){
      position[1] = position [1] - 1;
      clipPosition();
    }else if (contains(str,ARROW_RIGHT)){
      position[1] = position [1] + 1;      
      clipPosition();
    }else if(contains(str,ARROW_DOWN)){
      position[0] = position [0] + 1;      
      clipPosition();
    }else if (contains(str,ARROW_UP)){
      position[0] = position [0] - 1;      
      clipPosition();
    }else if (contains(str,REFRESH)){
      ctx.clear();
    }else if (contains(str,ENTER)){
      //get the function associated with that button and call it
      clipPosition();
      var f = buttons[position[0]][position[1]][1];
      if (f){
        f();
      }else{
        console.log('cursor position not valid');
      }
      
    }else{
      
    }
    draw();
  }); 
  
  function clipPosition(){//loop position around when messing with it.

    //up/down overflow
    var nRows = buttons.length;
    
    if (position[0] < 0){
      position[0] = nRows - 1;
    }else if (position[0] >= nRows){
      position[0] = 0;
    }
    
    // left/right overflow    
    var nColumns;
    if (buttons[position[0]]){
      nColumns = buttons[position[0]].length;
    }else{
      nColumns = 1;
    }
    
    if (position[1] < 0){
      position[1] = nColumns - 1;
    }else if (position[1] >= nColumns){
      position[1] = 0;
    }   
       
  }
    
}

function contains(a,b){//string a contains b
  if (!a||!b){return false;}
  return a.indexOf(b) >= 0;
}