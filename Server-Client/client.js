var socket = require('socket.io-client')('https://nameless-castle-1186.herokuapp.com/');
var bone = require('bonescript');
var sleep = require('sleep');

var state = 0;

bone.pinMode("P8_13", 'out');
bone.pinMode("P8_14", 'out');
bone.pinMode("P8_15", 'out');

var leds = [];
var timer;
var blinked = false;

socket.on('connect',function () {
	console.log('Server-Clien is connected...');
	bone.digitalWrite("P8_13", 1);
	bone.digitalWrite("P8_14", 1);
	bone.digitalWrite("P8_15", 1);

	//setTimeout(function(){ }, 15000);
	sleep.sleep(5)

	bone.digitalWrite("P8_13", 0);
	bone.digitalWrite("P8_14", 0);
	bone.digitalWrite("P8_15", 0);
});

socket.on('high',function (appName) {
	
	if(leds.indexOf(appName) == -1){
		leds.push(appName);
		console.log(leds);
	}

	setTimer();
});

socket.on('low',function (appName) {
	
	var index = leds.indexOf(appName);

	if(index >= 0){
		leds.splice(index,1);
	}

	setTimer();
});

function setTimer () {
	if(leds.length > 0 && blinked === false){
		timer = setInterval(function(){ blinkLed() }, 1000);
	}
	else{
		if(leds.length == 0 && blinked === true){
			clearInterval(timer);
			blinked = false;
		}
	}
};

function blinkLed () {

	blinked = true;

	for (i = 0; i < leds.length; i++){
		state = state ? 0 : 1;

		bone.digitalWrite(leds[i], state);
	}
};

	