import express from "express";
import { RouterPrincipal } from "./routes/index.route.js";
const APP = express();
const rutas = new RouterPrincipal();

APP.use(express.json());

// Configuración de CORS
APP.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
APP.use(rutas.router());

export default APP;
