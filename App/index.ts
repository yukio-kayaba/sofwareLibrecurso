import http from "http";
import APP from "./app.js";
import { env } from "process";
import SocketControl from "./socketsControl.js";
import { initBD } from "./core/config/conexion.js";

process.on("uncaughtException", (err) => {
  console.error("🔥 uncaughtException:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("🔥 unhandledRejection:", reason);
});


initBD();

const server = http.createServer(APP);
const PORT = env.port || 4000;

const httpServer = server.listen(PORT, () => {
  console.log(
    `\n ======== Servidor Z en linea ==========\n \t 
      http://localhost:${PORT}/
    \n ========================================`
  );
});


const socketsControl = new SocketControl(httpServer);
socketsControl.principalConection();
