import { initBD } from "../core/config/conexion.js";
import { generateTables } from "../sql/definitionTables.js";
import { DB } from "zormz";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

initBD();

const templates = [
    {
        nombredata: "Configuración Base del Sistema",
        variables: "DOMAIN,ORG,HOSTNAME,TIMEZONE",
        contenido: readFileSync(join(__dirname, "../templates/base-setup.template.sh"), "utf-8")
    },
    {
        nombredata: "Configuración de Red Estática",
        variables: "IP,MASK,GATEWAY,DNS1,DNS2,INTERFACE",
        contenido: readFileSync(join(__dirname, "../templates/static-network.template.sh"), "utf-8")
    },
    {
        nombredata: "Configuración de iptables (Firewall)",
        variables: "IP,PORT,DOMAIN",
        contenido: readFileSync(join(__dirname, "../templates/iptables.template.sh"), "utf-8")
    },
    {
        nombredata: "Instalación y Configuración LDAP Server",
        variables: "DOMAIN,ORG,ADMIN_PW,IP,PORT",
        contenido: readFileSync(join(__dirname, "../templates/ldap-server.template.sh"), "utf-8")
    },
    {
        nombredata: "Configuración LDAP Client",
        variables: "DOMAIN,IP,PORT,BASE_DN",
        contenido: readFileSync(join(__dirname, "../templates/ldap-client.template.sh"), "utf-8")
    }
];

async function initTemplates() {
    const { datalinux } = generateTables();

    console.log("Inicializando templates predefinidos...");

    for (const template of templates) {
        try {
            await DB.Insert(datalinux(), [
                datalinux.nombredata,
                datalinux.variables,
                datalinux.contenido
            ]).Values([
                template.nombredata,
                template.variables,
                template.contenido
            ]).execute();

            console.log(`✓ Template "${template.nombredata}" insertado`);
        } catch (error: any) {
            // Si el template ya existe, lo ignoramos
            if (error.message?.includes("UNIQUE") || error.message?.includes("duplicate") || error.message?.includes("already exists")) {
                console.log(`- Template "${template.nombredata}" ya existe, omitiendo...`);
            } else {
                console.error(`✗ Error al insertar "${template.nombredata}":`, error.message);
            }
        }
    }

    console.log("\n✓ Inicialización de templates completada");
}

initTemplates()
    .then(() => {
        console.log("Proceso completado");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });

