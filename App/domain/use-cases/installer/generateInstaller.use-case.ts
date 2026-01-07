
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
        script += `set -e  # Salir si hay algún error\n\n`;
        script += `# ============================================\n`;
        script += `# CONFIGURACIÓN GENERADA AUTOMÁTICAMENTE\n`;
        script += `# Repositorio ID: ${idRepo}\n`;
        script += `# Generado: ${new Date().toISOString()}\n`;
        script += `# ============================================\n\n`;
        
        // Variables principales del repositorio
        script += `# Variables de configuración principal\n`;
        script += `DOMAIN="${repoData.dominio}"\n`;
        script += `ORG="${repoData.orgdata}"\n`;
        script += `IP="${repoData.ipdata}"\n`;
        script += `PORT="${repoData.portdata}"\n`;
        script += `ADMIN_PW="${repoData.contrarepo}"\n`;
        
        // Variables derivadas
        const domainParts = repoData.dominio.split('.').filter(p => p);
        const baseDN = domainParts.length > 0 
            ? domainParts.map(p => `dc=${p}`).join(',')
            : `dc=${repoData.orgdata},dc=org`;
        
        script += `BASE_DN="${baseDN}"\n`;
        
        // Variables adicionales con valores por defecto
        script += `\n# Variables adicionales (pueden ser sobrescritas)\n`;
        script += `MASK="${process.env.DEFAULT_MASK || '24'}"\n`; // /24 = 255.255.255.0
        script += `GATEWAY="${process.env.DEFAULT_GATEWAY || ''}"\n`;
        script += `DNS1="${process.env.DEFAULT_DNS1 || '8.8.8.8'}"\n`;
        script += `DNS2="${process.env.DEFAULT_DNS2 || '8.8.4.4'}"\n`;
        script += `INTERFACE=""\n`; // Se detectará automáticamente
        script += `HOSTNAME=""\n`; // Opcional
        script += `TIMEZONE="${process.env.DEFAULT_TIMEZONE || 'UTC'}"\n`;
        
        script += `\n# --- FIN CONFIGURACIÓN ---\n\n`;

        // Añadir templates
        for (const tmpl of templatesToProcess) {
            script += `${tmpl.contenido}\n\n`;
        }

        // Return solo el string
        return script;
    }
}
