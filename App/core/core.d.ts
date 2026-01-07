import { Response } from "express";
import { ResponseStatus } from "../consts.ts";

export type ResponseStatusType =
  (typeof ResponseStatus)[keyof typeof ResponseStatus];

export interface SendResponseArgs {
  res: Response;
  message?: string;
  data?: any;
  status: ResponseStatusType;
  statusCode?: number;
  error?: any;
  authorization?: string;
}

export interface userToken {
  id: number;
  nombre: string;
}

export type SuccesArgs = Pick<
  SendResponseArgs,
  "res" | "message" | "data" | "error" | "authorization"
>;

export type ErrorResponseArgs = Pick<
  SendResponseArgs,
  "res" | "error" | "statusCode"
>;

export type UnautorizedResponseArgs = Pick<
  SendResponseArgs,
  "res" | "error" | "message"
>;

export interface googleSecions {
  token: string;
  refreshToken: string;
  correo: string;
}
