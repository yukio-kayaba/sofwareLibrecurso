import { Request, Response } from "express";
import { LoginUserDto } from "../../domain/dto/auth/loginUser.dto.js";
import { CustomResponse } from "../../core/res/custom.response.js";
import SessionUserUseCase from "../../domain/use-cases/auth/sessionUser.use-case.js";
import { CreateUserDto } from "../../domain/dto/auth/createUser.dto.js";

export class AuthController {
  sessionMain(req: Request, res: Response) {
    const [error, sessionDtoUser] = LoginUserDto.createSessionUserMain(
      req.body
    );
    
    if (error != undefined || sessionDtoUser === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const initSession = new SessionUserUseCase();
    initSession
      .sessionUser(sessionDtoUser)
      .then((data) => {
        CustomResponse.success({ res, data, message: "Logeado con Exito !! " });
      })
      .catch((error: Error) => {
        CustomResponse.badRequest({ res, error });
      });
  }

  createCountMain(req:Request,res:Response){
    const [error,countValidate] = CreateUserDto.createCountUserMain(req.body);

    if(error != undefined || countValidate === undefined){
      CustomResponse.badRequest({res,error})
      return
    } 
    const cuentaCreada = new SessionUserUseCase();
    cuentaCreada.createCountUser(countValidate).then((data)=>{
      CustomResponse.success({res,data,message:"Se creo la cuenta con exito"})
    }).catch(error =>{
      CustomResponse.badRequest({res,error})
    })
  }

}
