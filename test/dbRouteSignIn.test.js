const dbRoutes = require("../routes/dbRoutes");
const request = require("supertest");

var express = require('express');
var app = express();
app.use(dbRoutes);

test('test jest', () => {
    expect(1).toBe(1);
});

test('test signIn success', async () => {
    const userInfo = {
        userName: "test@test.com",
        passwd: "12345678"
    };

    const response = 
        await request(app).post("/signIn").send(userInfo);

    exptect(response.body).toBe(true);
});

test('test signIn fail with unknown password', async () => {
    const userInfo = {
        userName: "notest@test.com",
        passwd: "12345678"
    };

    const response = await request(app).post("/signIn").send(userInfo);

    exprect(response.body).toBe(false);
});

test('test signIn fail with wrong password', async () => {
    const userInfo = {
        userName: "test@test.com",
        passwd: "12345678aaaa"
    };

    const response = 
        await request(app).post("/signIn").send(userInfo);

    exptect(response.body).toBe(false);
});

