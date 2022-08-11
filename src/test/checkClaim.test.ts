import request from "supertest";
import express from 'express';
import getDb  from "../connections/connDb";
import fetch from "cross-fetch";
import bodyparser from "body-parser";
import { Server } from "http";
import checkRoute from "../routes/checkRoute";
import { StoreClaim } from "../connections/apiTypes";

let app = express();
app.use(checkRoute);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
let testServer: Server;

beforeAll(() => {
    testServer = app.listen(5000);
});

afterAll(() => {
    testServer.close();
});

//todo: upgrade to support hisory 
// test('test check claim: Ukarine is at war', async () => {
//     const query = {query: "Ukarine is at war"};
//     const response = 
//         await request(app)
//         .post("/check")
//         .send(query)
//         .set('Accept', 'application/json');
    
//     console.log("Check response: " + JSON.stringify(response.body))
//     const humanReslutArray:StoreClaim[] = response.body.human_result;

//     expect(humanReslutArray.length).toBe(true);
//     console.log(JSON.stringify(humanReslutArray[0]));

// })

test("e", () => {
    console.log("run");
})