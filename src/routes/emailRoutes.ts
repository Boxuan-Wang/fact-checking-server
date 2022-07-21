import { Router } from "express";
import getEmailService  from "../connections/connmail";
import { createHash } from "node:crypto";
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
        const hashedCode: string = createHash('sha256').update(code).digest('hex');
        const message = {
            from: senderEmail,
            to: emailReceiver,
            subject: "Verify your email for averitect",
            text: "Your verification code for email <" + emailReceiver + "> is " + code + ".\n",
        };

        emailService.sendMail(message, function (err, info) {
            if(err) {
                console.error(err);
                console.log(message);
                res.json(err);
            }
            else {
                console.log("send email to: " + emailReceiver);
                res.json({veriCode:hashedCode});
            }
        });
    }
);

export default emailRoutes;
