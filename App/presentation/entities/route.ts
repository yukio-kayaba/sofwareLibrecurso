import { Router } from "express";
import { ReposRoutes } from "./repos/route.js";
import { TemplatesRoutes } from "../templates/templates.routes.js";

export class EntitiesRoutes {
  static get routes() {
    const router = Router();

    router.use("/repositorios",ReposRoutes.routes);
    router.use("/templates", TemplatesRoutes.routes);
    

    return router;
  }
}
