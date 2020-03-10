const https = require('https');
const sensor = require('node-dht-sensor');
const i2c = require('i2c-bus');
const i2cBus = i2c.openSync(1);
const screen = require('oled-i2c-bus');
const font = require('oled-font-5x7');
const Wifi = require('rpi-wifi-connection');
const wifi = new Wifi();

var opts = {
    width: 128, // screen width and height
    height: 64,
    address: 0x3C // I2C address:check your particular model
};

var oled = new screen(i2cBus, opts);

var hostName = 'tigoe.io'; // add the host name here
var t = 0.0;
var h = 0.0;

/*
 set up the options for the request.
 the full URL in this case is:
 http://example.com:443/login
*/

/*
        the callback function to be run when the response comes in.
        this callback assumes a chunked response, with several 'data'
        events and one final 'end' response.
*/

/*
        the callback function to be run when the response comes in.
        this callback assumes a chunked response, with several 'data'
        events and one final 'end' response.
*/

function callback(response) {
    var result = ''; // string to hold the response

    // as each chunk comes in, add it to the result string:
    response.on('data', function (data) {
        result += data;
    });

    // when the final chunk comes in, print it out:
    response.on('end', function () {
        console.log(result);
	if(result){
		oled.setCursor(96,4);
		oled.writeString(font,1,'Sent',1,true);	
	}else{
		oled.setCursor(96,4);
		oled.writeString(font,1,'Error',1,true);
	}
    });
}

sensor.read(11, 4, function (err, temperature, humidity) {
    if (!err) {
        t = temperature;
        h = humidity;
        let str = `temp: ${temperature}°C, humidity: ${humidity}%`;


        var sensorData = JSON.stringify({
            'temperature': t,
            'humidity': h
        });
        
        // make the POST data a JSON object and stringify it:
        var postData = JSON.stringify({
            'macAddress': 'B827EB09DC9A', // add your mac address here
            'sessionKey': '92f7903d-5343-4853-8e4a-cd1243e9efcc', // add your session key here
            'data': sensorData
        });
        
        var options = {
            host: hostName,
            port: 443,
            path: '/data',
            method: 'POST',
            headers: {
                'User-Agent': 'nodejs',
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };
        
        // make the actual request:
        var request = https.request(options, callback); // start it
        request.write(postData); // send the data
        request.end();

        oled.clearDisplay();
	oled.setCursor(0,0);
	oled.drawPixel([
        	[2,0,1],
        	[3,0,1],
        	[4,0,1],
        	[5,0,1],
        	[6,0,1],
        	[7,0,1],
        	[1,1,1],
        	[8,1,1],
        	[0,2,1],
        	[3,2,1],
        	[4,2,1],
        	[5,2,1],
        	[6,2,1],
        	[9,2,1],
        	[2,3,1],
        	[7,3,1],
        	[1,4,1],
        	[4,4,1],
        	[5,4,1],
        	[8,4,1],
        	[3,5,1],
        	[6,5,1],
        	[4,7,1],
        	[5,7,1],
        	[4,8,1],
        	[5,8,1]
	]);
	wifi.getState().then((connected) => {
    	if (connected){        
        	console.log('Connected to network.');
		wifi.getStatus().then((status) => {
    		console.log(status);
		oled.setCursor(12,4);
		oled.writeString(font,1,status.ssid,1, true);
		oled.setCursor(12,16);
		oled.writeString(font,1,status.ip_address,1,true);
	})
	.catch((error) => {
	    console.log(error);
	});
	}
	    else{
        	console.log('Not connected to network.');
		oled.setCursor(0,0);
		oled.writeString(font,2,"Not Connected",1,true);
		}
	})
	.catch((error) => {
    		console.log(error);
	});
	oled.setCursor(0,14);
	oled.writeString(font, 2, `TEM:${t}°C\nHUM:${h} %`, 1, true);
    }
});

