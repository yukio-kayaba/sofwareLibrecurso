#!/bin/bash
# Template: Configuración base del sistema
# Variables requeridas: DOMAIN, ORG

set -e

# Actualizar sistema
echo "Actualizando sistema..."
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y

# Instalar herramientas básicas
apt-get install -y curl wget git vim net-tools

# Configurar hostname si se proporciona
if [ ! -z "${HOSTNAME}" ]; then
    hostnamectl set-hostname "${HOSTNAME}"
    echo "${HOSTNAME}" > /etc/hostname
fi

# Configurar zona horaria (opcional)
if [ ! -z "${TIMEZONE}" ]; then
    timedatectl set-timezone "${TIMEZONE}"
fi

echo "Configuración base completada"

