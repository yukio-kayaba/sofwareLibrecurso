import z from "zod";
import { Validator } from "../validators.js";

export const sessionMainUser = {
  usuario: z.string().trim().max(50).min(10),
  password: z
    .string()
    .min(5)
    .refine((contra) => Validator.isValidPassword(contra), {
      error: "Contra no permitida ",
    }),
  nombreCompleto: z.string(),
  dni: z.string(),
  rol: z.enum(["apoyo", "operativo", "administrador"]),
  diasTrabajo: z
    .string()
    .regex(
      /(administrador|operativo|apoyo)/,
      "El rol ingresado no es aceptado como valido"
    ),
};
