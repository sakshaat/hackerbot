/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://docs.botframework.com/en-us/node/builder/chat/dialogs/#waterfall
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var useEmulator = (process.env.NODE_ENV == 'development');
var intents = new builder.IntentDialog();
var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});
var bot = new builder.UniversalBot(connector);

var commands = [];
var scripts = [];
var strA = "No more commands";

var model = 'https://api.projectoxford.ai/luis/v2.0/apps/398825ec-08dc-4a01-8ee2-b49e8bba6362?subscription-key=68144415b30b43b58b138fd90c31089f&verbose=true';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

dialog.matches('bot.hello', [
    function (session) {
        
        session.send("Hello I am here to assists you on running scripts from different computers");        
    }
  
]);

dialog.matches('bot.help', [
    function (session) {
        session.send("Please consult the experts");        
    }
    
    ]);

intents.matches(/^check connected devices/i, [
    function (session) {
        session.send("Here are your currently connected devices: 19.2.186.1.2, 11.4552.3312");        
    }
    
]);


intents.matches(/^remove/i, [
    function (session) {
        commands.pop();
        session.send("Your script has been updated");
        
        
    },
    //function (session, results) {
     //   session.send('Ok... Changed your script name to %s', session.userData.name);
    //}
]);

intents.matches(/^run latest/i, [
    function (session) {
        
        session.send("Your script is now running");
        
        
    },
    //function (session, results) {
     //   session.send('Ok... Changed your script name to %s', session.userData.name);
    //}
]);

intents.matches(/^make new^/i, [
     function (session) {
        
        session.beginDialog('/badcommand');
        
        
    },
    
]);

intents.onDefault([
    function (session) {
        session.send("I am here to help");
        session.beginDialog('/badcommand');
    }
]);    
intents.matches(/^list current commands/i, [
    function (session) {
        session.send("%s", commands.toString());
        
        
        
        
    },
    //function (session, results) {
     //   session.send('Ok... Changed your script name to %s', session.userData.name);
    //}
]);
intents.matches(/^list current scripts/i, [

    function (session) {
        if(scripts.length != 0){
            for(var i = 0; i < scripts.length; i++){
                session.send("%i %s", i+1,scripts[i]);
            }
        }else{
            session.send("Command list is empty. Type \'make new\' to add commands.")
        }
    }
    //function (session, results) {
     //   session.send('Ok... Changed your script name to %s', session.userData.name);
    //}

]);
bot.dialog('/badcommand', [
    function(session){
        //builder.Prompts.text(session, ' What\'s the name of the Command you would like to add today?');
        session.send('Hello!');
        session.endDialog();
     }
    // function(session, results){
        
    //     session.userData.cmon = results.response;
      
    //     commands.push(results.response);
    //     session.send('Your command name "%s" has been saved.', session.userData.cmon);
    //     session.endDialog();
    //     session.beginDialog('/makescript')
        
        
    // }
]);

bot.dialog('/makescript', [
    function(session){
        builder.Prompts.text(session, ' Pass me the script so I can link them up ');
        //session.send('What would you like the new name to be?');
    },
    function(session, results){
        
        session.userData.script = results.response;
      
        scripts.push(results.response);
        session.send('Your script "%s" has been linked up.', session.userData.script);
        
        session.endDialog();
        
    }
]);



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