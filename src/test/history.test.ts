import request from "supertest";
import getDb  from "../connections/connDb";
import historyRoute, { addUser, addHistory, HistoryEntry} from "../routes/historyRoute";
import bodyparser from "body-parser";
import express from 'express';
import { Server } from "http";

let app = express();
app.use(historyRoute);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
let testServer: Server;
const test_user_name = "TEST_USERNAME";
const claimText = "test_claim";

beforeAll(async () => {
    testServer = app.listen(5000);
    //todo: change to not async version
    await addUser(test_user_name);
    await addHistory(test_user_name, claimText);
});

afterAll(async () => {
    await (await getDb())
    .collection("history")
    .deleteMany({userName: test_user_name});

    testServer.close();
});

test("test addUser", async () => {
    (await getDb())
    .collection("history")
    .findOne({userName: test_user_name}, function (err, res) {
        if(err) throw err;
        expect(!res).toBe(false);
    }); 
});

test("add history, check from database", async () => {
    let db_result:HistoryEntry[] = [];
    const res = await (await getDb())
    .collection("history")
    .findOne({userName: test_user_name});
    if (res) {
        db_result = res.history;
        console.log("History result: " + JSON.stringify(res));
        expect(db_result[0].claim).toBe(claimText);
        expect(typeof db_result[0].date).toBe("number"); 
    }
    else {
        throw Error("Not found history document.");
    } 
});

test("add history entry, check from request", async () => {
    const response = await request(app)
    .post("/history")
    .send({userName: test_user_name})
    .set('Accept','application/json');

    const responseBody:HistoryEntry[] = response.body.history;
    console.log(`History reponse: ${JSON.stringify(responseBody)}`);

    expect(responseBody[0].claim).toBe(claimText);
    expect(typeof responseBody[0].date).toBe("number");
});
