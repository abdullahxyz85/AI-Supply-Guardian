# AI Supply Guardian - Docker Deployment Instructions

## 📦 Deployment to cPanel Server

### Prerequisites

- cPanel account with SSH access
- Docker and Docker Compose installed on server
- Domain/subdomain configured in cPanel
- SSL certificate (recommended)

---

## 🚀 Deployment Steps

### 1. **Prepare Your Server**

```bash
# SSH into your cPanel server
ssh username@your-server.com

# Navigate to your domain's public_html directory
cd ~/public_html/your-domain

# Clone or upload your repository
git clone https://github.com/abdullahxyz85/AI-Supply-Guardian.git
cd AI-Supply-Guardian
```

### 2. **Configure Environment Variables**

Create `.env` file in the backend directory:

```bash
cd backend
nano .env
```

Add these variables:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/google/callback
FRONTEND_URL=https://your-domain.com
ENCRYPTION_KEY=your_32_character_encryption_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
N8N_WEBHOOK_KEY=your_n8n_webhook_key
```

### 3. **Build and Start Docker Containers**

```bash
# Return to project root
cd ..

# Build and start containers
docker-compose up -d --build

# Check container status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. **Configure cPanel**

#### **A. Enable Proxy in Apache**

In cPanel Terminal or SSH:

```bash
# Enable required Apache modules (if you have root access)
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo service httpd restart
```

If you don't have root access, contact your hosting provider to enable:

- `mod_proxy`
- `mod_proxy_http`
- `mod_rewrite`
- `mod_headers`

#### **B. Update .htaccess**

The `.htaccess` file has been created with the correct configuration. Just update the proxy URL if needed:

```apache
# In .htaccess, line 12-13:
RewriteCond %{REQUEST_URI} ^/api/ [NC]
RewriteRule ^api/(.*)$ http://localhost:8055/api/$1 [P,L]
```

#### **C. Set Up Domain in cPanel**

1. Go to **cPanel → Domains**
2. Click **Create a New Domain** or use existing domain
3. Set **Document Root** to: `/public_html/your-domain/AI-Supply-Guardian/dist`
4. Enable **SSL/TLS** (Let's Encrypt is free)

### 5. **Build Frontend for Production**

```bash
# Build the frontend
npm install
npm run build

# Copy built files to document root (if needed)
cp -r dist/* ~/public_html/your-domain/
cp .htaccess ~/public_html/your-domain/
```

---

## 🔧 Docker Commands Reference

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Rebuild containers
docker-compose up -d --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart specific service
docker-compose restart backend

# Check container health
docker-compose ps
docker inspect ai-supply-guardian-backend

# Execute commands in container
docker-compose exec backend bash
docker-compose exec frontend sh

# Remove all containers and volumes
docker-compose down -v
```

---

## 🌐 URL Structure After Deployment

- **Frontend**: `https://your-domain.com`
- **Backend API**: `https://your-domain.com/api/`
- **Auth Callback**: `https://your-domain.com/api/auth/google/callback`
- **Health Check (Backend)**: `http://localhost:8055/health`
- **Health Check (Frontend)**: `http://localhost:3035/health`

---

## 🔐 Security Checklist

- [ ] Enable HTTPS/SSL certificate
- [ ] Update CORS settings in backend
- [ ] Secure `.env` file (chmod 600)
- [ ] Enable firewall rules (only allow 80, 443, 22)
- [ ] Set up automatic backups
- [ ] Configure rate limiting
- [ ] Enable Fail2Ban (if available)
- [ ] Use strong passwords for all services
- [ ] Regularly update Docker images

---

## 🐛 Troubleshooting

### Backend Not Accessible

```bash
# Check if backend is running
docker ps | grep backend

# Check backend logs
docker-compose logs backend

# Test backend directly
curl http://localhost:8055/health
```

### Frontend Not Loading

```bash
# Check nginx logs
docker-compose logs frontend

# Verify nginx config
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf

# Test frontend directly
curl http://localhost:3035
```

### API Proxy Not Working

```bash
# Check Apache modules
apachectl -M | grep proxy

# Check .htaccess syntax
apachectl configtest

# View Apache error logs
tail -f /var/log/httpd/error_log
```

### Permission Issues

```bash
# Fix file permissions
chmod -R 755 ~/public_html/your-domain
chown -R username:username ~/public_html/your-domain

# Fix .env permissions
chmod 600 backend/.env
```

---

## 📊 Monitoring

### Check Container Resource Usage

```bash
docker stats

# Or specific container
docker stats ai-supply-guardian-backend
```

### View Container Logs

```bash
# Real-time logs
docker-compose logs -f --tail=100

# Save logs to file
docker-compose logs > app-logs.txt
```

---

## 🔄 Updates and Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild containers
docker-compose down
docker-compose up -d --build

# Or use rolling update (no downtime)
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend
```

### Backup Database

```bash
# Backup Supabase (handled by Supabase)
# Just backup your .env file and custom migrations
tar -czf backup-$(date +%Y%m%d).tar.gz backend/.env supabase/
```

---

## 📞 Support

If you encounter issues:

1. Check container logs: `docker-compose logs`
2. Verify environment variables: `cat backend/.env`
3. Test endpoints: `curl http://localhost:8055/health`
4. Contact hosting provider for Apache/proxy issues

---

## 🎯 Production Optimization

### Enable Redis Caching (Optional)

Add to `docker-compose.yml`:

```yaml
redis:
  image: redis:alpine
  container_name: ai-supply-redis
  restart: unless-stopped
  ports:
    - "6379:6379"
  networks:
    - ai-supply-network
```

### Add Nginx as Reverse Proxy (Optional)

For better performance, add nginx as main reverse proxy in front of both services.

---

## ✅ Deployment Complete!

Your AI Supply Guardian application should now be accessible at:

- **https://your-domain.com** (Frontend)
- **https://your-domain.com/api/** (Backend API)

Test the Google OAuth flow and verify all features are working correctly.
