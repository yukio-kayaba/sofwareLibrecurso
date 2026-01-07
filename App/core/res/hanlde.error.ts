import { Response } from "express";
import { CustomError } from "./Custom.error.js";
import { CustomResponse } from "./custom.response.js";
import { ResponseStatus } from "../../consts.js";

export const handleError = (error: unknown, res: Response) => {
  if (error instanceof CustomError && error.statusCode !== 500) {
    return CustomResponse.send({
      res,
      statusCode: error.statusCode,
      status: ResponseStatus.fail,
      data: error.data ?? null,
      error: error.message,
    });
  }
  return CustomResponse.badRequest({ res, error: "Error interno " });
};
