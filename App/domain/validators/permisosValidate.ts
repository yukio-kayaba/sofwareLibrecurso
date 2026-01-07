import { AND, DB, eq } from "zormz";
import { PermisoValor } from "../../consts.js";
import { generateTables } from "../../sql/definitionTables.js";
import { CustomError } from "../../core/res/Custom.error.js";

type resultValidation = {
    leer:boolean,
    escribir:boolean,
    ejecutar:boolean
}

export class PermisosValidate{

    static async validate(permisos1:PermisoValor,idUser:number,idRepositorio:number,ver = false ): Promise<resultValidation> {
        const { permisos } = generateTables();
        const validateUser = await DB.Select([permisos.leer, permisos.escribir,permisos.ejecutar])
          .from(permisos())
          .where(AND(eq(permisos.idrepositorio,idRepositorio),eq(permisos1,1)) )
          .execute();
        
          if(!validateUser || validateUser.length <= 0){
            if(ver){
              const validationResponse: resultValidation = {
                leer: false,
                escribir: false,
                ejecutar: false,
              };      
              return validationResponse;
            }
            throw CustomError.badRequest(`No tienes permisos  ${permisos1} `);
          }
        const validationResponse:resultValidation = {
            leer:validateUser[0].leer,
            escribir:validateUser[0].escribir,
            ejecutar:validateUser[0].ejecutar
        }

        return validationResponse;
    }

}