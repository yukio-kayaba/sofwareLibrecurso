export type usersType = "apoyo" | "operativo" | "administrador";

export type daysType  = 'lunes' | 'martes' | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";

export interface insertUser{
    correo:string,
    contra:string,
    nombrecompleto:string,
    dni:string,
    diastrabajo?: daysType[]
}

export interface permisoResponse{
    idpermiso:number,
    nombre:string
}