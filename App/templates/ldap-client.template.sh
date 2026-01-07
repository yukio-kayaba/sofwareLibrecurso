#!/bin/bash
# Template: Configuración de LDAP Client
# Variables requeridas: DOMAIN, IP, PORT, BASE_DN

set -e

# Instalar paquetes LDAP client
if ! command -v ldapsearch > /dev/null; then
    echo "Instalando paquetes LDAP client..."
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y ldap-utils libnss-ldap libpam-ldap
fi

# Configurar dominio LDAP
DOMAIN_LDAP=$(echo "${DOMAIN}" | sed 's/\./,dc=/g')
if [ -z "${BASE_DN}" ]; then
    BASE_DN="dc=${DOMAIN_LDAP}"
    if [ "${BASE_DN}" = "dc=" ]; then
        BASE_DN="dc=example,dc=org"
    fi
fi

# Configurar /etc/ldap/ldap.conf
cat > /etc/ldap/ldap.conf <<EOF
BASE ${BASE_DN}
URI ldap://${IP}:${PORT}
TLS_REQCERT allow
EOF

# Configurar NSS para usar LDAP
if ! grep -q "ldap" /etc/nsswitch.conf; then
    sed -i 's/passwd:.*/passwd:         files ldap/' /etc/nsswitch.conf
    sed -i 's/group:.*/group:          files ldap/' /etc/nsswitch.conf
    sed -i 's/shadow:.*/shadow:         files ldap/' /etc/nsswitch.conf
fi

# Configurar PAM para autenticación LDAP
if [ -f /etc/pam.d/common-auth ]; then
    if ! grep -q "pam_ldap.so" /etc/pam.d/common-auth; then
        echo "auth sufficient pam_ldap.so" >> /etc/pam.d/common-auth
    fi
fi

if [ -f /etc/pam.d/common-session ]; then
    if ! grep -q "pam_ldap.so" /etc/pam.d/common-session; then
        echo "session optional pam_ldap.so" >> /etc/pam.d/common-session
    fi
fi

echo "LDAP Client configurado para servidor: ldap://${IP}:${PORT}"
echo "Base DN: ${BASE_DN}"

