import { sendMail } from './sendMail_Mailjet';

export const sendVerificationEmail = async (to, verificationToken) => {
  await sendMail(
    to,
    'Please verify your email',
    `http://localhost:3000/api/auth/verify/${verificationToken}`
  );
};
