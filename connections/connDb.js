const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI;

var _Db;

module.exports = {
  // getUserDb: function () {
  //   if(_userDb===undefined) {
  //     client.connect(function (err,db) {
  //       if(err) throw err;
  //       if(db) {
  //         _userDb = db.db("fact-checking-website-users");
  //       }
  //     });
  //     return _userDb;
  //   }
  //   else {
  //     return _userDb;
  //   }
  // },
  // getClaimDb: function () {
  //   if(_claimDb===undefined) {
  //     client.connect(function (err,db) {
  //       if(err) throw err;
  //       if(db) {
  //         _claimDb = db.db("fact-checked-claims");
  //       }
  //     });
  //     return _claimDb;
  //   }
  //   else {
  //     return _claimDb;
  //   }
  // },
  getDb: async function() {
    if(_Db===undefined) {
      // const client = await MongoClient.connect(uri);
      // _Db = client.db(fact-checking-website);
      await MongoClient
      .connect(uri)
      .then(client => _Db = client.db('fact-checking-website'))
      .catch(err => console.error(err));

      return _Db;
    }
    else {
      return _Db;
    }
  }
}
