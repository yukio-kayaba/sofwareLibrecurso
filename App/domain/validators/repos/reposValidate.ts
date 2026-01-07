import z from "zod";
import { repositorioSchema } from "./repositorioSchema.js";


const repositoriosValidate = z.object({
    nombrerepo:repositorioSchema.nombrerepo,
    descripcion:repositorioSchema.descripcion,
    ipdata:repositorioSchema.ipdata,
    portdata:repositorioSchema.portdata,
    dominio:repositorioSchema.dominio,
    orgdata:repositorioSchema.orgdata,
    contrarepo:repositorioSchema.contrarepo 
})

export const createRepositorioValidator = (object:unknown)=>
    repositoriosValidate.safeParse(object);
