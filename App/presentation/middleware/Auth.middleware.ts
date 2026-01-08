import { NextFunction, Request, Response } from "express";
import { CustomResponse } from "../../core/res/custom.response.js";
import { JWTadapter } from "../../core/config/AccessToken.js";
import jwt from "jsonwebtoken";
const { JsonWebTokenError } = jwt

export class AuthMiddleware {
  private static handleAuthError(res: Response) {
    CustomResponse.unauthorized({ res, error: "El token esta caducado" });
  }

  private static handlerOuthLogin(res: Response) {
    CustomResponse.unauthorized({ res, error: "token Caducado" });
  }

  private static handleLogout(res: Response, errorMes: string) {
    CustomResponse.unauthorized({ res, message: errorMes });
  }

  static verifiAcceso = (req: Request, res: Response, nex: NextFunction) => {
    const id = req.authpayload;
  };

  static request = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    
    if (authHeader === undefined || typeof authHeader !== "string") {
      AuthMiddleware.handleAuthError(res);
      return;
    }
    const partes = authHeader.split(" ");
    
    if (partes.length !== 2 || partes[0].toLowerCase() !== "bearer") {
      console.log('AuthMiddleware - Formato incorrecto. Partes:', partes);
      AuthMiddleware.handleAuthError(res);
      return;
    }

    const [, token] = partes;
    
    if (!token || token.trim() === '') {
      AuthMiddleware.handleAuthError(res);
      return;
    }

    try {
      const decodeAuthpayload = JWTadapter.verifyToken({
        token,
      }) as Authpayload;


      const tiempoActual = Math.floor(Date.now() / 1000);
      if (!decodeAuthpayload.exp) {
        decodeAuthpayload.exp = 400;
      }
      const tiempoRestante = decodeAuthpayload.exp - tiempoActual;
      req.authpayload = decodeAuthpayload;
      req.tiempo = tiempoRestante;

      if (req.authpayload === undefined || req.tiempo < 0) {
        return AuthMiddleware.handleAuthError(res);
      }
      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        AuthMiddleware.handleAuthError(res);
        return;
      }
      if (error instanceof Error) {
        return next(error);
      }
      return next(
        error instanceof Error
          ? error
          : new Error("Error desconocido en AuthMiddleware")
      );
    }
  };
}
