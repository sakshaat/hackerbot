/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://docs.botframework.com/en-us/node/builder/chat/dialogs/#waterfall
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var querystring = require('querystring');
var http = require('http');
var useEmulator = (process.env.NODE_ENV == 'development');
var intents = new builder.IntentDialog();
var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});
var bot = new builder.UniversalBot(connector);

var scripts = {
    htvrr:'firefox https://www.youtube.com/watch?v=dQw4w9WgXcQ;gedit;terminal',
    htvcf:'mkdir a;touch b.txt;touch a/c.txt;mkdir c'
};
var strA = "No more commands";

var parse = function(result) {
    
    var sp = result.split(";");
    // var ret = [];
	// for (var i = 0; i < sp.length; i++){
    //     ret.push(sp[i]);
	// }

	return sp;
}

var  replaceVars = function(code) {
    var parsed = parse(code);
    var def = parsed[0];
    var vars = def.split(" ");
    if (vars[0] == "def") {
        vars.splice(0, 1);
        vars = vars[0].split(",");
        console.log(vars.toString());
        parsed.splice(0,1);
    } else {
        console.log(parsed);
        return parsed;
    }

    var pCode = parsed.toString();
    for (var i = 0; i < vars.length; i++) {
        console.log(vars[i].toString());
        pCode = pCode.replace("{"+i.toString()+"}", vars[i]);
    }

    var ret = pCode.split(",");
    console.log(ret);
    return ret;
}

var execCallback = function(log, session) {
    session.send(log);
    
}

var sendPost = function(ip, port, route, data, session, callback) {

    var datas = JSON.stringify({code: data});

    var options = {
        host: ip,
        port: port,
        path: route,
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json'
        }
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            var toReturn = chunk;
            callback(toReturn, session);
        });
    });

    req.write(datas);
    req.end();

    // var req = new XMLHttpRequest();
    // req.open('POST', 'http://'+ip+':'+port.toString()+'/controller');
    // req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    // var obj = {hello:'world'};
    // req.send(JSON.stringify(obj));
}

var devices = {Kalindu : ["138.51.96.241", "8081", "/controller"],
                Sakshaat: ["138.51.95.148", "8081", "/controller"]}

var connected = devices["Kalindu"];


bot.dialog('/', intents);

intents.matches(/^choose current device/i, [
    function(session) {
        builder.Prompts.choice(session, "Which device would you like to work with?", devices);   
    },
    function(session, results) {
        if(results.response) {
            var choice = results.response.entity;

            if (results.response.entity in devices) {
                connected = devices[results.response.entity];
                session.send("The device is now active.");
            } else {
                session.send("Alright, that's ok.");
            }

            session.endDialog();
            
        }
    } 


]);

intents.matches(/^check paired devices/i, [
    function (session) {
        session.send("Here are your currently connected devices:");
        for (var device in devices) {
            session.send(device + " located at" + devices[device][0]);
        }
    }
]);

intents.matches(/^hello/i, [
    function (session) {
        
        session.send("Hello I am here to assists you on running scripts from different computers");        
    }
  
]);

intents.matches(/^help/i, [
    function (session) {
        session.send("Please consult the experts");        
    }
    
    ]);

intents.matches(/^currently paired device/i, [

    function (session) {
        if(connected != undefined) {
            session.send("You are currently paired with: " + connected);
        } else {
            session.send("You are not currently paired with any device");
        }
    }
]);


intents.matches(/^remove/i, [
    function (session) {
        builder.Prompts.choice(session, "Which script would you like to delete?", scripts);   
           
    },
    function (session, results) {

        if(results.response) {
            var choice = results.response.entity;
            session.endDialog();
            if (results.response.entity in scripts) {
                delete scripts[results.response.entity];
                session.send("Your script has been updated");
            } else {
                session.send("Alright, that's ok.");
                
            }
            
        }

    }
]);

intents.matches(/^run/i, [
    function (session) {
        builder.Prompts.choice(session, "Which script would you like to run?", scripts);   
           
    },
    function (session, results) {

        if(results.response) {
            var choice = results.response.entity;
            if (results.response.entity in scripts) {
                var parsed = replaceVars(scripts[results.response.entity]);
                var log = sendPost(connected[0], connected[1], connected[2], parsed, session, execCallback);
                session.send("Your script has been run, here is the log");
                session.send(log);
            } else {
                session.send("Alright, that's ok.");
                
            }
            

        }
        //session.endDialog();
    }
]);

intents.matches(/^run latest/i, [
    function (session) {
        
        session.send("Your script is now running");
        
        
    },
    //function (session, results) {
     //   session.send('Ok... Changed your script name to %s', session.userData.name);
    //}
]);

intents.matches(/^make new/i, [
     function (session) {
        
        session.beginDialog('/commandprompt');
        
        
    }
    
]);

intents.onDefault([
    function (session) {
        session.send("I am here to help");
    }
]);    

intents.matches(/^list current scripts/i, [

    function (session) {
        session.send("Here you go.");
        for (var key in scripts) {
            session.send(key+"  \n  "+scripts[key]);
        }
    }
    //function (session, results) {
     //   session.send('Ok... Changed your script name to %s', session.userData.name);
    //}

]);
bot.dialog('/saveScript', [
    function(session){
        builder.Prompts.text(session, ' What\'s the name of the Command you would like to add today?');
        
        //session.send('Hello!');
        //session.endDialog();
     },
    function(session, results){
        
        session.userData.cname = results.response;
        builder.Prompts.text(session, ' Pass me the script so I can link them up ');
    },
    function(session, results){
        console.log("LOGGGG");
        scripts[session.userData.cname] = results.response;
        session.send("Success!");
        session.endDialog();
        
    }

    
]);

bot.dialog('/commandprompt', [
    function(session) {
        console.log("Prompt");
        builder.Prompts.choice(session, "Would you like to make a script?", ["Yes", "No"]);   
    },
    function(session, results) {
        if(results.response) {
            var choice = results.response.entity;
            session.endDialog();
            if (choice == "Yes") {
                session.beginDialog('/saveScript');
            } else {
                session.send("Alright, that's ok.");
                
            }
            
        }
    } 


    ]
);


if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
