import { connecionLocal, getConexion } from "zormz";
import { envs } from "./envs.js";

const { DB_DATABASE, DB_HOST, DB_PASS, DB_PORT, DB_USER } = envs;


export async function initBD(){
    const conexion: connecionLocal = {
      database: DB_DATABASE,
      host: DB_HOST,
      password: DB_PASS,
      port: DB_PORT,
      user: DB_USER,
    };

    await getConexion("pg", conexion);
}