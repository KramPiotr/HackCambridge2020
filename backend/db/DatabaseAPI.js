const Bins = require("./binLayout");
const Maps = require("./mapLayout");
const Users = require("./userLayout");
const mongoose = require("mongoose");
const env = require('dotenv').config();

let connCache = {};
//debug date
class DatabaseAPI {

  static connect() {
    if (connCache.connection) {
      return connCache.connection;
    }
    return (connCache.connection = mongoose.connect(
      "mongodb://"+process.env.COSMOSDB_HOST+":"+process.env.COSMOSDB_PORT+"/"+process.env.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb&retryWrites=false", {
      auth: {
        user: process.env.COSMODDB_USER,
        password: process.env.COSMOSDB_PASSWORD
      }
    })
    .then(() => console.log('Connection to CosmosDB successful'))
    .catch((err) => console.error(err)));
  }

  static updateUser(record){
    Users.findOneAndUpdate({id: record.id}, record, {upsert:true}, (err, _)=>{
      if(err){
        console.error(err);
        return 400;
      }
      return 200;
    })
  }

  static getUser(criteria){
    return Users.find(criteria, function(err, results) {
      if (err){
        console.error(err);
        return 400;
      }
      return results;
    });
  }

  static save(record) {
    let Schema = Maps;
    if(typeof(record.polluted) == 'undefined'){
      Schema = Bins;
    }
    return Schema.findOneAndUpdate({id: record.id}, record, {upsert:true}, (err, _)=>{
      if(err){
        console.error(err);
        return 400;
      }
      return 200;
    });
  }


  static retrieve(kind, criteria) {
    let Schema = Maps;
    if(kind == "bin"){
      Schema = Bins;
    }
    return Schema.find(criteria, function(err, results) {
      if (err){
        console.error(err);
        return 400;
      }
      return results;
    });
  }

  static findOneAndUpdate(criteria, update) {
    let Schema = Maps;
    if(kind="bin"){
      Schema = Bins;
    }
    return Schema.findOneAndUpdate(criteria, update)
      .then(() => {
        return 200;
      })
      .catch(e => {
        console.error(e);
        return 400;
      });
  }
}
module.exports = DatabaseAPI;
