import bcrypt from "bcryptjs";

// bcryptjs has no "random" function, so we take the randomness from its salt generator.
// A bcrypt salt is "$2b$10$" followed by 22 random characters. Only the first 21 are fully random,
// so we use those.
const ALPHABET = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // bcrypt's base64
const randomChars = async () => (await bcrypt.genSalt(10)).slice(7, 28);

// A 6-digit code. Characters with index 60 to 63 are skipped so every digit is equally likely.
export const randomOtp = async () => {
  let otp = "";
  while (otp.length < 6) {
    for (const char of await randomChars()) {
      const index = ALPHABET.indexOf(char);
      if (index < 60 && otp.length < 6) otp += index % 10;
    }
  }
  return otp;
};

// A long random string made of letters and numbers only (safe to put in a URL)
export const randomToken = async () => {
  const clean = (text) => text.replace(/[./]/g, "");
  return clean(await randomChars()) + clean(await randomChars());
};
