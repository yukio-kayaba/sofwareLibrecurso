import z, { object } from "zod";
import { sessionMainUser } from "./sessionSchema.js";

const createSessionUser = z.object({
  usuario: sessionMainUser.usuario,
  password: sessionMainUser.password,
});

const createcount = z.object({
  correo: sessionMainUser.usuario,
  contra: sessionMainUser.password,
  nombrecompleto: sessionMainUser.nombreCompleto,
  dni: sessionMainUser.dni,
});

export const createSessionValidator = (object: unknown) =>
  createSessionUser.safeParse(object);

export const createCountUserValidator = (object: unknown) =>
  createcount.safeParse(object);
