declare namespace NodeJS {
  interface ProcessEnv {
    JWT_PRIVATE_KEY: string;
    DATABASE_URL: string;
  }
}
