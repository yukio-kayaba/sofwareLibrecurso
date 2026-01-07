import { DB, eq } from "zormz";
import { generateTables } from "../../../sql/definitionTables.js";

export default class ReposGetAllUseCase {
  async getAll() {
    const { repositorios } = generateTables();

    const resultado = await DB.Select([
      repositorios.idrepo,
      repositorios.nombrerepo,
      repositorios.descripcion,
    ]).from(repositorios()).where(eq(repositorios.estado,true)).execute();

    return resultado;
  }
}
