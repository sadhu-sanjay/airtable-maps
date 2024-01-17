/** @type {import('next').NextConfig} */
const dotenv = require('dotenv')

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});


const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        // port: [3000, 8080],
        // pathname: '/account123/**',
      },
      {
        protocol: 'https',
        hostname: 'sanjaygoswami.online',
        // port: [3000, 8080],
        // pathname: '/data/**',
      }
    ],
  },
}

module.exports = nextConfig
