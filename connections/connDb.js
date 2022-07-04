const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

var _Db;
var _claimDb;

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
  getDb: function() {
    if(_Db===undefined) {
      client.connect(function (err,db) {
        if(err) throw err;
        if(db) {
          _claimDb = db.db("fact-checking-website");
        }
      });
      return _Db;
    }
    else {
      return _Db;
    }
  }
}
