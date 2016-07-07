// anims.json is generated
var anims = require('./anims.json');
var _ = require('lodash');
/*
get rgba images for evoname, animationName, colors

resolves animations down to "main" if not found

colors is: {
    "primary":[[0,0,0],[50,50,50]],
    "secondary":...    
  }  
  
*/
function imagesForAnim(evoName,animName,colors){

  //tree to determine which anim to fetch
  var evo = anims[evoName];
  if (!evo){
    throw new Error("Evo Name invalid");
  }
  var anim = pickAnim(evo,animName);
  
  var frames = _.map(anim,function(frame){
    return{
      width:frame.width,
      height:frame.height,
      data:colorize(frame.data.data,colors)
    };
  });
  
  return frames;
  
}

var fallbacks = {
  love:['happy'],
  stinky:['sad'],
  dead:['stinky','sad'],
  hungry:['sad']
}

//pick animation "animationName" in an evo animation object
function pickAnim(evo,animName){
  if (evo[animName]){
    return evo[animName];
  }
  else if(fallbacks[animName]){
    //get fallback animation if exists
    var fbArray = fallbacks[animName];
    for (var i = 0; i < fbArray.length; i ++){
      if (anims[fbArray[i]]){
        return anims[fbArray[i]];
      }
    }    
  }else{
    return evo.main;
  }
  
}



// turn imagedata into rgba array
function colorize(imageData,colors){
  
  // flattened colors in the pallette order
  var flat = [colors.primary[0],colors.primary[1],colors.secondary[0],colors.secondary[1]];
  
  var rgba = [];
  _.each(imageData,function(pixel){
    if (pixel == 0){
      Array.prototype.push.apply(rgba,[0,0,0,0]);
    }
    else if (pixel >= N_COLORS){
      Array.prototype.push.apply(rgba,flat[pixel - N_COLORS]||flat[0]);
      rgba.push(0);//alpha
    }
    else{
      Array.prototype.push.apply(rgba,RGB_FLAT[pixel-1]);
      rgba.push(0);//alpha
    }
  });
  
  return rgba;
}

var RGBs =
[//    dark         bright
  [[  0,  0,  0],[ 58, 58, 58]],// black
  [[178,  0,  0],[247, 48, 58]],// red
  [[  5,184, 26],[ 89,255, 68]],// green
  [[185,183, 26],[255,253, 67]],// yellow
  [[  0, 21,182],[ 85, 91,253]],// blue
  [[177,  0,182],[246, 55,253]],// magenta
  [[ 47,186,184],[ 86,255,255]],// cyan
  [[184,184,184],[255,255,255]] // white
]

var RGB_FLAT = _.flatten(RGBs);
var N_COLORS = RGB_FLAT.length;

module.exports = {
  imagesForAnim:imagesForAnim,
  anims:anims
}