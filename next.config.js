/** @type {import('next').NextConfig} */
const dotenv = require('dotenv')

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});


const nextConfig = {
  output: 'export',
  images: {
    // domains: ['images.unsplash.com', 'source.unsplash.com'],
  },
}

module.exports = nextConfig
