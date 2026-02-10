# Rubik's Cube Trainer

**📢 Latest Update:**
- **v0.1.2 (Desktop)**: Added penalty system (+2s), session tracking (Today's Mean, All-Time Mean), reset options, and new Rubik's cube icon with transparent background.
- **v0.1.0.2 (Android)**: Fixed compact layout for small-screen DAP devices, added new Rubik's cube icon, resolved CSS optimization issues.

A modern cross-platform application for practicing Rubik's Cube with an integrated timer, comprehensive statistics, and 281 trillion unique scrambles.

## ✨ Features

- **Interactive 3D Cube**: Smooth Three.js visualization with drag/touch-to-rotate 🧊
- **Smart Scrambler**: Generate 2-25 move sequences with unique reproducible IDs 🔢
- **Professional Timer**: Spacebar to start/stop (desktop) or tap buttons (mobile) ⏱️
- **Advanced Statistics**: Track ao5, ao12, ao100, DNF, best/worst times 📊
- **Penalty System**: Add +2s penalties for WCA-style timing ⏲️
- **Session Tracking**: Today's Mean and All-Time Mean statistics 📈
- **Step-by-Step Mode**: Execute moves one at a time for learning 🎓
- **Persistent History**: All your solves are saved locally 💾
- **Mobile Optimized**: Responsive design for phones and DAPs 📱

## 🔬 The Scramble Logic: Functionally Infinite Practice

This trainer utilizes a **Seeded Random Move** generator capable of producing **281 Trillion (2⁴⁸)** unique scramble sequences.

- **Why not 43 Quintillion?** While the total theoretical permutations of a 3×3 cube are ≈43 quintillion, our system provides a "functionally infinite" experience tailored for reproducibility.
- **The Scale**: At a rate of one solve per second, it would take a user **8.9 million years** to encounter every scramble in this app. ⏳
- **The Benefit**: By using a 48-bit seed system, every scramble is assigned a **Unique Hex ID**. This allows you to share a specific, difficult scramble with a friend simply by sending them the ID. 🔢
- **Quality Control**: The algorithm ensures no "illegal" move cancellations (e.g., R followed by R′) occur, ensuring every sequence is a valid, high-quality scramble. ✅

## 📥 Download

### Linux (All Distros)
**Current Version: v0.1.2**

Download the latest AppImage from [Releases](https://github.com/jglerner/rubiks-cube-trainer/releases)
```bash
chmod +x Rubiks-Cube-Trainer-*.AppImage
./Rubiks-Cube-Trainer-*.AppImage
```

### Windows
**Current Version: v0.1.0**

**Option 1: Installer (Recommended)**
- Download `Rubiks.Cube.Trainer.Setup.*.exe` from [Releases](https://github.com/jglerner/rubiks-cube-trainer/releases)
- Run the installer and follow the prompts

**Option 2: Portable**
- Download `Rubiks.Cube.Trainer.*.exe` from [Releases](https://github.com/jglerner/rubiks-cube-trainer/releases)
- Run directly (no installation needed)

### macOS
**Current Version: v0.1.0**

- Download `Rubiks-Cube-Trainer-*-mac.zip` from [Releases](https://github.com/jglerner/rubiks-cube-trainer/releases)
- Extract and drag to Applications folder
- Note: You may need to allow the app in System Preferences → Security & Privacy

### Android
**Current Version: v0.1.0.2** (Optimized for DAP devices and small screens)

- Download `Rubiks_Cube_Trainer_v0.1.0.2.apk` from [Releases](https://github.com/jglerner/rubiks-cube-trainer/releases)
- Enable "Install from Unknown Sources" in Settings → Security
- Open the APK file to install
- Note: Some devices perform double security checks - this is normal, wait for boot to complete

**Requirements:** Android 5.0+ (API 21+), WebGL support

## ⌨️ Keyboard Shortcuts

**Desktop:**
- `Space`: Start/Stop timer
- `R`: Reset timer
- `Mouse Drag`: Rotate 3D cube

**Mobile/Android:**
- Touch controls for cube rotation
- On-screen timer buttons
- Tap to expand/collapse sections

## 🎯 Unique Features

### Reproducible Scrambles
Every scramble has a unique hex ID. Save and share specific scrambles with friends!

### 281 Trillion Unique Scrambles
Using seeded random generation for endless practice variety.

### Session Statistics (v0.1.2+)
- Track today's session separately from all-time stats
- Add +2 second penalties for incomplete solves
- Reset options: Today only, All-time only, or Everything

### Mobile-Optimized Experience
- Touch-based cube rotation
- Responsive sizing (adapts to screen size)
- Compact 2D cube visualization
- Battery-efficient rendering

## 🛠️ Building from Source

See `SETUP-GUIDE.md` for detailed instructions.
```bash
npm install

# Development
npm run dev

# Desktop builds
npm run build:linux      # Linux AppImage
npm run build:win        # Windows exe
npm run build:mac        # macOS dmg

# Android build
npm run build            # Build web assets
npx cap sync android     # Sync to Android
cd android && ./gradlew assembleDebug
```

## 🧰 Tech Stack

- **Frontend**: React + TypeScript ⚛️
- **3D Graphics**: Three.js (WebGL Engine) 🎮
- **Desktop**: Electron 💻
- **Mobile**: Capacitor (Native Bridge for Android) 🤖
- **Styling**: Tailwind CSS 🎨

## 📱 Platforms

✅ Linux - AppImage (v0.1.2)
✅ Windows - Installer & Portable (v0.1.0)
✅ macOS - DMG (v0.1.0)
✅ Android - APK (v0.1.0.2)

## 📝 License

MIT License

## 🙏 Built for the Cubing Community

Happy Cubing! ✨
