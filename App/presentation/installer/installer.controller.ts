
import { Request, Response } from "express";
import GenerateInstallerUseCase from "../../domain/use-cases/installer/generateInstaller.use-case.js";
import { CustomError } from "../../core/res/Custom.error.js";

export class InstallerController {
    constructor() {}

    public  generate = async (req: Request, res: Response) => {
        try {
            const { idRepo } = req.params;
            const idUser = (req as any).user?.id; // Asumiendo middleware de auth que popola req.user

            if (!idUser) {
                // Fallback por si el middleware falla o no se usa
                throw CustomError.unauthorized("Usuario no autenticado");
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
