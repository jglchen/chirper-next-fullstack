/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    SENDER_MAIL_HOST: process.env.SENDER_MAIL_HOST,
    SENDER_MAIL_PORT: process.env.SENDER_MAIL_PORT,
    SENDER_MAIL_USER: process.env.SENDER_MAIL_USER,
    SENDER_USER_PASSWORD: process.env.SENDER_USER_PASSWORD,
    SECURE_CONNECTION: process.env.SECURE_CONNECTION,
    TLS_CIPHERS: process.env.TLS_CIPHERS,
    COUNT_PER_PAGE: process.env.COUNT_PER_PAGE,
  },
  output: 'standalone',
}

module.exports = nextConfig
