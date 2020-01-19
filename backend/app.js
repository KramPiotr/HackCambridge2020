var express = require('express');
var app = express();
var expressWs = require('express-ws');
expressWs(app);
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://172.20.4.157:1234')
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

app.listen(3000, '172.20.3.69');

