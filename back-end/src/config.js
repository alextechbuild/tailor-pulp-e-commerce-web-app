// ----------------------------------------------- Variables d'environnement

import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const JWT_SECRET = process.env.JWT_SECRET;
export const COOKIE_SECRET = process.env.COOKIE_SECRET;
export const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
export const IS_LEADER = process.env.IS_LEADER;
export const SMTP_DOMAIN = process.env.SMTP_DOMAIN;
export const SMTP_PORT = process.env.SMTP_PORT;
export const HOST_EMAIL = process.env.HOST_EMAIL;
export const HOST_PASSWORD = process.env.HOST_PASSWORD;
export const ASSISTANCE_EMAIL = process.env.ASSISTANCE_EMAIL;
export const PUBLIC_KEY = process.env.PUBLIC_KEY;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const FRONT_END_URL = process.env.FRONT_END_URL;
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
export const DB_HOST = process.env.DB_HOST;
