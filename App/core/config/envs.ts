import pkg from "env-var";
import { configDotenv } from "dotenv";

configDotenv();

const { get } = pkg;

export const envs = {
  ACCESS_TOKEN_DURATION: get("ACCESS_TOKEN_DURATION").required().asInt(),
  ACCESS_TOKEN_SECRET: get("ACCESS_TOKEN_SECRET").required().asString(),
  REFRESH_TOKEN_DURATION: get("REFRESH_TOKEN_DURATION")
    .default(60 * 60 * 24 * 7)
    .asIntPositive(),
  JWT_SEED: get("JWT_SEED").required().asString(),
  DB_HOST: get("DB_HOST").required().asString(),
  DB_PORT: get("DB_PORT").required().asPortNumber(),
  DB_DATABASE: get("DB_DATABASE").required().asString(),
  DB_USER: get("DB_USER").required().asString(),
  DB_PASS: get("DB_PASS").default("").asString(),
};
