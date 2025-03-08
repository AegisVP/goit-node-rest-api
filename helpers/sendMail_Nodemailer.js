import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, text) => {
  const config = {
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  };

  const transporter = nodemailer.createTransport(config);
  const emailOptions = { from: process.env.SMTP_SENDER, to, subject, text };

  transporter
    .sendMail(emailOptions)
    .then(info => console.log(info))
    .catch(err => {
      console.log(err);
      throw err;
    });
};
