const { response } = require("express");
const express = require("express");
const conndb = require("../connections/connDb");

const dbRoutes = express.Router();
//account function required: get hashed password/salt by email
//                   get _id by email
//                   update password by email
//
//claims require: get result by claim content
//                or advance, search for similar content
//
//human fact-check: daily pull from google api
//                  search from the results

//to return all records
// dbRoutes.route("/record").get(function (req,res) {
//     let db_connect = getUserDb();
//     db_connect
//         .collection("records")
//         .find({})
//         .toArray(function (err,result) {
//             if (err) throw err;
//             res.json(result);
//         })

// });

/**
 * Server for get popular claims.
 */
dbRoutes.route("/popular").get(function (req,res) {
    let db_connect = conndb.getClaimDb();
    db_connect
    .collection("...")
    .find({})
    .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    });

});

/**
 * For user sign in.
 */
dbRoutes.route("/signIn").put(function(req, res) {
    let db_connect = conndb.getUserDb();
    let query = {userName: req.body.userName};

    db_connect
    .collection("...")
    .findOne(query, function(err,result) {
        if(err) throw err;
        else {
            const hashed = result.hashedPassword;
            const salt = result.salt;

            //todo: replace + with hash algo
            const correct = ((req.body.passwd+salt)===hashed);
            res.json(correct);
        }
    });
});

//todo: need to check email existence before add
dbRoutes.route("/signUp").put(function(req,res) {
    let db_connect = conndb.getClaimDb();
    let newSalt = Math.random().toString(36).replace(/[^a-z]+/g,'').substring(8);
    let hashed = newSalt + req.body.passwd;
    let newUser = {
        userName: req.body.userName,
        hashedPassword: hashed,
        salt: newSalt
    };
    db_connect.collection("...").insertOne(newUser, function (err,result) {
        if(err) throw err;
        res.json(res);
    });
});




module.exports = dbRoutes;
