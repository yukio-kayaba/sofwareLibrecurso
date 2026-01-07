export interface User {
  idusuario: number
  nombrecompleto: string
  dni: string
  correo: string
  activo: boolean
}

export interface Repository {
  idrepo: number
  idcreador: number
  nombrerepo: string
  descripcion?: string
  ipdata: string
  portdata: string
  dominio: string
  orgdata: string
  contrarepo: string
  estado: boolean
  fechacreacion: string
}

export interface Permission {
  idpermiso: number
  idcolaborador: number
  idrepositorio: number
  leer: boolean
  escribir: boolean
  ejecutar: boolean
}

export interface JoinRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  repositoryId: string
  repositoryName: string
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: string
}

export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  size?: number
  modifiedAt: string
  parentId?: string
}

export interface UserPermissions {
  canRead: boolean
  canDownload: boolean
}

