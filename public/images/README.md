# Bilder für den Adventskalender

Dieses Verzeichnis enthält Bilder für die Adventskalender-Geschichten.

## Verzeichnisstruktur

Bilder sind nach Jahren organisiert, analog zu den Audio-Dateien:

```
public/images/
├── 2025/
│   ├── day1.png
│   ├── day2.png
│   ├── ...
│   └── day24.png
├── 2026/
│   ├── day1.png
│   ├── day2.png
│   ├── ...
│   └── day24.png
└── README.md
```

## Dateinamen-Konvention

Bilder verwenden die **gleiche Namenskonvention wie Audio-Dateien**:

- **Format**: `day{nummer}.png` (ohne führende Nullen)
- **Beispiele**: 
  - Tag 1: `day1.png`
  - Tag 15: `day15.png`
  - Tag 24: `day24.png`

Dies entspricht der Audio-Datei-Benennung: `day1.mp3`, `day2.mp3`, etc.

## Bild-Richtlinien

- **Format**: PNG (bevorzugt)
- **Empfohlene Abmessungen**: 800x600 Pixel oder ähnliches 4:3 Seitenverhältnis
- **Dateigröße**: Unter 1MB für optimale Ladegeschwindigkeit
- **Inhalt**: Das Bild sollte die Audio-Geschichte des Tages ergänzen

## Bilder hinzufügen

1. Platzieren Sie Ihr Bild im entsprechenden Jahresordner (z.B. `2025/`)
2. Benennen Sie es gemäß der Konvention: `day{nummer}.png` (z.B. `day1.png`, `day12.png`)
3. Das Bild wird automatisch angezeigt, wenn Benutzer das Türchen des Tages öffnen
4. Wenn für einen Tag kein Bild vorhanden ist, wird nur der Audio-Player angezeigt

## Hinweise

- Bilder sind optional - der Kalender funktioniert auch ohne sie
- Das System behandelt fehlende Bilder problemlos
- Bilder werden über dem Audio-Player im Modal angezeigt
- Die Benennung muss exakt übereinstimmen (auf manchen Systemen ist Groß-/Kleinschreibung relevant)
