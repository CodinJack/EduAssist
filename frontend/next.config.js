/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "i.ytimg.com",
      "source.unsplash.com"
    ],
  },
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true, // disables type errors on build
  },
  eslint: {
    ignoreDuringBuilds: true, // disables ESLint during build
  },

};
