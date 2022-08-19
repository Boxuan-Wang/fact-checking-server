import { Router } from "express";
import getDb from "../connections/connDb";
import bp from "body-parser";
import fetch from "node-fetch";
import { config } from "dotenv";
import { StoreClaim } from "../connections/apiTypes";
import { addHistory } from "./historyRoute";
import {request} from 'http';

config({path: "config.env"});

const human_claim_db_collectin = "human_claims";
const checkRoute:Router = Router();
checkRoute.use(bp.json());
checkRoute.use(bp.urlencoded({extended: true}));
const FEVER_ADDRESS = "http://128.232.69.0:5100/proofver";

/**
 * POST /check
 * Post the claim text to get the check result
 * req body: JSON {query, userName, history: boolean}
 */
checkRoute.route("/checkClaim").post(async (req,res) => {
    //first the human-checking-result
    let db_connect = await getDb();
    if(!req) throw new Error("Null/undefined req.");
    const checkClaim: string = req.body.query;
    const enableHsitory = req.body.history? req.body.hisory : true;
    const userName: string = req.body.userName;


    //record the check history 
    if(enableHsitory) {
        await addHistory(userName, checkClaim);
    }

    //start check human-result database
    const query = { 
        $text: { 
            $search: req.body.query,
            $caseSensitive: false
        } 
    };
    const sort = { score: { $meta: "textScore" } };
    const projection = {
        _id: 0,
        claim_id: 1,
        claim_org: 1,
        claim_text: 1,
        claim_url: 1,
        publication: 1,
        publication_date: 1,
        text: 1,
        score: { $meta: "textScore" }
    }
    let cursor = await db_connect
        .collection(human_claim_db_collectin)
        .find(query, 
            {
                projection: projection,
                sort: sort
            })
        .project(projection);
    
    let human_result:StoreClaim[] = [];
    human_result =<StoreClaim[]> (await cursor.toArray());
    //then get the result from fever
    let fever_result;
    await fetch(FEVER_ADDRESS, {
        method: "POST",
        body: JSON.stringify({
            'claim': checkClaim
        }),
        headers: {
            "Content-Type": "application/json",
          },
    })
    .then(res => res.json())
    .then(data => fever_result = data.output)
    .catch(err => console.error(err));
    
    console.log(JSON.stringify(fever_result));
    res.json(
        {
            human_result: human_result,
            fever_result: fever_result
        }
    );
});

export default checkRoute;
