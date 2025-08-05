const nodemailer = require('nodemailer');


export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const otpExpiry = (): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);
  return expiry;
};

export const  sendEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject = "Your OTP Code";
  const text = `Your OTP code is: ${otp}. It will expire in 10 minutes.`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text,
  });
};
