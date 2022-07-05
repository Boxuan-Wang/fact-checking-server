const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require("dotenv").config({ path: "./config.env" });
const uri = process.env.MONGO_URI;

let _Db;

module.exports = {
  getDb: async function() {
    while(_Db===undefined) {
      // const client = await MongoClient.connect(uri);
      // _Db = client.db(fact-checking-website);
      await MongoClient
      .connect(uri)
      .then(client => _Db = client.db('fact-checking-website'))
      .catch(err => console.error(err));
      client.db().collection().insertOne()
      
    }
    return _Db;
  }
}
