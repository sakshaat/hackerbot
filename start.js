var express = require('express')
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var querystring = require('querystring');
var http = require('http');

var app = express()

// var connector = new builder.ConsoleConnector({
//     appId: "7e6b091f-c19b-465a-8b18-776f84abee34",
//     appPassword: "y5xCerUc8KdoMP8qHP5htB8"
// });

var connector = new builder.ConsoleConnector({

     appId: "7e6b091f-c19b-465a-8b18-776f84abee34",
     appPassword: "y5xCerUc8KdoMP8qHP5htB8"

}).listen();

var bot = new builder.UniversalBot(connector);

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
    return JSON.stringify(ret);
}

var sendPost = function(ip, port, data, session) {

    var datas = JSON.stringify({code: data});

    var options = {
        host: ip,
        port: port,
        path: '/controller',
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json'
        }
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
           session.send("body: " + chunk);
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

bot.dialog('/', [
	function(session, args, next){
		builder.Prompts.text(session, "Enter input!");
	},
	function(session, results){
	    //session.send(results.response);
	    var parsed = replaceVars(results.response);
        var log = sendPost("138.51.95.148",8081,parsed,session);
	    session.send(log);
	    
	} /*waterfall chaining - result of first is fed to second */
]);

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.get('/a', function(req, res) {
    res.send('HIIIIII!!!!')
})

app.listen(8081, function () {
    console.log('App listening on port 8081!')
})


//1346087762122533
//2f71d969e9ed55bb7c8af4b163b3c943
//EAATIQnrl1yUBAHKUSVkkUIu55LGSxb4Hq5mapOkci7PZAiqlG4hAxSTe8fZBZBa7tE2lfaxk5tCHHZCpqyVPt9MdJqgAXcxl7PUfDquxndNRMKqACTx5ruNoAhPO5cSaBboFjKQsdR1TUhKgt5dDD5ZCo5OLIk3Jil90mVg4zhwZDZD

