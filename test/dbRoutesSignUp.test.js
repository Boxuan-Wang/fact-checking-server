const dbRoutes = require("../routes/dbRoutes");
const supertest = require("supertest");
const connDb = require("../connections/connDb");
var express = require('express');
const { request } = require("express");

var app = express();
app.use(dbRoutes);

afterEach(() => {
    const testSignUpUserQuery = {userName: "testsignup@test.com"};
    connDb.getDb().collection('users').deleteOne(testSignUpUserQuery);
});

test('test sign up successful', async () => {
    const userInfo = {
        userName:"testsignup@test.com",
        passwd: "12345678"
    };
    const response = await request(app).put("/signUp").send(userInfo);

    expect(response).toBe(true);
});

test('test sign up fail with used email', async () => {
    const userInfo = {
        userName:"test@test.com",
        passwd: "12345678"
    };
    const response = await request(app).put("/signUp").send(userInfo);

    expect(response).toBe(false);
});