# 🎄 Adventskalender

Ein wunderschön gestalteter, interaktiver Adventskalender mit 24 Türchen und **Multi-Jahr-Support**. Erlebe jeden Advent mit einem neuen, einzigartigen Design! Hinter jedem Türchen verbirgt sich ein Audio-Player für festliche Überraschungen.

## ✨ Features

### 🎨 Multi-Jahr-Theming-System
- **Jahresauswahl** - Diskreter Dropdown in der oberen rechten Ecke zur Auswahl verschiedener Jahre
- **Einzigartige Designs pro Jahr** - Jedes Jahr hat sein eigenes festliches Thema:
  - **2025**: Klassisches Winterthema mit Schneeflocken ❄️ und violetten Türchen
  - **2026**: Geschenk-Thema mit fallenden Paketen 🎁 und blauen Türchen
  - **2027**: Glocken-Thema mit Kerzen 🔔 und roten Türchen
  - **2028**: Santa-Thema mit Weihnachtsmann 🎅 und grünen Türchen
  - **2029**: Lebkuchen-Thema mit Keksen 🍪 und braunen Türchen
  - **2030**: Sternen-Thema mit Funkeln ✨ und blauen Türchen
- **Jahr-spezifische Elemente**:
  - Unterschiedliche Hintergrundfarben und Verläufe
  - Individuelle fallende Elemente (Schneeflocken, Geschenke, Glocken, etc.)
  - Unique Türchen-Farben und Icons für jedes Jahr

### 🎯 Intelligente Türchen-Freischaltung
- **24 animierte Türchen** - Jedes Türchen ist individuell nummeriert (1-24)
- **Jahr-basierte Logik**:
  - **Zukünftige Jahre**: Alle Türchen bleiben verschlossen bis das Jahr erreicht ist
  - **Aktuelles Jahr**: Türchen öffnen sich progressiv während des Dezembers
  - **Vergangene Jahre**: Alle Türchen bleiben permanent geöffnet - perfekt zum Nacherleben!
- **Visuelle Unterscheidung**:
  - 🔒 **Verschlossene Türchen**: Graue Farbe mit Schloss-Symbol
  - ✨ **Geöffnete Türchen**: Jahr-spezifische Farben mit einzigartigen Icons und Leuchteffekt
- **Audio-Player Overlay** - Beim Klick auf ein geöffnetes Türchen erscheint ein elegantes Modal mit Audio-Player
- **Passwort-Schutz** - Schützt den Kalender vor unbefugtem Zugriff
- **Responsive Design** - Funktioniert perfekt auf Desktop, Tablet und Smartphone
- **Persistenz** - Ausgewähltes Jahr wird gespeichert und beim nächsten Besuch wiederhergestellt

## 🚀 Installation & Nutzung

### Option 1: Mit Docker (Empfohlen)

1. **Projekt klonen oder herunterladen**
   ```bash
   git clone <repository-url>
   cd advent
   ```

2. **Audio-Dateien organisieren**
   - Erstellen Sie Jahresordner im `audio/` Verzeichnis (z.B. `2025/`, `2026/`)
   - Fügen Sie in jeden Jahresordner 24 MP3-Dateien hinzu:
     - `day1.mp3`, `day2.mp3`, ..., `day24.mp3`
   - Beispielstruktur:
     ```
     audio/
     ├── 2025/
     │   ├── day1.mp3
     │   ├── day2.mp3
     │   └── ... (bis day24.mp3)
     └── 2026/
         ├── day1.mp3
         └── ...
     ```

3. **Docker Container starten**
   ```bash
   docker-compose up -d
   ```

4. **Kalender im Browser öffnen**
   - Öffnen Sie: http://localhost:8088

5. **Container stoppen**
   ```bash
   docker-compose down
   ```

### Option 2: Ohne Docker

1. **Projekt klonen oder herunterladen**
   ```bash
   git clone <repository-url>
   cd advent
   ```

