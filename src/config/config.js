import dotenv from "dotenv";
dotenv.config();
export const configuration = {
  PORT: process.env.PORT,
  URL: process.env.DATABASE_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  BASE_URL: process.env.BASE_URL,
};
