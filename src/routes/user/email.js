const nodemailer = require('nodemailer');

async function sendVerificationEmail(email, verificationCode) {
  // Create a transporter object that is responsible for sending the email
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'wasifarain057@gmail.com',
      pass: 'xqzsytfwzhnuqfvb'
    }
  });

  // Define the email options
  let mailOptions = {
    from: 'wasifarain057@gmail.com',
    to: email,
    subject: 'Verify your email address',
    html: `
      <p>Thank you for signing up!</p>
      <p>Please verify your email address by entering the following code:</p>
      <p>${verificationCode}</p>
    `
  };

  // Send the email
  let info = await transporter.sendMail(mailOptions);

  console.log(`Verification email sent: ${info.messageId}`);
}
module.exports = {
    sendVerificationEmail
};