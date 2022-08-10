import { Router } from "express";
import getDb from "../connections/connDb";
import { createHash } from "node:crypto";
import { config } from "dotenv";
import bp from "body-parser";

config({ path: "./config.env" });

const dbRoutes:Router = Router();
dbRoutes.use(bp.json());
dbRoutes.use(bp.urlencoded({extended: true}));

/**
 * GET /popular 
 * For getting popular checked results. Still in development.
 */
dbRoutes.route("/popular").get(async (req, res) => {
    // let db_connect = await getDb();
    // await db_connect
    // .collection("checkedClaims")
    // .find({})
    // .toArray(function(err,result) {
    //     if(err) throw err;
    //     res.json(result);
    // });
    console.log("Send popular.");
    res.send("This a popular page.");
});

/**
 * POST /signIn
 * For sign in, request: {userName, passwd}, response: true/false
 */
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
                console.log("User " + query.userName + " sign in.");
                res.send(correct);
            }
            else {
                res.send(false);
            }
        }
    });
})


/**
 * POST /signUP
 * For user sign up, request: {userName, passwd}, response: true/false
 */
dbRoutes.route("/signUp").post(async function(req,res) {
    const db_connect = await getDb();
    //check email not used
    let query = {userName: req.body.userName};

    db_connect
    .collection("users")
    .findOne(query, function (err, result) {
        if(err) throw err;
        if(result) {

            res.send(false);
        }
        else {
            let newSalt:string = Math.random().toString().substring(2,6);
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
                else {
                    res.send(true);
                    console.log("User " + query.userName + " sign up.");
                }
            });
        }
    });
});

//todo: check password before deleting
dbRoutes.route("/deleteUser").post(async function(req,res) {
    const db_connect = await getDb();
    const query = {userName: req.body.userName};
    db_connect.collection("users").deleteOne(query, function(err,result) {
        if(err) throw err;
        else {
            res.send(true);
            console.log("Deleted user:" + query.userName);
        }
    });
});

export default dbRoutes;
