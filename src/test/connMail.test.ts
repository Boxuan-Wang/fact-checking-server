import connmail from "../connections/connmail";
import nodemailer from "nodemailer";
import express from "express";
var request  = require('supertest');

let mailService:nodemailer.Transporter;
beforeAll(() => {
    mailService = connmail();
});

afterAll(() => {
    mailService.close();
});

test('test connection is valid', async () => {
    let succ:boolean = false;
    const service = connmail();
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