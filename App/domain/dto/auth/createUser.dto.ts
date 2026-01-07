import { createCountUserValidator } from "../../validators/auth/sessionValidator.js";

export class CreateUserDto{
    
    public nombrecompleto:string;
    public dni:string;
    public activo?:boolean;
    public correo:string;
    public contra:string;

    private constructor({nombrecompleto,dni,activo = true,correo,contra}:CreateUserDto){
        this.correo = correo;
        this.contra = contra;
        this.activo = activo;
        this.dni = dni;
        this.nombrecompleto = nombrecompleto
    }

    static createCountUserMain(input:any):[string?, CreateUserDto?]{
        const result = createCountUserValidator(input);

        if(!result.success){
            return [result.error.message,undefined]
        }
        return [undefined,new CreateUserDto(result.data)]
    }

    
}
