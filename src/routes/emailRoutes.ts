import { Express, Router } from "express";
import getEmailService  from "../connections/connmail";

const emailRoutes = Router();

emailRoutes.route("/email").post(
    function(req,res):void {
        let emailService = getEmailService();
        const code:string = Math.random().toString().substring(2,6);
        const mailOption = {
            from: "",
            to: req.body,
            subject: "Verify your email for averitect",
            text: "Your verification code for email" + req.body + "is" + code + "/n",
        };

        emailService.sendMail(mailOption, function (err, info) {
            if(err) {
                res.json(err);
            }
            else {
                res.json({veriCode:code});
            }
        })

    }
);

export default emailRoutes;