import z from "zod";
import { Validator } from "../validators.js";


export const repositorioSchema = {

    nombrerepo:z.string().trim().max(200),
    descripcion:z.string().trim().min(200).refine(val => Validator.isValidDescription(val),{
        error:"No esta permitido caracteres especailes"
    }),
    dominio:z.string().trim().max(100).refine( val => Validator.isValidFullName(val),{
        error:" Para el dominio no esta permitido caracteres especiales"
    }),
    ipdata:z.string().trim().max(100).refine(val => Validator.isValidIp(val),{
        error:" IP invalido "
    }),
    orgdata:z.string().trim().max(20).refine(val => Validator.isValidGeneralName(val),{
        error:"Org no puede contener caracteres especiales"
    }),
    portdata:z.string().trim().max(10).refine(val => Validator.isOnlyNumbers(val),{
        error:"El puerto solo contiene numeros "
    }),
    contrarepo:z.string().refine(val => Validator.isValidPassword(val))
}