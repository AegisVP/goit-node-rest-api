export const sendMail = async (to, subject, text) => {
  console.log({ to, subject, text });
};

export const sendVerificationEmail = async (to, verificationToken) => {
  await sendMail(
    to,
    'Please verify your email',
    `http://localhost:3000/api/auth/verify/${verificationToken}`
  );
};
