import { Router } from "express";
import getDb from "../connections/connDb";
import { createHash } from "node:crypto";
import { config } from "dotenv";
config({ path: "./config.env" });

const dbRoutes:Router = Router();
dbRoutes.route("/popular").get(async (req, res) => {
    let db_connect = await getDb();
    await db_connect
    .collection("checkedClaims")
    .find({})
    .toArray(function(err,result) {
        if(err) throw err;
        res.json(result);
    });
});

dbRoutes.route("/signIn").post(async (req,res) => {
    let db_connect = await getDb();
    if(req===null) throw new Error("Null req.");
    console.log(req.body);
    let query = {userName: req.body.userName};
    const hash = createHash('sha256');

    db_connect
    .collection("users")
    .findOne(query, function(err,result) {
        if(err) {
            res.send(false);
        }
        else {
            let hashed:string = '';
            let salt:string = '';
        
            if(result!==null&&result!==undefined){
                hashed = result.hashedPassword;
                salt = result.salt;
            }
            else {
                throw new Error("user info not fetched");
            }

            hash.update(req.body.passwd+salt);
            const inputPasswdHashed = hash.digest('hex');
            const correct = inputPasswdHashed===hashed;
            res.send(correct);
        }
    });
})

dbRoutes.route("/signUp").post(async function(req,res) {
    let db_connect = await getDb();
    let newSalt = Math.random().toString(36).replace(/[^a-z]+/g,'').substring(8);
    const hash = createHash('sha256');
    hash.update(req.body.passwd + newSalt);
    const hashed = hash.digest('hex');

    let newUser = {
        userName: req.body.userName,
        hashedPassword: hashed,
        salt: newSalt
    };
    db_connect.collection("users").insertOne(newUser, function (err,result) {
        if(err) throw err;
        else res.json(true);
    });
});

export default dbRoutes;