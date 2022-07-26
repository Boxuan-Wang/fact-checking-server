require("dotenv").config({ path: "./config.env" });
import  {ApiClaim, Publisher, ClaimReview, ApiResponse, StoreClaim} from "./apiTypes"; 
import {URLSearchParams} from "url";
import fetch, { Response } from "node-fetch";
import bp, { raw } from "body-parser";
import { createHash } from "crypto";
import getDb from "./connDb";

const API_key:string = process.env.API_KEY?process.env.API_KEY:"";

const url_google = "https://factchecktools.googleapis.com/v1alpha1/claims:search";
const human_claim_db_collectin:string = 'human_claims';

async function find_publisher(query:string, max_age: number): Promise<Set<string>> {
    console.log("API key: "+API_key);
    let param:URLSearchParams = new URLSearchParams();
    param.append("query", query);
    param.append("maxAgeDays", max_age.toString());
    param.append("languageCode", "en");
    param.append("key", API_key);
    param.append("pageToken","");

    let r:Response = await fetch(url_google + '?' + param.toString());
    let rj:ApiResponse = <ApiResponse> await r.json(); 
    // console.log("rj: " + JSON.stringify(rj));
    let claims:ApiClaim[] = rj.claims;
    // console.log(claims[0].claimReview);

    let ret: Set<string> = new Set();
    let finish: boolean = false;
    let next_page:string = "";

    if(!claims || claims.length ===0 ){
        finish = true;
    }
    while(!finish) {
        next_page = rj.nextPageToken;
        for (let c of claims) {
            // console.log(c.claimReview);
            let site: string = (c.claimReview)[0].publisher.site;
            ret.add(site);
        }
        if(!next_page) {
            finish = true;
        }
        else {
            console.log("Next page: " + next_page);
            //get the next page
            param.set("pageToken", next_page);
            r = await fetch(url_google + '?' + param.toString());
            rj = <ApiResponse> await r.json();
            claims = rj.claims;
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
    param.append("maxAgeDays", max_age.toString());
    param.append("pageSize", "25");
    param.append("languageCode", "en");
    param.append("reviewPublisherSiteFilter", publisher_site);
    param.append("key", API_key);

    let res:Response = await fetch(url_google + '?' + param.toString());
    let rj:ApiResponse = <ApiResponse> await res.json();
    //todo
    console.log("rj:" + JSON.stringify(rj));
    let claims:ApiClaim[] = rj.claims;

    let cm_pairs:StoreClaim[] = [];
    let finished = false;
    let next_page:string = "";

    if(!claims || claims.length ===0 ){
        finished = true;
    }
    while(!finished) {
        next_page = rj.nextPageToken;
        // console.log("Claims###############################");
        // console.log(claims[0]);
        if(!claims || claims.length ===0) {
            finished = true;
            break;
        }
        for (let c of claims) {
            let claim_review:ClaimReview = (c.claimReview)[0];
            let fce_claim_text = claim_review.title;
            let fce_signting = c.text;

            let publisher:string = claim_review.publisher.name;

            let raw_id = [publisher, claim_review.url,claim_review.reviewDate?claim_review.reviewDate:""]
                .join(" ");
            
            let claim_id = createHash('sha256').update(raw_id).digest('hex');

            cm_pairs.push({
                "claim_id": claim_id,
                "claim_org": publisher,
                "claim_text": fce_claim_text,
                "claim_url": claim_review.url,
                "text": fce_signting,
                "publication": c.claimant,
                "publication_date": c.claimDate
            });            
        }
        if(!next_page) {
            finished = true;
        }
        else {
            param.set("pageToken",next_page);
            res = await fetch(url_google + '?' + param.toString());
            rj = <ApiResponse> await res.json();
            claims = rj.claims;
        }
    }
    return cm_pairs;
}

async function fetch_recent_sample(publishers: Set<string>) {
    let db = await getDb();
    let fetchNum: number = 0;
    //reand recent sample and put into database
    for (let pub of publishers) {
        let pairs = await get_publisher_sightings(pub);
        fetchNum += pairs.length;
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
    return fetchNum;
}

export function scheduleFetch() {
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
        scheduleFetch();
    },msToMidnight);
}

export async function fetchNow() {
    //todo
    console.log("Fetching...");
    let pubs = await find_many_publishers();
    console.log(`Found ${pubs.size} publishers.`);
    return await fetch_recent_sample(pubs);
}
