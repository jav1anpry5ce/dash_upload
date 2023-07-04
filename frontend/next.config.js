/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "upload.wikimedia.org",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "localhost",
      "api.fileserver.home",
    ],
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
