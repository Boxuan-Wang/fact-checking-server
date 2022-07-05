const dbRoutes = require("../routes/dbRoutes");
const request = require("supertest");
const connDb = require("../connections/connDb");
var express = require('express');

var app = express();
app.use(dbRoutes);

afterEach(async () => {
    const testSignUpUserQuery = {userName: "testsignup@test.com"};
    await connDb.getDb().collection('users').deleteOne(testSignUpUserQuery);
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