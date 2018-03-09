FROM joshix/caddy

COPY lib /var/www/html
COPY etc/Caddyfile /etc/caddy/Caddyfile

CMD ["-conf", "/etc/caddy/Caddyfile"]