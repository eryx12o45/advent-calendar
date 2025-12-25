# 🚀 Deployment Guide - Nginx Reverse Proxy

Diese Anleitung erklärt, wie Sie den Adventskalender auf einem Server mit Nginx als Reverse Proxy deployen.

## ⚠️ Wichtig: Vollständiges Deployment

Sie müssen **nicht nur** den `public/` Ordner kopieren, sondern den **kompletten Node.js Server** deployen.

## 📦 Benötigte Dateien auf dem Server

```
advent/
├── server.js           # ← WICHTIG! Backend-Server
├── package.json        # ← Node.js Dependencies
├── package-lock.json   # ← Lock-Datei
├── .env                # ← Passwort-Konfiguration
└── public/             # ← Frontend-Dateien
    ├── index.html
    ├── styles.css
    ├── script.js
    └── audio/          # ← Ihre Audio-Dateien
```

## 🔧 Setup Schritte

### 1. Dateien auf Server kopieren

```bash
# Auf Ihrem lokalen Rechner
scp -r server.js package.json package-lock.json .env public/ user@your-server:/path/to/advent/
```

**ODER** mit rsync (empfohlen):
```bash
rsync -avz --exclude 'node_modules' \
  server.js package.json package-lock.json .env public/ \
  user@your-server:/path/to/advent/
```

### 2. Node.js Dependencies installieren

```bash
# Auf dem Server
cd /path/to/advent
npm install --production
```

### 3. .env Datei konfigurieren

Bearbeiten Sie die `.env` Datei auf dem Server:

```bash
nano .env
```

```env
# Adventskalender Konfiguration
ADVENT_PASSWORD="IhrSicheresPasswort"
PORT=3000
```

### 4. Node.js Server starten

#### Option A: Mit PM2 (empfohlen für Produktion)

```bash
# PM2 installieren (falls nicht vorhanden)
npm install -g pm2

# Server starten
pm2 start server.js --name "advent-calendar"

# Server beim System-Start automatisch starten
pm2 startup
pm2 save
```

**Nützliche PM2 Befehle:**
```bash
pm2 status              # Status anzeigen
pm2 logs advent-calendar # Logs anschauen
pm2 restart advent-calendar # Neu starten
pm2 stop advent-calendar    # Stoppen
pm2 delete advent-calendar  # Löschen
```

#### Option B: Mit systemd Service

Erstellen Sie eine Service-Datei:

```bash
sudo nano /etc/systemd/system/advent-calendar.service
```

Inhalt:
```ini
[Unit]
Description=Advent Calendar Node.js App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/advent
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Service aktivieren und starten:
```bash
sudo systemctl daemon-reload
sudo systemctl enable advent-calendar
sudo systemctl start advent-calendar
sudo systemctl status advent-calendar
```

#### Option C: Mit nohup (einfach, aber nicht ideal)

```bash
nohup node server.js > advent.log 2>&1 &
```

### 5. Nginx Reverse Proxy konfigurieren

Erstellen Sie eine Nginx-Konfiguration:

```bash
sudo nano /etc/nginx/sites-available/advent-calendar
```

**Konfiguration:**

```nginx
server {
    listen 80;
    server_name advent.example.com;  # Ihre Domain

    # Logging
    access_log /var/log/nginx/advent-access.log;
    error_log /var/log/nginx/advent-error.log;

    # Reverse Proxy zum Node.js Server
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Optional: Static files direkt von Nginx ausliefern (Performance)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        root /path/to/advent/public;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Audio-Dateien mit längeren Timeouts
    location /audio/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_buffering off;
        client_max_body_size 50M;
    }
}
```

Site aktivieren:
```bash
sudo ln -s /etc/nginx/sites-available/advent-calendar /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL mit Let's Encrypt (empfohlen)

```bash
# Certbot installieren
sudo apt install certbot python3-certbot-nginx

# SSL-Zertifikat erstellen
sudo certbot --nginx -d advent.example.com

# Auto-Renewal testen
sudo certbot renew --dry-run
```

