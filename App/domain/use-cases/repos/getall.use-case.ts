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
    ])
      .from(repositorios())
      .where(eq(repositorios.estado, 1))
      .execute();

    return resultado;
  }

  async getBiId(idUser: number, idrepo: number) {
    const { repositorios, usuarios } = generateTables();

    const verifyAcceso = await DB.Select([repositorios.idcreador])
      .from(repositorios())
      .where(
        AND(eq(repositorios.idrepo, idrepo), eq(repositorios.idcreador, idUser))
      )
      .execute();

    console.log(verifyAcceso);
    let selectFields = [
      repositorios.idrepo,
      repositorios.nombrerepo,
      repositorios.descripcion,
    ];

    if (!verifyAcceso || verifyAcceso.length <= 0) {
      selectFields.push(
        repositorios.dominio,
        repositorios.estado,
        repositorios.contrarepo,
        repositorios.ipdata,
        repositorios.orgdata,
        repositorios.portdata,
        repositorios.dominio
      );
    }

    const resultado = await DB.Select(selectFields)
      .from(repositorios())
      .where(eq(repositorios.idrepo, idrepo))
      .execute();

    if (!resultado) {
      throw CustomError.badRequest("Error al acceder al repositorio");
    }

    return resultado;
  }

  async unirseRepo(idUser: number, idrepo: number, password: string) {
    const validatePermiso = await PermisosValidate.validate(
      "leer",
      idUser,
      idrepo,
      true
    );

    if (
      validatePermiso.ejecutar &&
      validatePermiso.escribir &&
      validatePermiso.leer
    ) {
      return 1;
    }

    const { permisos, repositorios } = generateTables();

    const permiso = await DB.Select([repositorios.estado])
      .from(repositorios())
      .where(eq(repositorios.contrarepo, password))
      .execute();

    if (!permiso) {
      throw CustomError.badRequest("Contra de repo erronea");
    }

    const resultado = await DB.Insert(permisos(), [
      permisos.idrepositorio,
      permisos.idcolaborador,
      permisos.leer,
      permisos.escribir,
      permisos.ejecutar,
    ])
      .Values([idrepo, idUser, false, false, false])
      .execute();

    console.log(resultado);
    return 1;
  }

  async create(data: CreateRepositorioDto, idUser: number) {
    const { repositorios, permisos } = generateTables();

    const responses = await DB.Insert(repositorios(), [
      repositorios.idcreador,
      repositorios.nombrerepo,
      repositorios.descripcion,
      repositorios.ipdata,
      repositorios.portdata,
      repositorios.dominio,
      repositorios.orgdata,
      repositorios.contrarepo,
    ])
      .Values([
        idUser,
        data.nombrerepo,
        data.descripcion,
        data.ipdata,
        data.portdata,
        data.dominio,
        data.orgdata,
        data.contrarepo,
      ])
      .execute();

    if (!responses) {
      throw CustomError.badRequest("Error al momento de crear");
    }
    console.log(responses);

    const createPermisos = await DB.Insert(permisos(), [
      permisos.idrepositorio,
      permisos.idcolaborador,
      permisos.leer,
      permisos.ejecutar,
      permisos.escribir,
    ])
      .Values([responses.toString(), idUser, 1, 1, 1])
      .execute();
    console.log(createPermisos);
    return responses;
  }

  async miRepositori(idUser: number) {
    const { repositorios, permisos } = generateTables();

    const resultado = await DB.Select([
      repositorios.idrepo,
      repositorios.nombrerepo,
      repositorios.descripcion,
      repositorios.dominio,
    ])
      .from(repositorios())
      .innerJOIN(
        permisos(),
        eq(repositorios.idrepo, permisos.idrepositorio, false)
      )
      .where(AND(eq(permisos.leer, 1), eq(permisos.idcolaborador, idUser)))
      .execute();

    console.log(resultado);
    if (!resultado) {
      throw CustomError.badRequest(
        "Ocurrio un error al momento de obtener los repositorios"
      );
    }
    return resultado;
  }

  async permitirAcceso(idUser: number, idRepo: number,idcolaborador:number) {
    const { permisos, repositorios } = generateTables();

    const verificar = await DB.Select([repositorios.idrepo])
      .from(permisos())
      .where(AND(eq(repositorios.idcreador,idUser),eq(repositorios.idrepo,idRepo)))
      .execute();
    if (!verificar) {
      throw CustomError.badRequest("No tienes permisos para este repositorio");
    }

    const actualizar = await DB.Update(permisos())
      .set({
        leer: 1,
        escribir: 1,
        ejecutar: 1,
      })
      .where(
        AND(
          eq(permisos.idcolaborador, idcolaborador),
          eq(permisos.idrepositorio, idRepo)
        )
      )
      .execute();
    if(!actualizar){
      throw CustomError.badRequest("Ocurrio un error al acutalizar");
    }
    return actualizar;
  }
}
