/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  // Increase serverless function timeout
  serverRuntimeConfig: {
    // Will only be available on the server side
    timeoutSeconds: 30,
  },
};

export default nextConfig;
