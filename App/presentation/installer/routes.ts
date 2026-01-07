
import { Router } from "express";
import { InstallerController } from "./installer.controller.js";

export class InstallerRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new InstallerController();

        router.get("/:idRepo", controller.generate);

        return router;
    }
}
