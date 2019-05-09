const dgram = require(dgram);

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
        /*
        * If you add twice the same key in a map, it will update the value of this key.
        * Therefore you don't need to check wheter a key is already in the map or not
        */
        musicians.set(receivedInf.uuid, receivedInf);
    }
}

function removeMusicianFromList(){
    musicians.forEach((item, key, musicians)) => {
        var diff = moment().diff(moment(item.time), "seconds");
        if(diff > 5){
            musicians.delete(key);
        }
    })
}

setInterval(removeMusicianFromList, 1000);
