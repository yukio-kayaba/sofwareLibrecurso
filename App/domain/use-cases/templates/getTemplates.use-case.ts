import { DB, eq } from "zormz";
import { generateTables } from "../../../sql/definitionTables.js";

export default class GetTemplatesUseCase {
    async getAll() {
        const { datalinux } = generateTables();
        
        const templates = await DB.Select([
            datalinux.iddatalinux,
            datalinux.nombredata,
            datalinux.variables,
            datalinux.contenido
        ])
        .from(datalinux())
        .execute();

        return templates || [];
    }

    async getById(idTemplate: number) {
        const { datalinux } = generateTables();
        
        const template = await DB.Select([
            datalinux.iddatalinux,
            datalinux.nombredata,
            datalinux.variables,
            datalinux.contenido
        ])
        .from(datalinux())
        .where(eq(datalinux.iddatalinux, idTemplate))
        .execute();

        if (!template || template.length === 0) {
            return null;
        }

        return template[0];
    }

    async getByRepository(idRepo: number) {
        const { datalinux, repositorio_datalinux } = generateTables();
        
        const templates = await DB.Select([
            datalinux.iddatalinux,
            datalinux.nombredata,
            datalinux.variables,
            datalinux.contenido,
            repositorio_datalinux.orden,
            repositorio_datalinux.id
        ])
        .from(repositorio_datalinux())
        .innerJOIN(datalinux(), eq(datalinux.iddatalinux, repositorio_datalinux.iddatalinux))
        .where(eq(repositorio_datalinux.idrepositorio, idRepo))
        .execute();

        if (!templates || templates.length === 0) {
            return [];
        }

        // Ordenar por orden
        templates.sort((a: any, b: any) => a.orden - b.orden);
        return templates;
    }
}

