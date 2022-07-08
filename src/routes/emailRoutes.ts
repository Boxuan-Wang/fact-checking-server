import { Router } from "express";
import getEmailService  from "../connections/connmail";
import bp from "body-parser";
import { config } from "dotenv";

config({ path: "./config.env" });
const senderEmail = process.env.MAIL_ADDRESS;
const emailRoutes = Router();
emailRoutes.use(bp.json());
emailRoutes.use(bp.urlencoded({extended: true}));

/**
 * POST /email
 * For sending users verification code when they signing up
 * request: {email}, response: {veriCode}
 */
emailRoutes.route("/email").post(
    async function(req,res):Promise<void> {
        const emailReceiver = req.body.email;
        let emailService = await getEmailService();
        const code:string = Math.random().toString().substring(2,6);

        const message = {
            from: senderEmail,
            to: emailReceiver,
            subject: "Verify your email for averitect",
            text: "Your verification code for email <" + emailReceiver + "> is " + code + ".\n",
        };

        emailService.sendMail(message, function (err, info) {
            if(err) {
                res.json(err);
            }
            else {
                res.json({veriCode:code});
                console.log("send email to: " + emailReceiver);
            }
        });
    }
);

export default emailRoutes;
