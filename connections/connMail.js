const nodemailer = require("nodemailer");
var transporter = undefined;

module.exports = {
    /**
     * get a transproter for sending email
     * @param { \whether a new transporter is required} newTransporterRequired 
     * @returns a valid transporter
     */
    getEmailService: function (newTransporterRequired) {
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
    },
}
