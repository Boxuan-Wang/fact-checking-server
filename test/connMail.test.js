const connmail = require("../connections/connMail");
const nodemailer = require("nodemailer");
const express = require("express");

test('test connection to mail server', async () => {
    let succ;
    await act(async () => {
        const service = connmail.getEmailService();
        await service.verify(function(err,success) {
            if (success) 
                succ = true;
        });
    });
    expect(succ).toBe(true);
})