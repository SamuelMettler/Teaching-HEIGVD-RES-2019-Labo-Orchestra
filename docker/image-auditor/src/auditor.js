const dgram = require('dgram');
const moment = require('moment');
const net = require('net');

const TCP_PORT = 2205;
const PROTOCOL_MULTI_ADDRESS = "239.255.22.5";
const PROTOCOL_PORT = 9907;

const s = dgram.createSocket('udp4');
s.bind(PROTOCOL_PORT, function(){
    console.log("Joining multicast group");
    s.addMembership(PROTOCOL_MULTI_ADDRESS);
});

var sound = new Map();
sound.set("ti-ta-ti", "piano");
sound.set("pouet", "trumpet");
sound.set("trulu", "flute");
sound.set("gzi-gzi", "violin");
sound.set("boum-boum", "drum");

var musicians = new Map();

s.on('message', function(msg, source){
    addMusicianToList(msg);
});

function addMusicianToList(msg){
    var received = JSON.parse(msg);
    var receivedInf = {
        uuid : received.Uuid,
        note : received.Note,
        time : received.timestamp
    }
        if(musicians.has(receivedInf.uuid)){
            musicians.get(receivedInf.uuid).time = received.timestamp;
        } else{
            musicians.set(receivedInf.uuid, receivedInf);
            musicians.get(receivedInf.uuid).firstReceived = received.timestamp;
        }
}


function removeMusicianFromList(){
    musicians.forEach((item, key, musicians) => {
        var diff = moment().diff(moment(item.time), "seconds");
        if(diff > 5){
            musicians.delete(key);
        }
    });
}

const server = net.createServer((socket) => {
    var message = [];
    musicians.forEach((item, key, musicians) =>{
        message.push({
            uuid : musicians.get(key).uuid,
            instrument : sound.get(musicians.get(key).note),
            activeSince : moment(musicians.get(key).firstReceived).format()
        });
    });
    socket.write(JSON.stringify(message));
    socket.end();
})

server.listen(TCP_PORT);
setInterval(removeMusicianFromList, 1000);
