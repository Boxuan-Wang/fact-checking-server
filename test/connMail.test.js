const connmail = require("../connections/connMail");
const nodemailer = require("nodemailer");
const express = require("express");
var request  = require('supertest');

test('test connection to mail server', async () => {
    let succ;
    const service = connmail.getEmailService();
    await service.verify(function(err,success) {
        if (success) 
            succ = true;
    });
    expect(succ).toBe(true);
})