import { Router } from "express";
import getEmailService  from "../connections/connmail";
import bp from "body-parser";
import { config } from "dotenv";

config({ path: "./config.env" });
const senderEmail = process.env.MAIL_ADDRESS;
const emailRoutes = Router();
emailRoutes.use(bp.json());
emailRoutes.use(bp.urlencoded({extended: true}));

emailRoutes.route("/email").post(
    async function(req,res):Promise<void> {
        let emailService = await getEmailService();
        const code:string = Math.random().toString().substring(2,6);
        const mailOption = {
            from: senderEmail,
            to: req.body,
            subject: "Verify your email for averitect",
            text: "Your verification code for email" + req.body + "is" + code + "/n",
        };

        emailService.sendMail(mailOption, function (err, info) {
            if(err) {
                res.send(err);
            }
            else {
                res.send({veriCode:code});
            }
        });
    }
);

export default emailRoutes;
