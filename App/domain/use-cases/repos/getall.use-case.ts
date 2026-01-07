import { AND, DB, eq } from "zormz";
import { generateTables } from "../../../sql/definitionTables.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { PermisosValidate } from "../../validators/permisosValidate.js";
import { CreateRepositorioDto } from "../../dto/repos/createRepos.dto.js";

export default class ReposGetAllUseCase {
  async getAll() {
    const { repositorios } = generateTables();

    const resultado = await DB.Select([
      repositorios.idrepo,
      repositorios.nombrerepo,
      repositorios.descripcion,
    ]).from(repositorios())
    .where(eq(repositorios.estado, 1)).execute();

    return resultado;
  }

  async getBiId(idUser: number, idrepo: number) {
    const { repositorios, usuarios } = generateTables()

    const verifyAcceso = await DB.Select([repositorios.idcreador]).
      from(repositorios())
      .where(AND(eq(repositorios.idrepo, idrepo), eq(repositorios.idcreador, idUser)))
      .execute()

    console.log(verifyAcceso);

    let selectFields = [repositorios.idrepo,
    repositorios.nombrerepo,
    repositorios.descripcion,
    usuarios.nombrecompleto];

    if (!verifyAcceso) {
      selectFields.push(repositorios.dominio,
        repositorios.estado,
        repositorios.contrarepo,
        repositorios.ipdata,
        repositorios.orgdata,
        repositorios.portdata,
        repositorios.dominio
      )
    }

    const resultado = await DB.Select(selectFields)
      .from(repositorios())
      .innerJOIN(usuarios(), eq(usuarios.idusuario, repositorios.idcreador, true))
      //.where(eq(repositorios.idrepo, idrepo))
      .execute()

    if(!resultado ){
      throw CustomError.badRequest("Error al acceder al repositorio");
    }

    return resultado
  }
 
  async unirseRepo(idUser:number,idrepo:number,password:string){
    const validatePermiso = await PermisosValidate.validate("leer",idUser,idrepo,true);
    
    if(validatePermiso.ejecutar && validatePermiso.escribir && validatePermiso.leer){
      return 1;
    }

    const { permisos,repositorios } = generateTables()

    const permiso =  await DB.Select([repositorios.estado])
    .from(repositorios())
    .where(eq(repositorios.contrarepo,password))
    .execute()

    if(!permiso){
      throw CustomError.badRequest("Contra de repo erronea");
    }

    const resultado = await DB.Insert(permisos(),[permisos.idrepositorio,
      permisos.idcolaborador,
      permisos.leer,
      permisos.escribir,
      permisos.ejecutar
    ]).Values([idrepo,idUser,false,false,false]).execute();

    console.log(resultado);
    return 1;
  }

  async create(data:CreateRepositorioDto,idUser:number){
    const { repositorios } = generateTables() ;
    const responses = await DB.Insert(repositorios(),[ 
      repositorios.idcreador,
      repositorios.nombrerepo,
      repositorios.descripcion,
      repositorios.ipdata,
      repositorios.portdata,
      repositorios.dominio,
      repositorios.orgdata,
      repositorios.contrarepo
    ]).Values([
      idUser,
      data.nombrerepo,
      data.descripcion,
      data.ipdata,
      data.portdata,
      data.dominio,
      data.orgdata,
      data.contrarepo
    ]).execute()


    if(!responses){
      throw CustomError.badRequest("Error al momento de crear")
    }
    return responses;
  }
}
