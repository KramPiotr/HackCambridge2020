var express = require("express");
var router = express.Router();
var DatabaseAPI = require("../db/DatabaseAPI");
console.log("Setting up websocket");
router.ws('/', function(ws, req) {
  console.log("Somebody connected");
  ws.on('close', ()=>{
    console.log("Someone closed its connection with the websocket!");
  });
  ws.on('message', msg =>{
    //console.log("ELo elo elo "+msg);
    console.log("New message received:  "+msg);
    msg = JSON.parse(msg);
   // console.log("New message received:  "+msg);
    //console.log(msg)
    //console.log("xdxdxdxd "+ msg);
    if(msg.type.startsWith("getData")){
      let filter = {latitude:{
        $gte: msg.leftCorner[0],
        $lte: msg.rightCorner[0]
      },
       longtitude:{
         $gte: msg.leftCorner[1],
         $lte: msg.rightCorner[1]
       }};
     DatabaseAPI.retrieve(kind="bin", criteria=filter).then(binRes=>{
       filter.polluted={
         $gte: 3  
       };
        DatabaseAPI.retrieve(kind="map", criteria=filter).then(mapRes=>{
          answer = {
            type: "mapData",
            bin: binRes,
            map: mapRes
          };
          if(msg.type==="getDataWeb"){
            //ws.send(JSON.stringify(binRes)+"|"+JSON.stringify(mapRes));
            answer = {};
            answer["_"+JSON.stringify(binRes)] = 0;
            answer["_"+JSON.stringify(mapRes)] = 0;
          }
            ws.send(JSON.stringify(answer));
          
          //console.log("xd" + binres+" eloelo "+mapRes);
          
        })
      });
    }
    if(msg.type==="scoreUpdate"){
      DatabaseAPI.getUser({id: msg.userID}).then(user=>{
        //console.log("beczja w chuj", user);
        if(user.length==0){
          //console.log("Length of 0");
          user = {
            score: 0
          };
        }else{
          //console.log("Otherwise user is an array "+user);
          user = user[0];
        }
        DatabaseAPI.updateUser({id: msg.userID, score: user.score+msg.scoreDelta});
      })
    }
    if(msg.type==="getScore"){
      DatabaseAPI.getUser({id: msg.userID}).then(user=>{
        if(user.length==0){
          user = {
            score: 0
          };
        }else{
          user = user[0];
        }
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