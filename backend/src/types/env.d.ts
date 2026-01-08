/// <reference types="node" />
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MONGO_URL: string;
    
    HCAPTCHA_SECRET: string;

    CLOUD_NAME: string;
    CLOUD_API_KEY: string;
    CLOUD_API_SECRET: string;
    CLOUDINARY_FOLDER: string;

    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
  
    JWT_SECRET: string;
    SALT_ROUNDS: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;

    EMAIL_USER: string;
    EMAIL_PASS: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    API_URL: string;
    CLIENT_URL: string;
  }
}
