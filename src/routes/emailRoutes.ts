import { Router } from "express";
import getEmailService  from "../connections/connmail";
import { createHash } from "node:crypto";
import bp from "body-parser";
import { config } from "dotenv";
import getDb from "../connections/connDb";

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
        //check if the email is used
        let emailUsed = undefined;
        const db_connection = await getDb();
        let query = {userName: emailReceiver};

        db_connection
        .collection("users")
        .findOne(query, function(err, result) {
            if (err) throw err;
            if(result) {
                emailUsed = true;
            }
            else {
                emailUsed = false;
            }
        });
    
        
        if (!emailUsed){
            //start sending email
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
                    console.log("send email to: " + emailReceiver + ", and the code is " + code);
                    res.json({veriCode:hashedCode});
                }
            });
        }
        else {
            res.json({veriCode: "USED_EMAIL"});
        }
    }
);

export default emailRoutes;
