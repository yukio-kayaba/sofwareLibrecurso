import { Router } from "express";
import { SessionRoutes } from "../presentation/auth/routes.js";
import { AuthMiddleware } from "../presentation/middleware/Auth.middleware.js";
import { EntitiesRoutes } from "../presentation/entities/route.js";

export class ApiRoutes {
  static get routes() {
    const router = Router();

    
    router.use("/auth", SessionRoutes.routes);
    
    router.use(
      EntitiesRoutes.routes
    );

    return router;
  }
}
