
import { AND, DB, eq } from "zormz";
import { generateTables } from "../../../sql/definitionTables.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { PermisosValidate } from "../../validators/permisosValidate.js";

export default class GenerateInstallerUseCase {
    async execute(idUser: number, idRepo: number) {
        
        // 1. Validar Permisos (Debe tener permiso 'ejecutar')
        const validatePermiso = await PermisosValidate.validate("ejecutar", idUser, idRepo, true);
        if (!validatePermiso.ejecutar) {
            throw CustomError.unauthorized("No tienes permisos para generar instaladores de este repositorio");
        }

        const { repositorios, datalinux, repositorio_datalinux } = generateTables();

        // 2. Obtener config del Repositorio
        const repo = await DB.Select([
            repositorios.ipdata,
            repositorios.portdata,
            repositorios.dominio,
            repositorios.orgdata,
            repositorios.contrarepo
        ])
        .from(repositorios())
        .where(eq(repositorios.idrepo, idRepo))
        .execute();

        if (!repo || repo.length === 0) {
            throw CustomError.notFound("Repositorio no encontrado");
        }
        const repoData = repo[0];

        // 3. Obtener templates asociados en orden
        // Nota: DB.Select devuelve un array de objetos.
        // Hacemos un JOIN entre repositorio_datalinux y datalinux
        
        const templatesWithOrder = await DB.Select([
            datalinux.contenido,
            repositorio_datalinux.orden
        ])
        .from(repositorio_datalinux())
        .innerJOIN(datalinux(), eq(datalinux.iddatalinux, repositorio_datalinux.iddatalinux))
        .where(eq(repositorio_datalinux.idrepositorio, idRepo))
        .execute();
        
        // Ordenar en javascript
        if (templatesWithOrder && templatesWithOrder.length > 0) {
            templatesWithOrder.sort((a: any, b: any) => a.orden - b.orden);
        } else {
             // Si no hay templates, el loop no iterará, es seguro.
             // Pero debemos asegurar que sea iterable si es undefined
        }

        const templatesToProcess = templatesWithOrder || [];


        // 4. Construir el Script
        let script = `#!/bin/bash\n\n`;
        
        script += `# --- CONFIGURACIÓN GENERADA AUTOMÁTICAMENTE ---\n`;
        script += `DOMAIN="${repoData.dominio}"\n`;
        script += `ORG="${repoData.orgdata}"\n`;
        script += `IP="${repoData.ipdata}"\n`; // Estandarizamos a IP genérico o LDAP_SERVER_IP según uso
        script += `PORT="${repoData.portdata}"\n`;
        script += `ADMIN_PW="${repoData.contrarepo}"\n`;
        
        // Variables derivadas o específicas
        script += `BASE_DN="dc=${repoData.orgdata},dc=org" # Ejemplo derivada\n`;
        script += `\n# --- FIN CONFIGURACIÓN ---\n\n`;

        // Añadir templates
        for (const tmpl of templatesToProcess) {
            script += `${tmpl.contenido}\n\n`;
        }

        // Return solo el string
        return script;
    }
}
