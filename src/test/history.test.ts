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

beforeAll(() => {
    testServer = app.listen(5000);
});

afterAll(() => {
    testServer.close();
});

beforeEach(async () => {
    addUser(test_user_name);
});

afterEach(async () => {
    (await getDb())
    .collection("history")
    .deleteOne({userName: test_user_name}, 
        function (err, res) {
            if(err) throw err;
        });
});

test("add history entry to test user,  check from database", async () => {
    // const newHistoryEntry:HistoryEntry = {
    //     claim: "test_claim",
    //     date: 1234567890
    // };
    const claimText = "test_claim";

    addHistory(test_user_name, claimText);
    let db_result:HistoryEntry[] = [];
    (await getDb())
    .collection("history")
    .findOne({userName: test_user_name},
        function (err, res) {
            if(err) throw err;
            if (res) {
                db_result = res.history;
            }
        });
    expect(db_result[0].claim).toBe(claimText);
    expect(typeof db_result[0].date).toBe("number");  
    
});
