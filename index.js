/*
Ayoooooo

*/

var Cli = require('xplat-cli');
var cli = Cli();
var _ = require('lodash');
var Terma = require('./lib/terma')
var chalk = require('chalk');
var main = require('./commands/main.js');
chalk.enabled = true;

// get terma for user
var Synchronizer = require('./lib/synchronizer');
var synchronizer = new Synchronizer();
var myTerma = null;

synchronizer.getTerma(function(er,terma){
  if (er){
    console.error('COULDNT GET TERMA',er);
  }else{
    //console.log(terma);
    myTerma = terma;
    run();
    setInterval(function(){
      synchronizer.saveTerma(myTerma);
    },5000);
  }
});

function run(){
  cli
  .delimiter('~*~')
  .command('main',function(args,done){
    main(myTerma,this,done); 
  })
  .run('main')
}
