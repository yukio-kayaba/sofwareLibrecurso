import { Router } from "express";
import { ReposRoutes } from "./repos/route.js";

export class EntitiesRoutes {
  static get routes() {
    const router = Router();

    router.use("/repositorios",ReposRoutes.routes);
    

    return router;
  }
}
