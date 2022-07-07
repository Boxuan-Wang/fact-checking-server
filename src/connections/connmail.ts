import nodemailer, { Transporter } from "nodemailer";
require("dotenv").config({ path: "./config.env" });

let transporter: import("nodemailer/lib/mailer");


export default async function getEmailService(newTransporterRequired:boolean=false): Promise<Transporter> {
    const validConn = transporter!==undefined 
        && transporter !==null
        && await transporter.verify();

    if(newTransporterRequired||!validConn){
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
    else {
        return transporter;
    }
}
