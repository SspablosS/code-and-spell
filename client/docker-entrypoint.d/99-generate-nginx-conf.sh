#!/bin/sh
set -e

# После 20-envsubst-on-templates.sh — перезаписываем конфиг с DNS из resolv.conf
RESOLVER=$(awk '/^nameserver/ { print $2; exit }' /etc/resolv.conf)
BACKEND_HOST="${BACKEND_HOST:-code-and-spell.railway.internal}"
BACKEND_PORT="${BACKEND_PORT:-3001}"

if [ -z "$RESOLVER" ]; then
  echo "ERROR: no nameserver found in /etc/resolv.conf" >&2
  exit 1
fi

# IPv6-адрес nameserver в nginx указывают в квадратных скобках
case "$RESOLVER" in
  *:*)
    RESOLVER="[$RESOLVER]"
    ;;
esac

cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen 80;

    resolver ${RESOLVER} valid=30s;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        set \$backend_upstream http://${BACKEND_HOST}:${BACKEND_PORT};
        proxy_pass \$backend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
