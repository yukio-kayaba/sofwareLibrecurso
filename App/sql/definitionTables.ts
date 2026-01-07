import { bool, defineTable, int, money, timestamp, varchar } from "zormz";


export function generateTables(){
  return {
     usuarios : defineTable("usuarios", {
      idusuario:int().Pk().$(),
      nombrecompleto: varchar(150).$(),
      dni: varchar(9).$(),
      activo: bool().default(true).$(),
      correo:varchar(150).Required().$(),
      contra:varchar(150).Required().$(), 
    }),
    repositorios:defineTable("repositorios",{
      idrepo:int().Pk().$(),
      idcreador:int().Required().$(),
      nombrerepo:varchar(100).Default("repositorio1").$(),
      descripcion:varchar(200).$(),
      ipdata:varchar(100).Required().Default("192.168.124.2").$(),
      portdata:varchar(4).Required().$(),
      dominio:varchar(100).Required().$(),//unamad.org
      orgdata:varchar(100).Required().$(),
      contrarepo:varchar(150).Required().$(),
      estado:bool().default(true).$(),
      fechacreacion:timestamp().now().$()
    }),
     permisos : defineTable("permisos", {
      idpermiso: int().Pk().$(),
      idcolaborador:int().Required().$(),
      idrepositorio:int().Required().$(), 
      leer: bool().default(false).$(),
      escribir: bool().default(false).$(),
      ejecutar: bool().default(false).$(),
    }),
    datalinux:defineTable("datalinux",{
      iddatalinux:int().Pk().$(),
      nombredata:varchar(200).Required().$(),
      variables:varchar(300).Required().$(),
      contenido:varchar(1000).Required().$()
    }),

  }
}



