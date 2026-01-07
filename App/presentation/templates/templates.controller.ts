import { Request, Response } from "express";
import GetTemplatesUseCase from "../../domain/use-cases/templates/getTemplates.use-case.js";
import ManageRepositoryTemplatesUseCase from "../../domain/use-cases/templates/manageRepositoryTemplates.use-case.js";
import { CustomResponse } from "../../core/res/custom.response.js";
import { CustomError } from "../../core/res/Custom.error.js";

export class TemplatesController {
    // Obtener todos los templates disponibles
    getAll = async (req: Request, res: Response) => {
        try {
            const useCase = new GetTemplatesUseCase();
            const templates = await useCase.getAll();
            CustomResponse.success({ res, data: templates });
        } catch (error) {
            if (error instanceof CustomError) {
                CustomResponse.badRequest({ res, error: error.message });
            } else {
                console.error(error);
                CustomResponse.badRequest({ res, error: "Error al obtener templates" });
            }
        }
    };

    // Obtener un template por ID
    getById = async (req: Request, res: Response) => {
        try {
            const idTemplate = Number(req.params.id);
            if (!idTemplate) {
                CustomResponse.badRequest({ res, error: "ID de template requerido" });
                return;
            }

            const useCase = new GetTemplatesUseCase();
            const template = await useCase.getById(idTemplate);
            
            if (!template) {
                CustomResponse.badRequest({ res, error: "Template no encontrado" });
                return;
            }

            CustomResponse.success({ res, data: template });
        } catch (error) {
            if (error instanceof CustomError) {
                CustomResponse.badRequest({ res, error: error.message });
            } else {
                console.error(error);
                CustomResponse.badRequest({ res, error: "Error al obtener template" });
            }
        }
    };

    // Obtener templates asociados a un repositorio
    getByRepository = async (req: Request, res: Response) => {
        try {
            const idRepo = Number(req.params.idRepo);
            if (!idRepo) {
                CustomResponse.badRequest({ res, error: "ID de repositorio requerido" });
                return;
            }

            const useCase = new GetTemplatesUseCase();
            const templates = await useCase.getByRepository(idRepo);
            CustomResponse.success({ res, data: templates });
        } catch (error) {
            if (error instanceof CustomError) {
                CustomResponse.badRequest({ res, error: error.message });
            } else {
                console.error(error);
                CustomResponse.badRequest({ res, error: "Error al obtener templates del repositorio" });
            }
        }
    };

    // Agregar template a un repositorio
    addToRepository = async (req: Request, res: Response) => {
        try {
            if (req.authpayload === undefined) {
                CustomResponse.badRequest({ res, error: "No tienes permisos" });
                return;
            }

            const idRepo = Number(req.params.idRepo);
            const { idTemplate, orden } = req.body;

            if (!idRepo || !idTemplate) {
                CustomResponse.badRequest({ res, error: "ID de repositorio y template requeridos" });
                return;
            }

            const useCase = new ManageRepositoryTemplatesUseCase();
            const result = await useCase.addTemplateToRepository(
                req.authpayload.id,
                idRepo,
                idTemplate,
                orden || 1
            );

            CustomResponse.success({ res, data: result });
        } catch (error) {
            if (error instanceof CustomError) {
                CustomResponse.badRequest({ res, error: error.message });
            } else {
                console.error(error);
                CustomResponse.badRequest({ res, error: "Error al agregar template al repositorio" });
            }
        }
    };

    // Remover template de un repositorio
    removeFromRepository = async (req: Request, res: Response) => {
        try {
            if (req.authpayload === undefined) {
                CustomResponse.badRequest({ res, error: "No tienes permisos" });
                return;
            }

            const idRepo = Number(req.params.idRepo);
            const idAssociation = Number(req.params.idAssociation);

            if (!idRepo || !idAssociation) {
                CustomResponse.badRequest({ res, error: "IDs requeridos" });
                return;
            }

            const useCase = new ManageRepositoryTemplatesUseCase();
            const result = await useCase.removeTemplateFromRepository(
                req.authpayload.id,
                idRepo,
                idAssociation
            );

            CustomResponse.success({ res, data: result });
        } catch (error) {
            if (error instanceof CustomError) {
                CustomResponse.badRequest({ res, error: error.message });
            } else {
                console.error(error);
                CustomResponse.badRequest({ res, error: "Error al remover template del repositorio" });
            }
        }
    };

    // Actualizar orden de template en repositorio
    updateOrder = async (req: Request, res: Response) => {
        try {
            if (req.authpayload === undefined) {
                CustomResponse.badRequest({ res, error: "No tienes permisos" });
                return;
            }

            const idRepo = Number(req.params.idRepo);
            const idAssociation = Number(req.params.idAssociation);
            const { orden } = req.body;

            if (!idRepo || !idAssociation || orden === undefined) {
                CustomResponse.badRequest({ res, error: "IDs y orden requeridos" });
                return;
            }

            const useCase = new ManageRepositoryTemplatesUseCase();
            const result = await useCase.updateTemplateOrder(
                req.authpayload.id,
                idRepo,
                idAssociation,
                orden
            );

            CustomResponse.success({ res, data: result });
        } catch (error) {
            if (error instanceof CustomError) {
                CustomResponse.badRequest({ res, error: error.message });
            } else {
                console.error(error);
                CustomResponse.badRequest({ res, error: "Error al actualizar orden" });
            }
        }
    };
}

