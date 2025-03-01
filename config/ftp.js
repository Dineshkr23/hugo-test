import dotenv from "dotenv";
dotenv.config();
export const FTP_CONFIG = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASS,
  secure: true, // Secure FTP
};
