import jwt from "jsonwebtoken";
import {
  generateAccessTokenType,
  generateRefreshTokenType,
  randomSecretType,
  verifyTokenType,
} from "../../types/config.js";
import { envs } from "./envs.js";
import { randomBytes } from "crypto";

const { sign, verify } = jwt;

const { ACCESS_TOKEN_DURATION, JWT_SEED, REFRESH_TOKEN_DURATION } = envs;

export class JWTadapter {
  static createAccessToken: generateAccessTokenType = ({
    payload,
    duration,
  }) => {
    const tokenDuration = duration ?? ACCESS_TOKEN_DURATION;

    return sign(payload, JWT_SEED, {
      expiresIn: tokenDuration,
    });
  };

  static generateRefreshToken: generateRefreshTokenType = ({
    payload,
    duration,
    secret,
  }) => {
    const privateSecret = secret ?? this.randomSecret();
    const tokenDuration = duration ?? REFRESH_TOKEN_DURATION;
    const token = sign(payload, privateSecret, {
      expiresIn: tokenDuration,
    });
    return {
      token,
      secret: privateSecret,
    };
  };

  static randomSecret: randomSecretType = () => randomBytes(64).toString("hex");

  static verifyToken: verifyTokenType = ({ token, options, secret }) => {
    const privateSecret = secret ?? JWT_SEED;
    return verify(token, privateSecret, options);
  };
}
