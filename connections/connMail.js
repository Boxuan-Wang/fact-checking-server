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
                    service: 'gmail',
                    auth: {
                    user: 'youremail@gmail.com',
                    pass: 'yourpassword'
                    }
                }
            );
            return transporter;
        }
    },
}
