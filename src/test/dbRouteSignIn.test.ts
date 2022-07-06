import request from "supertest";
import dbRoutes from "../routes/dbRoutes";
import express from 'express';
import fetch from "cross-fetch";
import bodyparser from "body-parser";
import { ServerApiVersion } from "mongodb";
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

// test('test jest', () => {
//     expect(1).toBe(1);
// });

// test('test signIn success', async () => {
//     const userInfo = {
//         userName: "test@test.com",
//         passwd: "12345678"
//     };

//     const response = 
//         await request(app)
//         .post("/signIn")
//         .send(userInfo)
//         .set('Accept', 'application/json');

//     console.log(response.body);
//     expect(response.body).toBe(true);
// });

// test('test signIn fail with unknown password', async () => {
//     const userInfo = {
//         userName: "notest@test.com",
//         passwd: "12345678"
//     };

//     const response = 
//         await request(app)
//         .post("/signIn")
//         .send(userInfo)
//         .set('Accept', 'application/json');
        
//     console.log(response.body);
//     expect(response.body).toBe(false);
// });

test('test signIn fail with wrong password', async () => {
    const userInfo = {
        userName: "test@test.com",
        passwd: "12345678aaaa"
    };

    // const response = 
    //     await request(app)
    //     .post("/signIn")
    //     .send(userInfo)
    //     .set('Accept', 'application/json');

    const response = await fetch('http://localhost:5000/signIn', {
        method: "POST",
        body:JSON.stringify(userInfo),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(response.body);
    expect(response.body).toBe(false);
});

