import request from "supertest";
import dbRoutes from "../routes/dbRoutes";
import express from 'express';
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

    expect(response.body).toBe(true);
});

test('test signIn fail with unknown password', async () => {
    const userInfo = {
        userName: "notest@test.com",
        passwd: "12345678"
    };

    const response = await request(app).post("/signIn").send(userInfo);

    expect(response.body).toBe(false);
});

test('test signIn fail with wrong password', async () => {
    const userInfo = {
        userName: "test@test.com",
        passwd: "12345678aaaa"
    };

    const response = 
        await request(app).post("/signIn").send(userInfo);

    expect(response.body).toBe(false);
});

