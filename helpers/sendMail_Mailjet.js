import Mailjet from 'node-mailjet';

export const sendMail = async (to, subject, text) => {
  const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_APIKEY,
    process.env.MAILJET_SECRET
  );

  mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: { Email: process.env.MAILJET_SENDER, Name: 'GoIT NodeJs HW' },
          To: [{ Email: to, Name: to }],
          Subject: subject,
          TextPart: text,
        },
      ],
    })
    .then(result => {
      console.log(result.body);
    })
    .catch(err => {
      console.log(err.statusCode);
    });
};
