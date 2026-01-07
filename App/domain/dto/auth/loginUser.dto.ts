import { createSessionValidator } from "../../validators/auth/sessionValidator.js";

export class LoginUserDto {
  public usuario: string;
  public password: string;

  private constructor({ usuario, password }: LoginUserDto) {
    this.usuario = usuario;
    this.password = password;
  }

  static createSessionUserMain(input: any): [string?, LoginUserDto?] {
    const result = createSessionValidator(input);
    if (!result.success) {
      return ["Error al iniciar Session", undefined];
    }
    return [undefined, new LoginUserDto(result.data)];
  }

}
