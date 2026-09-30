const otpLength = 6;
const otpTime = 2 * 60 * 1000;
const networkDelay = 600;

const otpStore = new Map();

const generateOtp = () =>
  Math.floor(Math.random() * 10 ** otpLength)
    .toString()
    .padStart(otpLength, "0");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const requestOtp = async (mobile) => {
  await delay(networkDelay);

  const otp = generateOtp();
  const expiresAt = Date.now() + otpTime;
  otpStore.set(mobile, { otp, expiresAt });

  return { otp, expiresInSeconds: otpTime / 1000 };
};

export const verifyOtp = async (mobile, otp) => {
  await delay(networkDelay);

  const record = otpStore.get(mobile);

  if (!record) {
    throw new Error("OTP not requested for this number. Please try again.");
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(mobile);
    throw new Error("OTP has expired. Please request a new one.");
  }
  if (record.otp !== otp) {
    throw new Error("Invalid OTP. Please check and try again.");
  }

  otpStore.delete(mobile);
  return { mobile };
};

export const resendOtp = (mobile) => requestOtp(mobile);
