interface Authpayload {
  idusuario: number;
  id?: number; // Para compatibilidad
  exp?: number;
  [key: string]: any;
}

declare namespace Express {
  export interface Request {
    authpayload?: Authpayload;
    tiempo?: number;
  }
}
