import { Router } from "express";
import getDb from "../connections/connDb";
import { createHash } from "node:crypto";
import { config } from "dotenv";
import bp from "body-parser";
import { IntegerType } from "mongodb";

config({ path: "./config.env" });

const dbRoutes:Router = Router();
dbRoutes.use(bp.json());
dbRoutes.use(bp.urlencoded({extended: true}));
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
    let query = {userName: req.body.userName};
    const hash = createHash('sha256');

    db_connect
    .collection("users")
    .findOne(query, function(err,result) {
        if(err) {
            throw err;
        }
        else {
            let hashed:string = '';
            let salt:string = '';
        
            if(result!==null&&result!==undefined){
                hashed = result.hashedPassword;
                salt = result.salt;
                hash.update(req.body.passwd+salt);
                const inputPasswdHashed = hash.digest('hex');
                const correct = inputPasswdHashed===hashed;
                console.log("Comparing hashed: " + hashed + ",\n" + inputPasswdHashed + "\nsalt: " + salt);
                res.send(correct);
            }
            else {
                res.send(false);
            }
        }
    });
})

dbRoutes.route("/signUp").post(async function(req,res) {
    const db_connect = await getDb();
    //check email not used
    let query = {userName: req.body.userName};

    console.log("Sign up:" + query.userName);

    await db_connect
    .collection("users")
    .findOne(query, function (err, result) {
        if(err) throw err;
        if(result) {
           //todo: test
            console.log("Sign up with used email.");
            res.send(false);
        }
        else {
            let newSalt:string = Math.min(Math.floor(Math.random()*10000),1000).toString();
            const hash = createHash('sha256');
            hash.update(req.body.passwd + newSalt);
            const hashed = hash.digest('hex');
    
            let newUser = {
                userName: req.body.userName,
                hashedPassword: hashed,
                salt: newSalt
            };
            console.log("new user:" + newUser.userName)
            db_connect.collection("users").insertOne(newUser, function (err,result) {
                if(err) throw err;
                else res.send(true);
            });
        }
    });
});

export default dbRoutes;