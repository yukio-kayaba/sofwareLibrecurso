#!/bin/bash
# Template: Instalación y configuración de LDAP Server (OpenLDAP)
# Variables requeridas: DOMAIN, ORG, ADMIN_PW, IP, PORT

set -e

# Instalar OpenLDAP y herramientas
if ! command -v slapd > /dev/null; then
    echo "Instalando OpenLDAP server..."
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y slapd ldap-utils
fi

# Configurar dominio LDAP
DOMAIN_LDAP=$(echo "${DOMAIN}" | sed 's/\./,dc=/g')
BASE_DN="dc=${DOMAIN_LDAP}"

# Si el dominio no tiene formato correcto, usar orgdata
if [ -z "${BASE_DN}" ] || [ "${BASE_DN}" = "dc=" ]; then
    BASE_DN="dc=${ORG},dc=org"
fi

# Configurar slapd con valores por defecto
if [ ! -f /etc/ldap/slapd.d/cn=config.ldif ]; then
    echo "Configurando slapd..."
    debconf-set-selections <<EOF
slapd slapd/internal/generated_adminpw password ${ADMIN_PW}
slapd slapd/internal/adminpw password ${ADMIN_PW}
slapd slapd/password1 password ${ADMIN_PW}
slapd slapd/password2 password ${ADMIN_PW}
slapd slapd/domain string ${DOMAIN}
slapd shared/organization string ${ORG}
EOF
    dpkg-reconfigure -f noninteractive slapd
fi

# Configurar para escuchar en IP y puerto específicos
sed -i "s|SLAPD_SERVICES=.*|SLAPD_SERVICES=\"ldap://${IP}:${PORT}/ ldapi:///\"|g" /etc/default/slapd || true

# Crear archivo de configuración ldap.conf
cat > /etc/ldap/ldap.conf <<EOF
BASE ${BASE_DN}
URI ldap://${IP}:${PORT}
EOF

# Reiniciar servicio
systemctl restart slapd
systemctl enable slapd

# Verificar que el servicio está corriendo
if systemctl is-active --quiet slapd; then
    echo "LDAP Server configurado y corriendo en ldap://${IP}:${PORT}"
    echo "Base DN: ${BASE_DN}"
else
    echo "Error: LDAP Server no está corriendo"
    exit 1
fi

