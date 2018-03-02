FROM joshix/caddy

COPY lib /var/www/html
COPY etc/Caddyfile /var/www/html