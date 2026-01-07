import { AND, DB, eq } from "zormz";
import { generateTables } from "../../../sql/definitionTables.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { PermisosValidate } from "../../validators/permisosValidate.js";

export default class ManageRepositoryTemplatesUseCase {
    async addTemplateToRepository(
        idUser: number,
        idRepo: number,
        idTemplate: number,
        orden: number = 1
    ) {
        // Validar permisos de escritura
        const validatePermiso = await PermisosValidate.validate("escribir", idUser, idRepo, true);
        if (!validatePermiso.escribir) {
            throw CustomError.unauthorized("No tienes permisos para modificar este repositorio");
        }

        const { repositorio_datalinux, datalinux } = generateTables();

        // Verificar que el template existe
        const template = await DB.Select([datalinux.iddatalinux])
            .from(datalinux())
            .where(eq(datalinux.iddatalinux, idTemplate))
            .execute();

        if (!template || template.length === 0) {
            throw CustomError.notFound("Template no encontrado");
        }

        // Verificar si ya existe la asociación
        const existing = await DB.Select([repositorio_datalinux.id])
            .from(repositorio_datalinux())
            .where(
                AND(
                    eq(repositorio_datalinux.idrepositorio, idRepo),
                    eq(repositorio_datalinux.iddatalinux, idTemplate)
                )
            )
            .execute();

        if (existing && existing.length > 0) {
            throw CustomError.badRequest("Este template ya está asociado al repositorio");
        }

        // Insertar asociación
        await DB.Insert(repositorio_datalinux(), [
            repositorio_datalinux.idrepositorio,
            repositorio_datalinux.iddatalinux,
            repositorio_datalinux.orden
        ]).Values([idRepo, idTemplate, orden]).execute();

        return { success: true };
    }

    async removeTemplateFromRepository(
        idUser: number,
        idRepo: number,
        idAssociation: number
    ) {
        // Validar permisos de escritura
        const validatePermiso = await PermisosValidate.validate("escribir", idUser, idRepo, true);
        if (!validatePermiso.escribir) {
            throw CustomError.unauthorized("No tienes permisos para modificar este repositorio");
        }

        const { repositorio_datalinux } = generateTables();

        // Verificar que la asociación pertenece al repositorio
        const association = await DB.Select([repositorio_datalinux.idrepositorio])
            .from(repositorio_datalinux())
            .where(eq(repositorio_datalinux.id, idAssociation))
            .execute();

        if (!association || association.length === 0) {
            throw CustomError.notFound("Asociación no encontrada");
        }

        if (association[0].idrepositorio !== idRepo) {
            throw CustomError.unauthorized("Esta asociación no pertenece al repositorio");
        }

        // Eliminar asociación
        await DB.Delete(repositorio_datalinux())
            .where(eq(repositorio_datalinux.id, idAssociation))
            .execute();

        return { success: true };
    }

    async updateTemplateOrder(
        idUser: number,
        idRepo: number,
        idAssociation: number,
        newOrder: number
    ) {
        // Validar permisos de escritura
        const validatePermiso = await PermisosValidate.validate("escribir", idUser, idRepo, true);
        if (!validatePermiso.escribir) {
            throw CustomError.unauthorized("No tienes permisos para modificar este repositorio");
        }

        const { repositorio_datalinux } = generateTables();

        // Verificar que la asociación pertenece al repositorio
        const association = await DB.Select([repositorio_datalinux.idrepositorio])
            .from(repositorio_datalinux())
            .where(eq(repositorio_datalinux.id, idAssociation))
            .execute();

        if (!association || association.length === 0) {
            throw CustomError.notFound("Asociación no encontrada");
        }

        if (association[0].idrepositorio !== idRepo) {
            throw CustomError.unauthorized("Esta asociación no pertenece al repositorio");
        }

        // Actualizar orden
        await DB.Update(repositorio_datalinux())
            .set({ orden: newOrder })
            .where(eq(repositorio_datalinux.id, idAssociation))
            .execute();

        return { success: true };
    }
}

