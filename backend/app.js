var express = require('express');
var app = express();
var expressWs = require('express-ws');
expressWs(app);
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://172.20.10.11:1234')
client.on('connect', function () {
    client.subscribe('bin', function (err) {
      if (err){
          console.log("Error appeared when subscribing");
      }else{
          console.log("Connected to bin mqtt topic successfully");
      }
    });
    client.subscribe('map', function (err) {
        if (err){
            console.log("Error appeared when subscribing");
        }else{
            console.log("Connected to map mqtt topic successfully");
        }
      });
});
client.on('message', function (topic, message) {
    console.log("Received "+message.toString()+" from topic "+topic);
    msg = JSON.parse(message.toString());
    DatabaseAPI.save(msg);
  })
var DatabaseAPI = require('./db/DatabaseAPI');
DatabaseAPI.connect().then(()=>{
    // let fakeData={
    //     bins:[[52.206758, 0.111072],
    //         [52.206679, 0.113701],
    //         [52.208717, 0.111148],
    //         [52.208438, 0.118490],
    //         [52.204777, 0.119734],
    //         [52.205148, 0.119394],
    //         [52.204852, 0.118851]],
    // }
    // i = 10
    // for(coordinations of fakeData.bins){
    //     i+=1;
    //     coordinations[0]+=Math.random()*0.006 * Math.pow(-1, i)
    //     coordinations[1]+=Math.random()*0.004 * Math.pow(-1, i)
    //     DatabaseAPI.save({id: i, latitude: coordinations[0], longtitude: coordinations[1], polluted: Math.floor(Math.random()*10)});
    //     i+=3;
    //     coordinations[0]+=Math.random()*0.007 * Math.pow(-1, i)
    //     coordinations[1]+=Math.random()*0.005 * Math.pow(-1, i)
    //     DatabaseAPI.save({id: i, latitude: coordinations[0], longtitude: coordinations[1], polluted: Math.floor(Math.random()*10)});
    // }
    // DatabaseAPI.save({id: 1, latitude: 0, longtitude: 0, full: 50});
    // DatabaseAPI.save({id: 2, latitude: 10, longtitude: 10, full: 20}); 
    // DatabaseAPI.save({id: 3, latitude: 5, longtitude: -5, full: 40});
    // let filter = {latitude:{
    //     $gt: 4,
    //     $lt: 11
    //   },
    //    longtitude:{
    //      $gt: 4,
    //      $lt: 6
    //    }}; 
    // DatabaseAPI.retrieve(kind="bin", criteria=filter).then(res => console.log(res));
});

var mapRouter = require("./routes/map");
app.use("/map", mapRouter);
//var testRouter = express.static("./routes/"//require("./routes/testAPI");
//app.use("/testAPI", testRouter);

app.listen(3000, "0.0.0.0");

