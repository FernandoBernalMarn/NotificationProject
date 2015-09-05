var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var port = process.env.PORT || 5000;
var pg = require('pg');
var room;

/* Express js */
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, function(){
  console.log("Express server listening");
});

/* Socket.io */
io.on('connection', function(socket){

	var clients = [];
	clients.push(socket.id);

	io.emit('socketName',clients);

	socket.on('high', function (data){
		var packageName = shotrAppName(data);
		socket.broadcast.emit('high', packageName);
	});

	socket.on('low',function (data){
		var packageName = shotrAppName(data);
		socket.broadcast.emit('low', packageName);
	});
});

function shotrAppName (namePackage){

	var ledName;

	switch(namePackage){
		case "com.facebook.katana":
			ledName = "P8_13";
			break;
		case "com.google.android.gm":
			ledName = "P8_14";
			break;
		case "com.whatsapp":
			ledName = "P8_15";
			break;
	}

	return ledName;
};