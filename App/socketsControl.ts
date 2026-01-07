import http from "http";
import { Socket, Server as SocketIOServer } from "socket.io";

export default class SocketControl {
  private io: SocketIOServer | null;
  constructor(httpServer: http.Server) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
      },
    });
  }

  principalConection() {
    if (!this.io) {
      console.error("Socket.IO no inicializado");
      return;
    }
    this.io.on("connection", (usuario) => {
      console.log(`usuario : ${usuario.id}`);
      usuario.on("client:newData", (data) => {
        console.log(data);
      });
    });
  }
}
