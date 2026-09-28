# Biorals – Hostinger Deployment & Production Architecture Guide

This guide details exact, verified procedures for deploying **Biorals** on Hostinger environments (Shared Hosting, Cloud Hosting, or KVM VPS) while pairing seamlessly with Firebase Authentication, Firestore, and Storage.

---

## 1. Hosting Plan Compatibility Matrix

| Hostinger Plan Type | Supported Runtime | Recommended Architecture |
| :--- | :--- | :--- |
| **Hostinger Shared / Premium / Business Web Hosting** | Static HTML / CSS / JS (`dist/` directory) | **Frontend on Hostinger + Firebase Cloud Backend**. Build locally or via GitHub Actions, deploy `dist/` directly to `public_html/`. |
| **Hostinger Cloud Startup / Cloud Professional** | Node.js / Static | Build with Node.js 20+; serve static SPA via Nginx or LiteSpeed. |
| **Hostinger KVM VPS (Ubuntu 22.04 / 24.04)** | Full Docker / Node.js 20+ / Nginx | **Dockerized Deployment** using the included `Dockerfile` and `docker-compose.yml`. |

---

## 2. Option A: Deployment on Hostinger Shared Hosting (hPanel)

Since Hostinger Shared Hosting plans use LiteSpeed without persistent background Node daemon processes, the recommended and fastest production architecture is deploying the compiled React single-page build to `public_html/` while connecting to Firebase as the managed serverless backend.

### Step 1: Build the Production Bundle
On your local machine or CI/CD runner:
```bash
npm install
npm run build
```
This generates the optimized production bundle inside the `/dist` directory.

### Step 2: Upload to Hostinger File Manager
1. Log into your **Hostinger hPanel**.
2. Navigate to **Websites** &rarr; Select your domain (`biorals.com`) &rarr; **File Manager**.
3. Open the `public_html/` folder.
4. Upload all files and folders located inside your local `dist/` folder (including `index.html`, `assets/`, `robots.txt`, etc.).

### Step 3: Configure `.htaccess` for SPA Client Routing
Ensure all routes (such as `/stores/hostinger`, `/coupons`, `/admin`) route smoothly to `index.html`. Create or edit `.htaccess` in `public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Browser Caching for Core Web Vitals
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

---

## 3. Option B: Deployment on Hostinger KVM VPS via Docker

For dedicated control, automated SSL with Let's Encrypt, and Docker isolation:

### Step 1: Connect to VPS
```bash
ssh root@your-vps-ip
```

### Step 2: Install Docker & Docker Compose
```bash
apt update && apt upgrade -y
apt install docker.io docker-compose git -y
systemctl enable --now docker
```

### Step 3: Clone & Launch Biorals
```bash
git clone https://github.com/your-org/biorals.git
cd biorals
docker-compose up -d --build
```
Your container will be running on port 80 behind the bundled high-performance Nginx web server.

---

## 4. Firebase Backend Configuration

1. In your [Firebase Console](https://console.firebase.google.com/):
   - Enable **Authentication** (Email/Password and Google sign-in).
   - Create a **Cloud Firestore** database.
   - Deploy `firestore.rules` using the Firebase CLI:
     ```bash
     firebase deploy --only firestore:rules,firestore:indexes,storage
     ```
2. In Hostinger or your frontend `.env`, configure:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project"
   VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   ```

---

## 5. Scaling to 1,000+ Merchants Ethically

1. Navigate to `/admin/import` in Biorals.
2. Select **Merchant Ingestion** &rarr; Upload `merchants.csv`.
3. Use legitimate public domains and authorized affiliate feeds (Impact, CJ, Rakuten).
4. Do not scrape competitor websites. Biorals automatically verifies records and checks for duplicate slugs and domain integrity before publishing.
