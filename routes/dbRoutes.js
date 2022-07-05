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


/**
 * Server for get popular claims.
 */
dbRoutes.route("/popular").get(async function (req,res) {
    let db_connect = await conndb.getDb();
    await db_connect
    .collection("checkedClaims")
    .find({})
    .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    });

});

/**
 * For user sign in.
 */
dbRoutes.route("/signIn").put(async function(req, res) {
    let db_connect = await conndb.getDb();
    let query = {userName: req.body.userName};

    db_connect
    .collection("users")
    .findOne(query, async function(err,result) {
        if(err) throw err;
        else {
            const hashed = result.hashedPassword;
            const salt = result.salt;

            const inputPasswdHashed = 
                await crypto.subtle.digest('SHA-256',req.body.passwd+salt);
            const correct = inputPasswdHashed===hashed;
            res.json(correct);
        }
    });
});

//todo: need to check email existence before add
dbRoutes.route("/signUp").put(async function(req,res) {
    let db_connect = conndb.getDb();
    let newSalt = Math.random().toString(36).replace(/[^a-z]+/g,'').substring(8);
    let hashed = await crypto.subtle.digest('SHA-256', req.body.passwd + newSalt);
    let newUser = {
        userName: req.body.userName,
        hashedPassword: hashed,
        salt: newSalt
    };
    db_connect.collection("users").insertOne(newUser, function (err,result) {
        if(err) throw err;
        res.json(res);
    });
});

module.exports = dbRoutes;
