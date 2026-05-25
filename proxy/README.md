# Portfolio AI Proxy

Express server that proxies chat requests to Gemini 1.5 Flash, serving an AI assistant embedded in Nelson's portfolio.

## VPS Setup (run once after first git pull)

```bash
cd /var/www/html/portfolio-dam/proxy
npm install
cp .env.example .env
nano .env              # paste your real Gemini API key here
npm install -g pm2
pm2 start server.js --name portfolio-proxy
pm2 save
pm2 startup
```

## Apache virtual host config

Add these lines to your Apache site config:

```
ProxyPass /api/ http://localhost:3001/api/
ProxyPassReverse /api/ http://localhost:3001/api/
```

Enable required Apache modules:

```bash
a2enmod proxy
a2enmod proxy_http
systemctl restart apache2
```

## Updating Nelson's info

1. Edit `proxy/nelson-info.json` locally
2. `git push`
3. `git pull` on VPS
4. `pm2 restart portfolio-proxy`
