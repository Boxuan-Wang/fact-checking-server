const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

var _userDb;
var _claimDb;

// export function connectToServer(callback) {
//   client.connect(function (err, db) {
//     // Verify we got a good "db" object
//     if (db) {
//       //todo: change to db-name of userinfo
//       _userDb = db.db("fact-checking-website");
//       console.log("Successfully connected to MongoDB.");
//     }
//     return callback(err);
//   });
// }

module.exports = {
  getUserDb: function () {
    if(_userDb===undefined) {
      client.connect(function (err,db) {
        if(err) throw err;
        if(db) {
          _userDb = db.db("fact-checking-website-users");
        }
      });
      return _userDb;
    }
    else {
      return _userDb;
    }
  },
  getClaimDb: function () {
    if(_claimDb===undefined) {
      client.connect(function (err,db) {
        if(err) throw err;
        if(db) {
          _claimDb = db.db("fact-checked-claims");
        }
      });
      return _claimDb;
    }
    else {
      return _claimDb;
    }
  }
}
