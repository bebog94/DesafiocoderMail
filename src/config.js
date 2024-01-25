import dotenv from "dotenv";

dotenv.config();

export default {
  env: process.env.ENV,
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
  secretJwt: process.env.SECRETJWT,
  nodemailer_user: process.env.NODEMAILER_USER,
  nodemailer_password: process.env.NODEMAILER_PASS
};

