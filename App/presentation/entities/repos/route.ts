import { Request, Response, Router } from "express";
import { ReposController } from "./controller.js";


export class ReposRoutes{
    static get routes(){
        const router = Router();
        const reposController = new ReposController()

        router.get("/", reposController.getall);

        router.get("/:id",reposController.getById);

        router.post("/",reposController.create);

        router.post("/addteam", reposController.unirseGroup);

        return router;
    }
}