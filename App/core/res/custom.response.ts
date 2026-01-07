import { ResponseStatus } from "../../consts.js";
import {
  ErrorResponseArgs,
  SendResponseArgs,
  SuccesArgs,
  UnautorizedResponseArgs,
} from "../core.js";

export class CustomResponse {
  static send({
    res,
    status = ResponseStatus.success,
    authorization,
    data,
    error,
    message,
    statusCode = 200,
  }: SendResponseArgs) {
    const response = {
      status,
      message,
      data,
      error,
    };

    if (authorization !== undefined) {
      return res.header("Authorization", authorization);
    }
    if (typeof response.data === "string") {
      try {
        response.data = JSON.parse(data);
      } catch (error) {}
    }

    if (typeof response.error === "string") {
      try {
        response.error = JSON.parse(error);
      } catch (error) {}
    }

    res.status(statusCode).json(response);
  }

  static success({ res, message, data, authorization }: SuccesArgs) {
    this.send({
      res,
      data,
      message,
      status: ResponseStatus.success,
      statusCode: 200,
      authorization,
    });
  }

  static badRequest({ res, error }: ErrorResponseArgs) {
    this.send({
      res,
      error,
      status: ResponseStatus.fail,
      message: error.message,
      statusCode: 400,
    });
  }
  static unauthorized({ res, error, message }: UnautorizedResponseArgs) {
    this.send({
      res,
      error,
      status: ResponseStatus.fail,
      statusCode: 401,
      message,
    });
  }
}
