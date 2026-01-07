import { dropTable } from "zormz";
import { initBD } from "../core/config/conexion.js";

import { generateTables } from "../sql/definitionTables.js";
initBD();

async function deleteTables() {
  const  {
    datalinux,
    repositorios,
    permisos,
    usuarios
  } = generateTables();

  await dropTable(permisos());
  await dropTable(usuarios());
  await dropTable(datalinux());
  await dropTable(repositorios())

}

await deleteTables();
