/*
Ayoooooo

*/

var Cli = require('xplat-cli');
var cli = Cli();
var _ = require('lodash');
var Terma = require('./lib/terma')
var chalk = require('chalk');
chalk.enabled = true;

// get terma for user
var Synchronizer = require('./lib/synchronizer');
var synchronizer = new Synchronizer();
var myTerma = null;

synchronizer.getTerma(function(er,terma){
  if (er){
    console.error('COULDNT GET TERMA',er);
  }else{
    console.log(terma);
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
  .command('__intro',require('./commands/intro'))
  .command('help',require('./commands/help'))
  .command('login',function(args,done){
    require('./commands/login')(myTerma,done)
  })
  .command('status',function(args,done){
    var p = this;
    p.write('\n');
    if(!myTerma){
      p.write('couldnt get termagotchi :(');
      return done();
    }else if (myTerma.status.alive == false){
      
      p.writeln([chalk.red('YOU KILLED YOUR TERMAGOTCHI!'),'',chalk.red('YOU MONSTER'),'',`RIP ${myTerma.name}, they were ${myTerma.status.age} days old.  So young...`,'',"Don't worry, we've made a new one for you."].join('\n'));
      myTerma = new Terma();
      
      p.writeln('Their name is '+myTerma.name+'.  Please take better care of this one!\n\n' );
      done();
      
    }else{//todo: show graphs or table
      p.writeln('Here\'s how "'+myTerma.name+'" is doing:');
      var graphable =   ['stomach','comfort','energy','fun','bladder'];
      
      p.writeln(_.repeat(' ',14) + _.repeat('_',10));
      _.each(graphable,function(prop){
        var val = myTerma.status[prop];   
        var block = String.fromCharCode(9608);//todo: block character
        var chart = _.padEnd(_.repeat(block,Math.round(val*10)),10);
                
        if (val < .3){
          chart = chalk.red(chart);
        }else if (val < .7){
          chart = chalk.yellow(chart);
        }else{
          chart = chalk.green(chart);
        }
        
        var s = ' ' + _.padEnd(prop,10) + ': |'+chart+'|';
        p.writeln(s);
        
      });      
      p.writeln(_.repeat(' ',14) + _.repeat(String.fromCharCode(9472),10));
      done();
    }
  })
  .command('feed',function(args,done){
    myTerma.feed();
    cli.run('status');
    done();
  })
  .run('__intro')
}
