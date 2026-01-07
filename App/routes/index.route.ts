import { Router } from "express";
import { ApiRoutes } from "./api.routes.js";

export class RouterPrincipal {
  router() {
    const router = Router();
    console.log("pasando por las rutas");

    router.use("/api", ApiRoutes.routes);

    return router;
  }
}
