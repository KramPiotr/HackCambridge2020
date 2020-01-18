var express = require("express");
var router = express.Router();
var DatabaseAPI = require("../db/DatabaseAPI");

router.ws('/', function(ws, req) {
  console.log("Somebody connected");
  ws.on('close', ()=>{
    console.log("Someone closed its connection with the websocket!");
  });
  ws.on('message', msg =>{
    msg = JSON.parse(msg);
    if(msg.type="getData"){
      let filter = {latitude:{
        $gt: msg.leftCorner[0],
        $lt: msg.rightCorner[0]
      },
       longtitude:{
         $gt: msg.leftCorner[1],
         $lt: msg.rightCorner[1]
       }};
     DatabaseAPI.retrieve(kind="bin", criteria=filter).then(binRes=>{
        DatabaseAPI.retrieve(kind="map", criteria=filter).then(mapRes=>{
          answer = {
            type: "mapData",
            bin: binRes,
            map: mapRes
          };
          ws.send(JSON.stringify(answer));
        })
      });
    }
    if(msg.type="scoreUpdate"){
      DatabaseAPI.getUser({id: msg.userID}).then(user=>{
        DatabaseAPI.updateUser({id: msg.userID, score: user.score+msg.scoreDelta});
      })
    }
    if(msg.type="getScore"){
      DatabaseAPI.getUser({id: msg.userID}).then(user=>{
        answer={
          type: "score",
          userID: msg.userID,
          score: user.score
        };
        ws.send(JSON.stringify(answer));
      });
    }
  });
});

module.exports = router;