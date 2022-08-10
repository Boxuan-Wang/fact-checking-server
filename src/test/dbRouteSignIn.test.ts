import request from "supertest";
import userRoutes from "../routes/userRoutes";
import express from 'express';
import getDb  from "../connections/connDb";
import fetch from "cross-fetch";
import bodyparser from "body-parser";
import { Server } from "http";

let app = express();
app.use(userRoutes);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
let testServer: Server;

beforeAll(() => {
    testServer = app.listen(5000);

});

afterAll(() => {
    testServer.close();
});

beforeEach(async () => {
    const testUserInfo = {
        userName: "test@test.com",
        hashedPassword:"5ff6689115c8eb335d0f06a52d2fcbfca19a74296626e3fd607f623de606d886", //hash in sha256 of 12345678abcdefgh
        salt:"abcdefgh"
    };

    await (await getDb()).collection('users').insertOne(testUserInfo);
});

afterEach(async () => {
    const testUserInfo = {
        userName: "test@test.com",
        hashedPassword:"5ff6689115c8eb335d0f06a52d2fcbfca19a74296626e3fd607f623de606d886", //hash in sha256 of 12345678abcdefgh
        salt:"abcdefgh"
    };
    await(await getDb()).collection('users').deleteOne(testUserInfo);
});

test('test signIn success', async () => {
    const userInfo = {
        userName: "test@test.com",
        passwd: "12345678"
    };

    const response = 
        await request(app)
        .post("/signIn")
        .send(userInfo)
        .set('Accept', 'application/json');

    console.log("signIn success test: " + response.body);
    expect(response.body).toBe(true);
});

test('test signIn fail with unknown password', async () => {
    const userInfo = {
        userName: "notest@test.com",
        passwd: "12345678"
    };

    const response = 
        await request(app)
        .post("/signIn")
        .send(userInfo)
        .set('Accept', 'application/json');
        
    expect(response.body).toBe(false);
});

test('test signIn fail with wrong password', async () => {
    const userInfo = {
        userName: "test@test.com",
        passwd: "12345678aaaa"
    };

    const response = 
        await request(app)
        .post("/signIn")
        .send(userInfo)
        .set('Accept', 'application/json');
    console.log("signIn wrong password test: " + response.body);
    expect(response.body).toBe(false);
});
