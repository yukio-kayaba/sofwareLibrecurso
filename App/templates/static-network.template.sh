#!/bin/bash
# Template: Configuración de red estática
# Variables requeridas: IP, MASK, GATEWAY, DNS1, DNS2, INTERFACE

# Detectar interfaz de red principal si no se especifica
if [ -z "${INTERFACE}" ]; then
    INTERFACE=$(ip route | grep default | awk '{print $5}' | head -n1)
    if [ -z "${INTERFACE}" ]; then
        INTERFACE="eth0"
    fi
fi

# Backup de configuración actual
if [ -f "/etc/netplan/01-netcfg.yaml" ]; then
    cp /etc/netplan/01-netcfg.yaml /etc/netplan/01-netcfg.yaml.backup.$(date +%Y%m%d_%H%M%S)
fi

# Crear configuración de red estática para Netplan (Ubuntu/Debian moderno)
cat > /etc/netplan/01-static-network.yaml <<EOF
network:
  version: 2
  renderer: networkd
  ethernets:
    ${INTERFACE}:
      dhcp4: false
      addresses:
        - ${IP}/${MASK}
      routes:
        - to: default
          via: ${GATEWAY}
      nameservers:
        addresses:
          - ${DNS1}
          - ${DNS2}
EOF

# Aplicar configuración
netplan apply

echo "Configuración de red estática aplicada para ${INTERFACE}: ${IP}/${MASK}"

