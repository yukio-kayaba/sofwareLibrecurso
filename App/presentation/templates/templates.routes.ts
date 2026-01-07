import { Router } from "express";
import { TemplatesController } from "./templates.controller.js";

export class TemplatesRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new TemplatesController();

        // Obtener todos los templates disponibles
        router.get("/", controller.getAll);

        // Obtener un template por ID
        router.get("/:id", controller.getById);

        // Obtener templates de un repositorio
        router.get("/repository/:idRepo", controller.getByRepository);

        // Agregar template a repositorio
        router.post("/repository/:idRepo", controller.addToRepository);

        // Remover template de repositorio
        router.delete("/repository/:idRepo/association/:idAssociation", controller.removeFromRepository);

        // Actualizar orden de template
        router.put("/repository/:idRepo/association/:idAssociation/order", controller.updateOrder);

        return router;
    }
}

