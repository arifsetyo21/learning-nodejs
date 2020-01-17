const nodemailer = require('nodemailer');

const sendEmail = async options => {
   try {
      // 1. Create a transpoter
      const transpoter = nodemailer.createTransport({
         host: process.env.EMAIL_HOST,
         port: process.env.EMAIL_PORT,
         auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
         }
      });

      // 2. Define email option
      const mailOptions = {
         from: 'Arif Setyo Nugroho <arif@arif.io>',
         to: options.email,
         subject: options.subject,
         text: options.message
         // html
      };

      // 3. Actually send mail
      await transpoter.sendMail(mailOptions);
   } catch (error) {
      console.log(error);
   }
};

module.exports = sendEmail;
