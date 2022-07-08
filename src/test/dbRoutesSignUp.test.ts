import dbRoutes from "../routes/dbRoutes";
import request from "supertest";
import getDb  from "../connections/connDb";
import bodyparser from "body-parser";
// var express = require('express');
import express from 'express';
import { Server } from "http";

let app = express();
app.use(dbRoutes);
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
    const testSignUpUserQuery = {userName: "testsignup@test.com"};
    const testUserInfo = {
        userName: "test@test.com",
        hashedPassword:"5ff6689115c8eb335d0f06a52d2fcbfca19a74296626e3fd607f623de606d886", //hash in sha256 of 12345678abcdefgh
        salt:"abcdefgh"
    };
    const dbConn = await getDb();
    await dbConn.collection('users').deleteOne(testSignUpUserQuery);
    await dbConn.collection('users').deleteMany({userName:"test@test.com"});
});

test('test sign up successful', async () => {
    const userInfo = {
        userName:"testsignup@test.com",
        passwd: "12345678"
    };
    const response = await request(app).post("/signUp").send(userInfo);

    expect(response.body).toBe(true);
});

test('test sign up fail with used email', async () => {
    const userInfo = {
        userName:"test@test.com",
        passwd: "12345678"
    };
    const response = await request(app).post("/signUp").send(userInfo);

    expect(response.body).toBe(false);
});

test('test delete user', async () => {
    const toDeleteUserInfo = {
        userName: "toDelete@test.com",
        hashedPassword:"5ff6689115c8eb335d0f06a52d2fcbfca19a74296626e3fd607f623de606d886", //hash in sha256 of 12345678abcdefgh
        salt:"abcdefgh"
    };
    await (await getDb()).collection('users').insertOne(toDeleteUserInfo);

    const response = 
        await request(app).post("/deleteUser")
        .send({userName: toDeleteUserInfo.userName});
    
    expect(response.body).toBe(true);
    
})
