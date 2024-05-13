/** @type {import('next').NextConfig} */
const dotenv = require('dotenv');

dotenv.config();
const nextConfig = {
  reactStrictMode: true,
  env: {
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_SERVER: process.env.DB_SERVER,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PORT: process.env.DB_PORT,
    DB_OPTIONS_ENCRYPT: process.env.DB_OPTIONS_ENCRYPT
  }
};

export default nextConfig;