## 🔍 Troubleshooting

### Problem: API nicht erreichbar

**Ursache:** Nur `public/` Ordner kopiert, `server.js` fehlt.

**Lösung:**
```bash
# Prüfen ob server.js vorhanden ist
ls -la /path/to/advent/server.js

# Prüfen ob Node.js läuft
pm2 status
# oder
sudo systemctl status advent-calendar

# Logs prüfen
pm2 logs advent-calendar
# oder
sudo journalctl -u advent-calendar -f
```

### Problem: 502 Bad Gateway

**Ursache:** Node.js Server läuft nicht oder falscher Port.

**Lösung:**
```bash
# Server-Status prüfen
pm2 status

# Port prüfen
netstat -tulpn | grep :3000
# oder
lsof -i :3000

# Server neu starten
pm2 restart advent-calendar
```

### Problem: Passwort-Login funktioniert nicht

**Ursache:** .env Datei fehlt oder falsche Umgebungsvariablen.

**Lösung:**
```bash
# .env Datei prüfen
cat /path/to/advent/.env

# Sicherstellen dass .env geladen wird
pm2 restart advent-calendar --update-env
```

### Problem: Audio-Dateien werden nicht geladen

**Ursache:** Audio-Ordner fehlt oder Berechtigungen falsch.

**Lösung:**
```bash
# Audio-Ordner erstellen
mkdir -p /path/to/advent/public/audio

# Berechtigungen setzen
sudo chown -R www-data:www-data /path/to/advent/public/audio
sudo chmod -R 755 /path/to/advent/public/audio

# Audio-Dateien kopieren
cp /local/path/*.mp3 /path/to/advent/public/audio/
```

## 📊 Monitoring

### Server-Status überwachen

```bash
# Mit PM2
pm2 monit

# Logs anschauen
tail -f /var/log/nginx/advent-access.log
pm2 logs advent-calendar --lines 100
```

### Performance testen

```bash
# Response-Zeit testen
curl -w "@-" -o /dev/null -s http://localhost:3000 <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
   time_pretransfer:  %{time_pretransfer}\n
      time_redirect:  %{time_redirect}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

## 🔒 Sicherheits-Checkliste

- [ ] `.env` Datei hat eingeschränkte Berechtigungen: `chmod 600 .env`
- [ ] Node.js läuft nicht als root (z.B. als `www-data`)
- [ ] SSL/HTTPS ist aktiviert
- [ ] Firewall lässt nur Port 80/443 durch (nicht Port 3000!)
- [ ] Nginx security headers sind gesetzt
- [ ] Regelmäßige Updates: `npm audit` und `apt update`

## 📝 Nginx Security Headers (Optional)

Fügen Sie in Ihrer Nginx-Config hinzu:

```nginx
# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

## 🔄 Updates deployen

```bash
# Neue Version auf Server kopieren
rsync -avz --exclude 'node_modules' \
  server.js package.json public/ \
  user@your-server:/path/to/advent/

# Auf dem Server
cd /path/to/advent
npm install --production
pm2 restart advent-calendar
```

## ✅ Deployment Checkliste

- [ ] Alle Dateien kopiert (server.js, package.json, .env, public/)
- [ ] Dependencies installiert (`npm install --production`)
- [ ] .env Datei mit Passwort konfiguriert
- [ ] Node.js Server läuft (PM2 oder systemd)
- [ ] Port 3000 ist intern erreichbar
- [ ] Nginx Reverse Proxy konfiguriert
- [ ] SSL-Zertifikat installiert (optional aber empfohlen)
- [ ] Audio-Dateien hochgeladen
- [ ] Funktionstest durchgeführt

## 📞 Support

Bei Problemen:
1. Logs prüfen: `pm2 logs advent-calendar`
2. Nginx Logs: `tail -f /var/log/nginx/advent-error.log`
3. Server-Status: `pm2 status` oder `systemctl status advent-calendar`
