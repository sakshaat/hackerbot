// Importing things
var cp = require("child_process");
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

// the application handler
var app = express();
var port = 8081;

// Required to properly parse post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// redirects all the traffic to the main page to the login page
app.get('/', function (req, res) {
   res.send('Listening for connection.');
});

function exec_callback(fail) {
	if(!fail) {
		return "Success!";
	} else {
		return "The code ended with an error.";
	}
}

function doWork(code, callback, codename, filename) {

	for (var i = 0; i < code.length; i++) {
		fs.appendFileSync(codename, code[i]+"\n");
	}

	var command = "./controller.sh";

	cp.spawn(command, [codename, filename]);

}


app.post('/controller', function(req, res) {
	var code = req.body.code;
	var filename="/tmp/.log.txt";
	var codename = "/tmp/.code.txt"; 

	fs.writeFileSync(codename, "")

    doWork(code, exec_callback, codename, filename);

    setTimeout(function() {
    	fs.readFile(filename, 'utf-8', function(err, data) {
	    	if (err) throw err;
	    	console.log(data);
	    	res.send(data);
    	});
    }, 500);
});


// Just a 404 page because whatever
app.get('*', function(req, res) {
    res.send('Error 404: Page not found.');
});



// Listens for all connections coming into port 8081
var server = app.listen(8081, function () {
   var host = server.address().address
   console.log("Example app listening at http://%s:%s", host, port)
});