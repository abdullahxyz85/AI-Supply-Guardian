# cPanel Deployment Guide - AI Supply Guardian

## 📋 Prerequisites Checklist

Before deploying to cPanel, ensure you have:

- [ ] cPanel account with SSH access
- [ ] Docker installed on server (contact host if not available)
- [ ] Domain or subdomain configured
- [ ] SSL certificate (Let's Encrypt recommended)
- [ ] Google OAuth credentials
- [ ] Supabase project set up

---

## 🔧 Step-by-Step cPanel Deployment

### Step 1: Enable Docker on cPanel

**Option A: If you have root/WHM access:**

```bash
sudo yum install docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

**Option B: Contact your hosting provider to enable Docker**

Many cPanel hosts (like A2 Hosting, InMotion, SiteGround) support Docker. Request activation if not available.

---

### Step 2: Upload Your Application

#### **Method 1: Using Git (Recommended)**

```bash
# SSH into your server
ssh username@your-server.com

# Navigate to domain directory
cd ~/domains/your-domain.com/public_html

# Clone repository
git clone https://github.com/abdullahxyz85/AI-Supply-Guardian.git
cd AI-Supply-Guardian
```

#### **Method 2: Using cPanel File Manager**

1. Log in to cPanel
2. Go to **File Manager**
3. Navigate to `public_html/your-domain.com`
4. Upload project as ZIP
5. Extract the ZIP file

---

### Step 3: Configure Environment Variables

```bash
cd AI-Supply-Guardian/backend
nano .env
```

Add your credentials:

```env
GOOGLE_CLIENT_ID=299812517712-199pffnn667udc0eq9830ms313q97o16.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_secret
GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/google/callback
FRONTEND_URL=https://your-domain.com
ENCRYPTION_KEY=generate_32_character_random_string
SUPABASE_URL=https://hyqzhelojtyrddotvrne.supabase.co
SUPABASE_ANON_KEY=your_supabase_key
N8N_WEBHOOK_KEY=your_webhook_key
```

**Generate encryption key:**

```bash
openssl rand -base64 32
```

---

### Step 4: Build and Deploy Docker Containers

```bash
# Make sure you're in project root
cd ~/domains/your-domain.com/public_html/AI-Supply-Guardian

# Build and start containers
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

---

### Step 5: Configure Apache/cPanel

#### **A. Create Subdomain (if needed)**

1. Log in to cPanel
2. Go to **Domains** → **Subdomains**
3. Create subdomain: `app.your-domain.com`
4. Set document root: `/public_html/app.your-domain.com`

#### **B. Build Frontend**

```bash
# In project root
npm install
npm run build

# Copy built files to document root
cp -r dist/* ~/domains/your-domain.com/public_html/
cp .htaccess ~/domains/your-domain.com/public_html/
```

#### **C. Configure .htaccess**

The `.htaccess` file should already be in place. Verify it contains:

```apache
RewriteEngine On
RewriteBase /

# Proxy API requests to Docker backend
RewriteCond %{REQUEST_URI} ^/api/ [NC]
RewriteRule ^api/(.*)$ http://localhost:8050/api/$1 [P,L]

# React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^ index.html [L]
```

---

### Step 6: Enable Required Apache Modules

**Contact your hosting provider to enable these modules:**

- `mod_proxy`
- `mod_proxy_http`
- `mod_rewrite`
- `mod_headers`

**Or if you have WHM access:**

```bash
/scripts/install_module proxy
/scripts/install_module proxy_http
/scripts/rebuild_httpdconf
service httpd restart
```

---

### Step 7: Configure SSL Certificate

#### **Using Let's Encrypt (Free):**

1. Log in to cPanel
2. Go to **Security** → **SSL/TLS Status**
3. Select your domain
4. Click **Run AutoSSL**

#### **Or use cPanel's Let's Encrypt app:**

1. Go to **Security** → **Let's Encrypt SSL**
2. Select domain
3. Click **Issue**

---

### Step 8: Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client
4. Add authorized redirect URI:
   ```
   https://your-domain.com/api/auth/google/callback
   ```

---

### Step 9: Configure Firewall (Optional but Recommended)

**If you have root access:**

```bash
# Allow only necessary ports
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-service=ssh
firewall-cmd --reload
```

**Or use cPanel's IP Blocker:**

1. Go to **Security** → **IP Blocker**
2. Configure allowed/blocked IPs

---

## 🔍 Verification Steps

### 1. **Test Backend API**

```bash
curl http://localhost:8050/health
# Should return: {"status":"healthy"}
```

### 2. **Test Frontend**

```bash
curl http://localhost:3032/
# Should return HTML content
```

### 3. **Test via Domain**

```bash
curl https://your-domain.com/
curl https://your-domain.com/api/health
```

### 4. **Test Google OAuth**

1. Open browser: `https://your-domain.com`
2. Click "Sign in with Google"
3. Should redirect to Google
4. After auth, should redirect back to app

---

## 🚨 Common Issues & Solutions

### **Issue 1: "Cannot connect to Docker daemon"**

**Solution:**

```bash
# Start Docker service
sudo systemctl start docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### **Issue 2: "Port 8050 already in use"**

**Solution:**

```bash
# Find process using port
lsof -i :8050

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### **Issue 3: "502 Bad Gateway" when accessing /api/**

**Solution:**

```bash
# Check if backend is running
docker ps | grep backend

# Check backend logs
docker-compose logs backend

# Verify Apache proxy modules are enabled
apachectl -M | grep proxy
```

### **Issue 4: React Router 404 errors**

**Solution:**

Verify `.htaccess` contains React Router rules:

```apache
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

### **Issue 5: CORS errors**

**Solution:**

Add to `backend/auth_backend.py`:

```python
origins = [
    "https://your-domain.com",
    "https://www.your-domain.com",
    "http://localhost:3032",
]
```

---

## 📊 Monitoring & Maintenance

### **Check Container Status**

```bash
docker-compose ps
docker stats
```

### **View Logs**

```bash
# All containers
docker-compose logs -f

# Specific container
docker-compose logs -f backend
docker-compose logs -f frontend

# Save logs to file
docker-compose logs > logs-$(date +%Y%m%d).txt
```

### **Restart Containers**

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### **Update Application**

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

---

## 🔐 Security Best Practices

1. **Keep .env secure:**

   ```bash
   chmod 600 backend/.env
   ```

2. **Use HTTPS only:**

   - Force HTTPS in .htaccess (already configured)
   - Disable HTTP in production

3. **Regular updates:**

   ```bash
   docker-compose pull
   docker-compose up -d
   ```

4. **Backup regularly:**

   ```bash
   # Backup .env and configs
   tar -czf backup-$(date +%Y%m%d).tar.gz backend/.env docker-compose.yml
   ```

5. **Monitor logs for suspicious activity:**
   ```bash
   docker-compose logs | grep ERROR
   ```

---

## 📞 Getting Help

### **Check cPanel Documentation:**

- [cPanel Docker Guide](https://docs.cpanel.net/knowledge-base/docker/)

### **Contact Hosting Provider for:**

- Docker installation
- Apache module activation
- Firewall configuration
- SSL certificate issues

### **Test Endpoints:**

```bash
# Backend health
curl -v http://localhost:8050/health

# Frontend
curl -v http://localhost:3032/

# API proxy
curl -v https://your-domain.com/api/health
```

---

## ✅ Post-Deployment Checklist

- [ ] Docker containers running (green status)
- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Google OAuth login works
- [ ] SSL certificate active
- [ ] API proxy working (/api/ routes)
- [ ] React Router working (no 404s)
- [ ] Supabase connection successful
- [ ] Environment variables correct
- [ ] Logs show no errors

---

## 🎯 Performance Optimization

### **1. Enable Caching**

Add to `.htaccess`:

```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</IfModule>
```

### **2. Enable Compression**

Already configured in `.htaccess`:

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

### **3. CDN Integration (Optional)**

Use Cloudflare or similar CDN:

1. Point DNS to Cloudflare
2. Enable caching rules
3. Enable minification

---

## 🚀 Your app is now live!

- **Frontend**: `https://your-domain.com`
- **Backend API**: `https://your-domain.com/api/`
- **Google OAuth**: Should work seamlessly

Test all features and monitor logs for any issues.
