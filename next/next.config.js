/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false, // Add net to the fallback list
      tls: false, // Add tls to the fallback list
    };
    return config;
  },
  images: {
    domains: ["res.cloudinary.com"], // Add Cloudinary domain here
  },
  env: {
    // Define your environment variables here
    TINY_PNG_API_KEY: process.env.TINY_PNG_API_KEY,
    LOCAL_URL: process.env.LOCAL_URL,
    PRODUCTION_URL: process.env.PRODUCTION_URL,
    RAINBOW_WALLET_PROJECT_ID: process.env.RAINBOW_WALLET_PROJECT_ID,
    ALCHEMA_PROVIDER_API_KEY: process.env.ALCHEMA_PROVIDER_API_KEY,
    MAGIC_KEY: process.env.MAGIC_KEY,
    TOKEN_CONTRACT_ADDRESS: process.env.TOKEN_CONTRACT_ADDRESS,
    DISTRIBUTED_REWARDS_CONTRACT_ADDRESS:
      process.env.DISTRIBUTED_REWARDS_CONTRACT_ADDRESS,
    CLOUDINARY_IMAGE_URL: process.env.CLOUDINARY_IMAGE_URL,
    // Add more environment variables as needed
  },
  // experimental: {
  //   appDir: false,
  // },
};

module.exports = nextConfig;
