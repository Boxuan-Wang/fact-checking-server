import nodemailer, { Transporter } from "nodemailer";
require("dotenv").config({ path: "./config.env" });

let transporter: import("nodemailer/lib/mailer") | undefined;


export default function getEmailService(newTransporterRequired:boolean=false): Transporter {
    if(transporter!==undefined&&!newTransporterRequired) {
        return transporter;
    }
    else {
        transporter = nodemailer.createTransport(
            {
                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.MAIL_ADDRESS,
                    pass: process.env.PASSWORD
                }
            }
        );
        return transporter;
    }
}
