
import { Request, Response } from "express";
import GenerateInstallerUseCase from "../../domain/use-cases/installer/generateInstaller.use-case.js";
import { CustomError } from "../../core/res/Custom.error.js";

export class InstallerController {
    constructor() {}

    public  generate = async (req: Request, res: Response) => {
        try {
            const { idRepo } = req.params;
            
            if (!req.authpayload) {
                throw CustomError.unauthorized("Usuario no autenticado");
            }
            
            const idUser = req.authpayload.idusuario || req.authpayload.id;

            if (!idUser) {
                throw CustomError.unauthorized("No se pudo obtener el ID del usuario");
            }

            const useCase = new GenerateInstallerUseCase();
            const scriptContent = await useCase.execute(Number(idUser), Number(idRepo));

            // Configurar headers para descarga
            res.setHeader('Content-Type', 'application/x-sh');
            res.setHeader('Content-Disposition', `attachment; filename="install_repo_${idRepo}.sh"`);
            
            res.send(scriptContent);

        } catch (error) {
            if(error instanceof CustomError){
                res.status(error.statusCode).json({ error: error.message });
            } else {
                console.error(error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
}
