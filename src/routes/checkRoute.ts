import { Router } from "express";
import getDb from "../connections/connDb";
import bp from "body-parser";
import { config } from "dotenv";
import { StoreClaim } from "../connections/apiTypes";

config({path: "config.env"});

const human_claim_db_collectin = "human_claims";
const checkRoute:Router = Router();
checkRoute.use(bp.json());
checkRoute.use(bp.urlencoded({extended: true}));

checkRoute.route("/checkClaim").post(async (req,res) => {
    //first the human-checking-result
    let db_connect = await getDb();
    if(!req) throw new Error("Null/undefined req.");
    console.log("search string is: "+ req.body.query);
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
    // while(human_result.length < 10 && await cursor.hasNext()) {
    //     human_result.push((await cursor.next()));
    // }
    human_result =<StoreClaim[]> (await cursor.toArray());
    //then get the result from fever
    const fever_result = "";
    
    res.json(
        {
            human_result: human_result,
            fever_result: fever_result
        }
    );
});

export default checkRoute;
