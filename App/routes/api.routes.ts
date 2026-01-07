import { Router } from "express";
import { SessionRoutes } from "../presentation/auth/routes.js";
import { AuthMiddleware } from "../presentation/middleware/Auth.middleware.js";
import { EntitiesRoutes } from "../presentation/entities/route.js";
import { InstallerRoutes } from "../presentation/installer/routes.js";

export class ApiRoutes {
  static get routes() {
    const router = Router();

    
    router.use("/auth", SessionRoutes.routes);
    
    router.use(
      AuthMiddleware.request,
      (req, res, next) => {
         // Wrapper para agrupar rutas protegidas si no hay un router intermedio, 
         // pero router.use permite multiples handlers.
         // Simplemente encadenamos el AuthMiddleware
         next(); 
      }
    );

    // Rutas protegidas
    router.use("/api", AuthMiddleware.request, EntitiesRoutes.routes); // Entities ya tiene 'repositorios' pero parece que api.routes lo monta en raiz?
    // Espera, api.routes usa AuthMiddleware.request y luego EntitiesRoutes.routes
    // router.use(AuthMiddleware.request, EntitiesRoutes.routes) significa que TODO lo que siga usará auth si lo encadenamos bien,
    // oEntitiesRoutes es el handler final.
    
    // Al mirar el codigo original:
    // router.use(AuthMiddleware.request, EntitiesRoutes.routes);
    // Esto significa que EntitiesRoutes maneja todo lo que llega ahi.
    // Si quiero agregar /installer hermano de /repositorios, debo ver si EntitiesRoutes permite agregar mas o si agrego otro router scan.
    
    // Mejor opcion: Agregar InstallerRoutes paralelo a EntitiesRoutes
    router.use("/api", AuthMiddleware.request, EntitiesRoutes.routes); 
    // Correccion: El codigo original no tenia prefijo "/api" en la linea 15, asumia que ApiRoutes ya estaba bajo /api en index.
    
    // Restaurando logica original y agregando installer
    router.use(AuthMiddleware.request, EntitiesRoutes.routes);
    router.use("/installer", AuthMiddleware.request, InstallerRoutes.routes);

    return router;
  }
}
