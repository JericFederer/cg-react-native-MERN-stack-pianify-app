export const generateOtpToken = (length: number = 9) => {
  let otpToken = "";

  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 10);
    otpToken += digit;
  }

  return otpToken;
}