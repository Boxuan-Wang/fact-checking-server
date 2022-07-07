import { Server } from 'http';
import connmail from "../connections/connmail";
import nodemailer from "nodemailer";
import express from "express";
import request from "supertest";
import emailRoutes from "../routes/emailRoutes";
import bp from "body-parser";

let app = express();
app.use(emailRoutes);
app.use(bp.json());
app.use(bp.urlencoded({extended:true}));
let testServer:Server;

let mailService:nodemailer.Transporter;
beforeAll(async () => {
    mailService = await connmail();
    testServer = app.listen(5000);
});

afterAll(() => {
    mailService.close();
    testServer.close();
});

test('test connection is valid', async () => {
    let succ:boolean = false;
    const service = await connmail();
        service.verify(function(err,success) {
        if(err) {
            succ = false;
            throw err;
        }
        else {
            succ = true;
        }
    });
    expect(succ).toBe(true);

});

test('test: try sending email', async () => {
    const desEmail = "boxuan2001@qq.com";;

    const response = await request(app)
    .post("email")
    .send(desEmail)
    .set('Accept', 'application/json');

    console.log(response.body);
    const code = parseInt(response.body);
    const valid =  code >=0 && code <10000;
    expect(valid).toBe(true);
});
