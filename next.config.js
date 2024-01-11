/** @type {import('next').NextConfig} */
const dotenv = require('dotenv')

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});


const nextConfig = {
  images: {
    // load images from localhost:8080/images/
    domains: ['localhost'],
  },
}

module.exports = nextConfig
