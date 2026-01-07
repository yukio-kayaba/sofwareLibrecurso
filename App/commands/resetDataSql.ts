import { initBD } from "../core/config/conexion.js";

import { DB } from "zormz";
import { generateTables } from "../sql/definitionTables.js";
initBD();

async function resetTables() {
  const {
    datalinux,
    repositorios,
    permisos,
    usuarios,
  } = generateTables();

  
  await DB.Delete(permisos()).execute();
  await DB.Delete(usuarios()).execute();
  await DB.Delete(datalinux()).execute();
  await DB.Delete(repositorios()).execute();



  console.log("La base de datos se reseteo con exito");

}

await resetTables();
