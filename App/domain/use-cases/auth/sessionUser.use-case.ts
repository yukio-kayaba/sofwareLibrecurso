import { AND, DB, eq } from "zormz";
import { JWTadapter } from "../../../core/config/AccessToken.js";
import { LoginUserDto } from "../../dto/auth/loginUser.dto.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { generateTables } from "../../../sql/definitionTables.js";
import { CreateUserDto } from "../../dto/auth/createUser.dto.js";

export default class SessionUserUseCase {
  private generarToken(input: Record<string, any>, duration?: number) {
    const token = JWTadapter.createAccessToken({
      payload: input,
      duration,
    });

    return token;
  }

  async sessionUser(data: LoginUserDto) {
    const { usuarios } = generateTables();

    const resutado = await DB.Select([usuarios.idusuario])
      .from(usuarios())
      .where(
        AND(
          eq(usuarios.correo, data.usuario),
          eq(usuarios.contra, data.password)
        )
      )
      .execute();

    console.log(resutado);
    if (!resutado || resutado.length <= 0) {
      throw CustomError.badRequest("Usuario o contra Incorrectas");
    }

    const tokenZ = this.generarToken(resutado[0]);
    return { tokenZ };
  }

  async createCountUser(data: CreateUserDto) {
    const { usuarios } = generateTables();

    const resultado = await DB.Insert(usuarios(), [
      usuarios.nombrecompleto,
      usuarios.correo,
      usuarios.contra,
      usuarios.dni,
    ]).Values([data.nombrecompleto,data.correo,data.contra,data.dni]).execute();
    
    if(!resultado){
      throw CustomError.badRequest("Ocurrio un error al momento de crear la cuenta");
    }
    const idUser = {
      idusuario:resultado      
    }
    console.log(idUser);
    const tokenZ = this.generarToken(idUser);
    return tokenZ;
  }
}