2. **Audio-Dateien organisieren**
   - Erstellen Sie Jahresordner im `public/audio/` Verzeichnis (z.B. `2025/`, `2026/`)
   - Fügen Sie in jeden Jahresordner 24 MP3-Dateien hinzu:
     - `day1.mp3`, `day2.mp3`, ..., `day24.mp3`

3. **Kalender öffnen**
   - Öffnen Sie die `index.html` Datei direkt in Ihrem Webbrowser
   - Oder verwenden Sie einen lokalen Webserver wie `python -m http.server 8088`

## 📁 Projektstruktur

```
advent/
├── server.js           # Node.js Express Server
├── package.json        # Node.js Dependencies
├── Dockerfile          # Docker-Konfiguration
├── docker-compose.yml  # Docker Compose Setup
├── .env                # Umgebungsvariablen (Passwort)
├── audio/              # Ordner für Audio-Dateien (Jahre-basiert)
│   ├── 2025/           # Audio-Dateien für 2025
│   │   ├── day1.mp3
│   │   ├── day2.mp3
│   │   └── ...         # day3.mp3 bis day24.mp3
│   ├── 2026/           # Audio-Dateien für 2026
│   │   └── ...
│   └── ...             # Weitere Jahre
├── public/             # Öffentliche Web-Dateien
│   ├── index.html      # Hauptseite mit HTML-Struktur
│   ├── styles.css      # Alle Styles und Jahr-Themes
│   ├── script.js       # Logik für Türchen und Jahr-Auswahl
│   └── audio/          # Symlink zum audio/ Ordner
└── README.md           # Diese Datei
```

## 🎨 Design-Highlights

### Jahr-spezifische Themes

Jedes Jahr bietet ein einzigartiges visuelles Erlebnis:

| Jahr | Hintergrund | Türchen-Farbe | Fallende Elemente | Icon |
|------|-------------|---------------|-------------------|------|
| 2025 | Violett/Lila | Magenta/Lila | Schneeflocken & Sterne ❄️⭐ | ❄️ |
| 2026 | Blau/Teal | Cyan/Blau | Geschenke & Pakete 🎁📦 | 🎁 |
| 2027 | Rot/Magenta | Rot/Pink | Glocken & Kerzen 🔔🕯️ | 🔔 |
| 2028 | Grün/Smaragd | Grün | Santa & Rentiere 🎅🦌 | 🎅 |
| 2029 | Braun/Gold | Orange/Braun | Kekse & Süßigkeiten 🍪🍭 | 🍪 |
| 2030 | Navy/Königsblau | Dunkelblau | Sterne & Funkeln ✨🌟 | ✨ |

### Animationen
- Jahr-spezifische fallende Elemente (nicht nur Schneeflocken!)
- Sanfter Leuchteffekt bei geöffneten Türchen
- Hover-Effekt mit Vergrößerung und Schatten
- Funkelnde Icons bei freigeschalteten Türchen
- Smooth Modal-Übergänge
- Fließende Theme-Übergänge beim Jahreswechsel

## 🔧 Funktionsweise

### Jahr-basierte Freischaltlogik

Das Script verwendet intelligente Logik basierend auf dem gewählten Jahr:

**Zukünftige Jahre** (z.B. 2026 wählen während wir in 2025 sind):
- ❌ Alle Türchen bleiben verschlossen
- 📅 Zeigt das Freischaltdatum im gewählten Jahr an
- 🔮 Perfekt zum Vorausplanen künftiger Advent-Inhalte

**Aktuelles Jahr** (z.B. 2025 wählen während wir in 2025 sind):
- 📅 Türchen öffnen sich progressiv während des Dezembers
- ✅ Türchen 1 öffnet sich am 1. Dezember 2025
- ✅ Türchen 2 öffnet sich am 2. Dezember 2025
- ✅ usw. bis Türchen 24 am 24. Dezember 2025
- 🎄 Traditionelles Adventskalender-Erlebnis

**Vergangene Jahre** (z.B. 2025 wählen während wir in 2026 sind):
- ✨ **Alle Türchen bleiben permanent geöffnet**
- 🔓 Keine zeitlichen Beschränkungen mehr
- 💝 Perfekt zum Nacherleben schöner Erinnerungen
- 🎁 Zugriff auf alle Audio-Inhalte jederzeit

