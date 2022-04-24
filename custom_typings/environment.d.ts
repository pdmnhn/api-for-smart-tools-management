declare namespace NodeJS {
  interface ProcessEnv {
    JWT_PRIVATE_KEY: string;
    CONNECTION_STRING: string;
  }
}
