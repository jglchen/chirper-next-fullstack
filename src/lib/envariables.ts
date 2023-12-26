import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

export const DEV_SITE_URL: string = process.env.NEXT_PUBLIC_DEV_SITE_URL as string;
export const PRO_SITE_URL: string = process.env.NEXT_PUBLIC_PRO_SITE_URL as string;

export const SECURE_LOCAL_STORAGE_HASH_KEY: string = process.env.NEXT_PUBLIC_SECURE_LOCAL_STORAGE_HASH_KEY as string;
export const CRYPTO_SECRET_KEY: string = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY as string;
export const JWT_APP_SECRET: string = process.env.NEXT_PUBLIC_JWT_APP_SECRET as string;

export const SENDER_MAIL_HOST: string = serverRuntimeConfig.SENDER_MAIL_HOST || process.env.NEXT_PUBLIC_SENDER_MAIL_HOST;
export const SENDER_MAIL_PORT: number = parseInt(serverRuntimeConfig.SENDER_MAIL_PORT || process.env.NEXT_PUBLIC_SENDER_MAIL_PORT);
export const SENDER_MAIL_USER: string = serverRuntimeConfig.SENDER_MAIL_USER || process.env.NEXT_PUBLIC_SENDER_MAIL_USER;
export const SENDER_USER_PASSWORD: string = serverRuntimeConfig.SENDER_USER_PASSWORD || process.env.NEXT_PUBLIC_SENDER_USER_PASSWORD;
export const SECURE_CONNECTION: boolean = typeof serverRuntimeConfig.SECURE_CONNECTION !== 'undefined' ? serverRuntimeConfig.SECURE_CONNECTION: process.env.NEXT_PUBLIC_SECURE_CONNECTION;
export const TLS_CIPHERS: string = serverRuntimeConfig.TLS_CIPHERS || process.env.NEXT_PUBLIC_TLS_CIPHERS;

export const COUNT_PER_PAGE: number = parseInt(serverRuntimeConfig.COUNT_PER_PAGE || process.env.NEXT_PUBLIC_COUNT_PER_PAGE);
