#!/bin/bash
# Template: Configuración de iptables (Firewall)
# Variables requeridas: IP, PORT, DOMAIN

# Limpiar reglas existentes
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X

# Política por defecto: DENEGAR TODO
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Permitir loopback
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Permitir conexiones establecidas y relacionadas
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Permitir SSH (puerto 22)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Permitir LDAP (puerto ${PORT})
iptables -A INPUT -p tcp --dport ${PORT} -j ACCEPT
iptables -A INPUT -p udp --dport ${PORT} -j ACCEPT

# Permitir HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Permitir DNS
iptables -A INPUT -p udp --dport 53 -j ACCEPT
iptables -A INPUT -p tcp --dport 53 -j ACCEPT

# Guardar reglas
if command -v iptables-save > /dev/null; then
    iptables-save > /etc/iptables/rules.v4
    echo "Reglas de iptables guardadas"
fi

echo "Configuración de iptables completada"

