const dgram = require('dgram');
const s = dgram.createSocket('udp4');
const uuid = require('uuid');
const moment = require('moment');

var instruments = new Map();
    instruments.set("piano", "ti-ta-ti");
    instruments.set("trumpet", "pouet");
    instruments.set("flute", "trulu");
    instruments.set("violin", "gzi-gzi");
    instruments.set("drum", "boum-boum");


const PROTOCOL_MULTI_ADDRESS = "239.255.22.5";
const PROTOCOL_PORT = 9907;

var myuuid = uuid.v4();

function Musician(instrument){
    this.instrument = instrument;
    var note = instruments.get(instrument);
    Musician.prototype.update = function(){
        
        var sound = {
            Note : note,
            Uuid : myuuid,
            timestamp : moment()
        };
        var payload = JSON.stringify(sound);
        message = new Buffer(payload);
        
        s.send(message, 0, message.length, PROTOCOL_PORT, PROTOCOL_MULTI_ADDRESS, function(err, bytes){
            console.log("Sending payload : " + payload + " via port " + s.address().port);
        });     
    }
    /*
*   Send note every second
*/  
    setInterval(this.update.bind(this), 1000);
}

var instrument = process.argv[2];
var musician1 = new Musician(instrument);

