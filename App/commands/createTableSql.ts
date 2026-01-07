import { initBD } from "../core/config/conexion.js";

import { generateTable } from "zormz";
import { generateTables } from "../sql/definitionTables.js";
initBD();


async function generarTablas(){
  const {
    datalinux,
    repositorios,
    permisos,
    usuarios
  } = generateTables();

  
  await generateTable(permisos(), permisos.$columns);
  
  await generateTable(usuarios(),usuarios.$columns);

  await generateTable(datalinux(),datalinux.$columns);

  await generateTable(repositorios(),repositorios.$columns);

}

await generarTablas();