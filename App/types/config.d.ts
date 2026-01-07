import {
  SigningOptions,
  DecodeOptions,
  JwtPayload,
  Jwt,
  VerifyOptions,
} from "jsonwebtoken";

type duration = SigningOptions["expiresIn"];
export type generateAccessTokenType = (args: {
  payload: Record<string, any>;
  duration?: duration;
}) => string;

export type generateRefreshTokenType = (args: {
  payload: Record<string, any>;
  duration?: duration;
  secret?: string;
}) => {
  secret: string;
  token: string;
};

export type decodeType = (args: {
  token: string;
  options?: DecodeOptions;
}) => string | JwtPayload | null;

export type randomSecretType = () => string;

export type verifyTokenType = (args: {
  token: string;
  options?: VerifyOptions;
  secret?: string;
}) => string | JwtPayload | Jwt;
