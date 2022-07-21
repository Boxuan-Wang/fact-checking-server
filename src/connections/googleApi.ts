require("dotenv").config({ path: "./config.env" });
import  {ApiClaim, Publisher, ClaimReview, ApiResponse, StoreClaim} from "./apiTypes"; 
import {URLSearchParams} from "url";
import bp from "body-parser";
import { createHash } from "crypto";
import getDb from "./connDb";

const API_key:string = process.env.API_key?process.env.API_key:"";
const url_google = "https://factchecktools.googleapis.com/v1alpha1/claims:search";
const human_claim_db_collectin:string = 'human-claims';

async function find_publisher(query:string, max_age: number): Promise<string[]> {
    let param:URLSearchParams = new URLSearchParams();
    param.append("query", query);
    param.append("maxAgeDays", max_age.toString());
    param.append("languageCode", "en");
    param.append("key", API_key);

    let r:Response = await fetch(url_google + '?' + param.toString());
    let rj:ApiResponse = await r.json();
    let claims:ApiClaim[] = rj.claims;

    let ret: string[] = [];
    let finish: boolean = false;

    if(!claims || claims.length ===0 ){
        finish = true;
    }
    while(!finish) {
        let next_page:string = rj.nextPageToken;
        for (let c of claims) {
            let site: string = c.claimrReview[0].publisher.site;
            ret.concat([site]);
        }
        if(!next_page) {
            finish = true;
        }
        else {
            //get the next page
            param.set("pageToken", next_page);
            r = await fetch(url_google + '?' + param.toString());
            claims = (await r.json())["claims"];
            if(!claims || claims.length === 0) {
                console.log("No more page.");
                finish = true;
            }
        }

    }
    return ret;
}

async function find_many_publishers():Promise<Set<string>> {
    let all_pub_site: Set<string> = new Set();
    for (let query of [
        "vacine",
        "congress",
        "covid",
        "climate",
        "facebook",
        "twitter",
    ]) {
        let pubs = await find_publisher(query,90);
        for (let pub of pubs) {
            all_pub_site.add(pub);
        }
        let display_string: string = `After query ${query}, we have ${all_pub_site.size} publishers.`;
        console.log(display_string);
    }
    return all_pub_site;
}

async function get_publisher_sightings(publisher_site:string = "fullfact.org", max_age:number = 30):Promise<StoreClaim[]> {
    let param:URLSearchParams = new URLSearchParams();
    param.append("maxAgeDays",max_age.toString());
    param.append("pageSize","25");
    param.append("languageCode","en");
    param.append("reviewPublisherSiteFilter", publisher_site);
    param.append("key",API_key);

    let res:Response = await fetch(url_google + '?' + param.toString());
    let rj:ApiResponse = await res.json();
    let claims:ApiClaim[] = rj.claims;

    let cm_pairs:StoreClaim[] = [];
    let finished = false;
    while(!finished) {
        let next_page:string = rj.nextPageToken;
        for (let c of claims) {
            let claim_review:ClaimReview = c.claimrReview[0];
            let fce_claim_text = claim_review.title;
            let fce_signting = c.text;

            let publisher:string = claim_review.publisher.name;

            let raw_id = [publisher, claim_review.url,claim_review.reviewDate?claim_review.reviewDate:""]
                .join(" ");
            
            let claim_id_hash = createHash('sha256');
            claim_id_hash.update(raw_id);
            let claim_id =  claim_id_hash.digest('hex');

            cm_pairs.concat([{
                "claim_id": claim_id,
                "claim_org": publisher,
                "claim_text": fce_claim_text,
                "claim_url": claim_review.url,
                "text": fce_signting,
                "publication": c.claimant,
                "publication_date": c.claimDate
            }]);            
        }
        if(!next_page) {
            finished = true;
        }
        else {
            param.set("pageToken",next_page);
            res = await fetch(url_google + '?' + param.toString());
            rj = await res.json();
            claims = rj.claims;
        }
    }
    return cm_pairs;
}

async function fetch_recent_sample(publishers: Set<string>) {
    let db = await getDb();
    //reand recent sample and put into database
    for (let pub of publishers) {
        let pairs = await get_publisher_sightings(pub);
        console.log(`Got ${pairs.length} claim-sentence pairs from ${pub}. `);
        for (let p of pairs) {
            //put p into database, if p exit update, otherwise insert. upsert = true
            db.collection(human_claim_db_collectin)
            .updateOne(
                {claim_id: p.claim_id},
                {
                    $set: {
                        claim_org: p.claim_org,
                        claim_text: p.claim_text,
                        claim_url: p.claim_url,
                        text: p.text,
                        publication: p.publication,
                        publication_date: p.publication_date
                    }
                },
                {upsert: true},
                function (err, result) {
                    if(err) {
                        console.error(err);
                    }
                }
            );
        }
    }
}

function scheduleRunning() {
    let now = new Date();
    let night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // the next day, ...
        0, 0, 0 // ...at 00:00:00 hours
    );
    let msToMidnight = night.getTime() - now.getTime();

    setTimeout(async function() {
        let pubs = await find_many_publishers();
        await fetch_recent_sample(pubs);
        scheduleRunning();
    },msToMidnight);
}
