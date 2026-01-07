import { DB, eq, OR } from "zormz";
import { generateTables } from "./definitionTables.js";
import { insertUser, permisoResponse } from "../types/sql.js";
import { permisosCliente, permisosColaborador, PermisosPrincipal } from "../consts.js";
import { map } from "zod";

export async function InsertarUsuario({
  correo,
  contra,
  dni,
  nombrecompleto,
  rol,
  diastrabajo = ["lunes", "domingo"],
}: insertUser) {
  const { usuarios, colaborador, detallespermisos, permisos } =
    generateTables();

  const id = await DB.Insert(usuarios(), [usuarios.correo, usuarios.contra])
    .Values([correo, contra])
    .execute();
  console.log(id);
  if (!id) {
    throw new Error("Ocurrio un error al momento de registrar al usuario");
  }

  const idcol = await DB.Insert(colaborador(), [
    colaborador.idusuario,
    colaborador.nombrecompleto,
    colaborador.dni,
    colaborador.rol,
    colaborador.diastrabajo,
  ])
    .Values([id.toString(), nombrecompleto, dni, rol, diastrabajo.join(" - ")])
    .execute();

  let permisions: any[] = [];
  let condicional = undefined;
  let condicionals:string[] = [];

  if (rol === "apoyo") {
    condicional = "";  
    permisosColaborador.map(valor =>{
      condicionals.push(eq(permisos.nombre,valor));
    })
    condicional = OR(...condicionals);
  }else if(rol === "operativo"){
    condicional = "";
    permisosCliente.map(valor =>{
      condicionals.push(eq(permisos.nombre, valor));
    })
    condicional = OR(...condicionals);
  }
  const responsePermisions = await DB.Select([
    permisos.idpermiso,
    permisos.nombre,
  ])
    .from(permisos()).where(condicional)
    .execute() as permisoResponse[] | undefined;


  if (responsePermisions === undefined ) {
    console.log("ocurrio un error al agregar los permisos");
    return;
  }
  if(responsePermisions.length <= 0 ){
    console.log("Error permisos no encontrados");
    return
  }


  for (let i = 0; i < responsePermisions.length; i++) {
    permisions.push([idcol, responsePermisions[i].idpermiso]);
  }

  await DB.Insert(detallespermisos(), [
    detallespermisos.idcolaborador,
    detallespermisos.idppermiso,
  ])
    .Values(permisions)
    .execute();
  console.log("Usuario creado con exito");
}
