//setup

var GitHub = require('github-api');// this is undocumented :((
var request = require('request');
var gistManager = require('./gist-manager');
var prefSaver = require('./pref-saver');
var util = require('util');

module.exports = function(args,done){
  var p = this;
  
  gistSetup();
  
  p.on('enter',quitOnQ);
  
  function gistSetup(){
    p.prompt(
      [ '(just type "Q" at any time and hit "Enter" to quit)',
        "Now... let's get you set up with a Github Gist.",
        "",
        "Gists are where Termas live when you're not interacting with them on your computer.",
        "Enter a github Personal Access Token to continue.",
        "What's that?  Check out https://help.github.com/articles/creating-an-access-token-for-command-line-use/",
        "Be sure to allow the 'Gist' permission with it.",
        '',
        "(this is an open source project.  If you don't trust the author with your access tokens, you can read the code yourself at https://github.com/fenwick67/termagotchi)",
        ''
      ].join('\n'),gotPat
    )
  }
  
  function gotPat(res){
    
    p.write('\nOkay.  Now we will see if you already have a terma gist available...\n')
    var token = res.replace(/\s/i,'');
    
    var client = new GitHub({token:token});
    client.getUser().listGists(function(er,gists){
      if (er){
        p.write('\nUh oh... something went wrong getting your gists.  Sorry :( \n');
        return done();
      }else{
        var termaGist = _.find(gists,function(gist){
          return (gist.files && gist.files.terma);
        });
        
        if (!termaGist){// no gist yet.  Create one.
          p.write("\nLooks like you're new.  We'll make a gist for you.  Sit tight.\n");
          
          // TODO implement this method
          gistManager.createTermaGist({},function(er,id){
           if (er){
             p.write("\nUh-oh, we had an issue making your gist.\n"+util.inspect(e)+'\n');
           }           
           p.write("\Created your gist!  You're good to go\n");
           setSaveMode({gist:{id:gist.id,token:token}});
          })
        }else{// hey, there's a gist!  Awesome!  Fetch it and then kick us out of setup.
          p.write("\nFound gist.  Fetching...\n");
          gistManager.getTermaGist(termaGist,function(er,data){
            
          })
        }
      }
    });
    
  }
    
  function quitOnQ(s){
    var stripped = s.replace(/\s/i,'')
    if (stripped.length == 1 && /q/i.test(stripped)){
      p.write('Quitting...');
      done();
      return true;
    }
    return false;
  }
  
}
