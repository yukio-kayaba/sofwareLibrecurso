import { Router } from "express";
import { SessionRoutes } from "../presentation/auth/routes.js";
import { AuthMiddleware } from "../presentation/middleware/Auth.middleware.js";
import { EntitiesRoutes } from "../presentation/entities/route.js";
import { InstallerRoutes } from "../presentation/installer/routes.js";

export class ApiRoutes {
  static get routes() {
    const router = Router();

    
    router.use("/auth", SessionRoutes.routes);
    


    router.use(AuthMiddleware.request, EntitiesRoutes.routes);     
    
    router.use("/installer", AuthMiddleware.request, InstallerRoutes.routes);

    return router;
  }
}
