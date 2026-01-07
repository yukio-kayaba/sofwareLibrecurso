interface Authpayload {
  id: number;
  exp?: number;
  [key: string]: any;
}

declare namespace Express {
  export interface Request {
    authpayload?: Authpayload;
    tiempo?: number;
  }
}