### Interaktion
- **Jahresauswahl**: Diskrete Dropdown in der oberen rechten Ecke
- **Klick auf verschlossenes Türchen**: Zeigt Meldung mit Freischaltdatum (basierend auf gewähltem Jahr)
- **Klick auf geöffnetes Türchen**: Öffnet Modal mit Audio-Player für das gewählte Jahr
- **Modal schließen**: Via X-Button oder Klick außerhalb des Modals
- **Theme-Wechsel**: Automatische Anpassung aller visuellen Elemente beim Jahreswechsel

## 🎵 Audio-Vorschläge

Der Kalender eignet sich perfekt für:
- Weihnachtslieder
- Adventsgeschichten
- Gedichte
- Persönliche Grußbotschaften
- Weihnachts-Podcast-Episoden
- Klassische Weihnachtsmusik
- Hörbuch-Ausschnitte

## 🐳 Docker Details

Der Adventskalender läuft als Node.js Express-Anwendung:
- **Port**: 8088
- **Base Image**: node:20-alpine
- **Volume**: Der `audio/` Ordner wird als Volume gemountet zu `/app/public/audio`
- **Features**: 
  - Passwort-Schutz via API
  - Automatische Jahres-Erkennung via API
  - Unterstützt mehrere Jahre ohne Container-Neustart

### Docker Befehle

```bash
# Container starten
docker-compose up -d

# Container stoppen
docker-compose down

# Container neu bauen (nach Code-Änderungen)
docker-compose up -d --build

# Logs anzeigen
docker-compose logs -f

# Container Status prüfen
docker-compose ps
```

## 📱 Browser-Kompatibilität

Getestet und funktioniert in:
- Chrome/Edge (aktuelle Versionen)
- Firefox (aktuelle Versionen)
- Safari (aktuelle Versionen)
- Mobile Browser (iOS/Android)

## 🎁 Anpassungsmöglichkeiten

### Neues Jahr hinzufügen

1. **Audio-Ordner erstellen**:
   ```bash
   mkdir audio/2027
   ```

2. **Audio-Dateien hinzufügen**:
   - Fügen Sie `day1.mp3` bis `day24.mp3` in den neuen Ordner

3. **Theme anpassen** (optional):
   Bearbeiten Sie `public/styles.css` und `public/script.js`:
   
   **In styles.css** - Fügen Sie Jahr-spezifische Styles hinzu:
   ```css
   /* Hintergrund für 2027 */
   body[data-year="2027"] {
       background: linear-gradient(135deg, #2e0f1a 0%, #4e1b2d 50%, #2e0f1a 100%);
   }
   
   /* Türchen-Farbe für 2027 */
   body[data-year="2027"] .door.unlocked {
       background: linear-gradient(145deg, #8b0000, #dc143c);
       border-color: #ff69b4;
   }
   
   /* Türchen-Icon für 2027 */
   body[data-year="2027"] .door.unlocked::before {
       content: "🔔";
   }
   ```
   
   **In script.js** - Fügen Sie fallende Elemente hinzu:
   ```javascript
   const yearThemes = {
       '2027': ['🔔', '🕯️', '🔔', '⭐', '✨'],
       // ... andere Jahre
   };
   ```

4. **Server neu starten**:
   ```bash
   docker-compose restart
   ```

### Passwort ändern

Bearbeiten Sie die `.env` Datei:
```env
ADVENT_PASSWORD="IhrNeuesPasswort"
```

### Port ändern

Bearbeiten Sie `docker-compose.yml`:
```yaml
ports:
  - "8088:8088"  # Ändern Sie den ersten Port
```

Und `.env`:
```env
PORT=8088  # Gleicher Port wie in docker-compose.yml
```

## 📝 Lizenz

Dieses Projekt ist frei verwendbar für persönliche und kommerzielle Zwecke.

## 🎅 Viel Spaß beim Advent!

Frohe Weihnachten und einen wunderschönen Advent! 🎄✨
