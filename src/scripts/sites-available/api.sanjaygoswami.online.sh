# Server Block for api.sanjaygoswami.online

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.sanjaygoswami.online;

    root /var/www/api.sanjaygoswami.online;

    index index.html index.htm index.nginx-debian.html;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;        
    }

    ssl_certificate /etc/letsencrypt/live/api.sanjaygoswami.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.sanjaygoswami.online/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/api.sanjaygoswami.online/chain.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
 
}
