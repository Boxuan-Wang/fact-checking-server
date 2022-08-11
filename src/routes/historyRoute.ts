import { Router } from "express";
import getDb from "../connections/connDb";
import { config } from "dotenv";
import bp from "body-parser";
import { UpdateResult } from "mongodb";

config ({path: "config.env"});

const historyRoute: Router = Router();
historyRoute.use(bp.json());
historyRoute.use(bp.urlencoded({extended: true}));

export type HistoryEntry = {
    claim: string,
    date: number
};

/**
 * POST /history
 * Getting a user's check history
 * req body: JSON {userName:  }
 * res format: JSON {history:  }
 */
historyRoute.route("/history").post(async (req,res) => {
    const db_connect = await getDb();
    //check email in database
    db_connect
    .collection("history")
    .findOne({userName: req.body.userName}, function (err, result) {
        if(err) throw err;
        res.json({
            history: (result?result.history:[])
        });
    })
});

/**
 * Add check history item to database.
 * 
 */
export async function addHistory(userName: string, checkClaim: string):Promise<void> {
    const db_connect = await getDb();
    let newHistoryEntry: HistoryEntry = {
        claim: checkClaim,
        date: Date.now()
    };

    await db_connect
    .collection("history")
    .updateOne({userName: userName},
        {$push:{history: newHistoryEntry}});
}

/**
 * Add a document with given username and empty check history. If already exist, do nothing.
 * @param userName email
 */
export async function addUser(userName: string):Promise<void> {
    const db_connect = await getDb();
    let emptyArray: HistoryEntry[] = [];
    let newDoc = {
        userName: userName,
        history: emptyArray
    };

    const res = await db_connect
    .collection("history")
    .findOne({userName: userName});

    if(!res) {
        await db_connect
        .collection("history")
        .insertOne(newDoc);
    } 
}

export default historyRoute;
