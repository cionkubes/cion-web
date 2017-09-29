FROM joshix/caddy

COPY src/www /var/www/html
COPY src/Caddyfile var/www/html