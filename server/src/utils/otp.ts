export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const otpExpiry = (): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10); // 10 minutes expiry
  return expiry;
};


export const sendOtpEmail = async (email: string, otp: string) => {
  console.log(`Sending OTP ${otp} to email: ${email}`);
  // Integrate real email provider like SendGrid, Mailgun, or Nodemailer
};
