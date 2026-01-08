import z from "zod";
import { Validator } from "../validators.js";


export const repositorioSchema = {

    nombrerepo:z.string().trim().max(200),
    descripcion:z.string().trim().min(0).max(500).refine(val => !val || val.length === 0 || Validator.isValidDescription(val),{
        error:"No esta permitido caracteres especailes"
    }),
    dominio:z.string().trim().max(100),
    ipdata:z.string().trim().max(100).refine(val => Validator.isValidIp(val),{
        error:" IP invalido "
    }),
    orgdata:z.string().trim().max(20),
    portdata:z.string().trim().max(10).refine(val => Validator.isOnlyNumbers(val),{
        error:"El puerto solo contiene numeros "
    }),
    contrarepo:z.string().refine(val => Validator.isValidPassword(val))
}