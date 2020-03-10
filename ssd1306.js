/*
   SSD1306 OLED Clock
   Demonstrates the text functions of the oled-i2c-bus library
   created 24 Feb 2020
   by Tom Igoe
*/

const i2c = require('i2c-bus');
const i2cBus = i2c.openSync(1);
const screen = require('oled-i2c-bus');
const font = require('oled-font-5x7');

var opts = {
   width: 128,     // screen width and height
   height: 64,
   address: 0x3C  // I2C address:check your particular model
};

// make an instance of the OLED library
var oled = new screen(i2cBus, opts);
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
oled.setCursor(12,0);
oled.writeString(font,1, "sandbox370",1, true);
oled.setCursor(12,12);
oled.writeString(font,1,"192.168.0.1",1,true);
oled.setCursor(0,32);
oled.writeString(font, 2, "TEM:20°C\nHUM:15%", 1, true);

/*
function showTime() {
   // clear the screen:
   oled.clearDisplay();
   // set cursor to x = 0 y = 0:
   oled.setCursor(0, 0);
   // generate new datetime object:
   let now = new Date();
   // make a string of th time:
   let time = now.getHours() + ':'
      + now.getMinutes() + ':'
      + now.getSeconds();
   // write it to the screen:
   oled.writeString(font, 1, time, 1, true);
}
*/
// update once per second:
//setInterval(showTime, 1000);
