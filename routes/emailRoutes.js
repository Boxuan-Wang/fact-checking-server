const express = require("express");
const connmail = require("../connections/connMail");
const Date = require("Date");
require('nodemailer');

const emailRoutes = express.Router();

emailRoutes.route("/email").post(
    function (req,res) {
        let emailService = connmail.getEmailService();
        const code = Math.random().toString(10).substring(4);
        const time = Date.now();
        const mailOption = {
            from: "",
            to: req.body,
            subject: "Verify your email for averitect",
            text: "Your verification code for email:" + req.body + "is" + code
                + "/n" + time,
        };
        emailService.sendMail(mailOption, function(err,info) {
            if(error) {
                res.json(err);
            } 
            else {
                res.json({veriCode: code});
            }
        })
    }
);

module.exports = emailRoutes;