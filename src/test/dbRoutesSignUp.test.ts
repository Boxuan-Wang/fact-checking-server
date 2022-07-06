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
let testServer: Server;

beforeAll(() => {
    testServer = app.listen(5000);
});

afterAll(() => {
    testServer.close();
});

afterEach(async () => {
    const testSignUpUserQuery = {userName: "testsignup@test.com"};
    (await getDb()).collection('users').deleteOne(testSignUpUserQuery);
});

test('test sign up successful', async () => {
    const userInfo = {
        userName:"testsignup@test.com",
        passwd: "12345678"
    };
    const response = await request(app).post("/signUp").send(userInfo);

    expect(response).toBe(true);
});

test('test sign up fail with used email', async () => {
    const userInfo = {
        userName:"test@test.com",
        passwd: "12345678"
    };
    const response = await request(app).post("/signUp").send(userInfo);

    expect(response).toBe(false);
});