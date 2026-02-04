# 🎲 Rubik's Cube Trainer

A modern **cross-platform** application for practicing Rubik's Cube with an integrated timer, comprehensive statistics, and 281 trillion unique scrambles.

## ✨ Features

* **Interactive 3D Cube**: Smooth Three.js visualization with drag/touch-to-rotate
* **Smart Scrambler**: Generate 2-25 move sequences with unique reproducible IDs
* **Professional Timer**: Spacebar to start/stop (desktop) or tap buttons (mobile)
* **Advanced Statistics**: Track ao5, ao12, ao100, DNF, best/worst times
* **Step-by-Step Mode**: Execute moves one at a time for learning
* **Persistent History**: All your solves are saved locally
* **Draggable UI**: Customize your workspace layout (desktop)
* **Visual Scramble Display**: 2D unfolded cube view
* **Mobile Optimized**: Responsive design for phones and DAPs

## 📥 Download

### Linux (All Distros)
Download the latest AppImage from **Releases**
```bash
chmod +x Rubiks-Cube-Trainer-*.AppImage
./Rubiks-Cube-Trainer-*.AppImage
```

### Windows
**Option 1: Installer (Recommended)**
* Download `Rubiks.Cube.Trainer.Setup.*.exe` from **Releases**
* Run the installer and follow the prompts

**Option 2: Portable**
* Download `Rubiks.Cube.Trainer.*.exe` from **Releases**
* Run directly (no installation needed)

### macOS
* Download `Rubiks-Cube-Trainer-*-mac.zip` from **Releases**
* Extract and drag to Applications folder
* Note: You may need to allow the app in System Preferences → Security & Privacy

### Android
* Download `Rubiks.Cube.Trainer.*.apk` from **Releases**
* Enable "Install from Unknown Sources" in Settings → Security
* Open the APK file to install
* **Note**: Some devices perform double security checks - this is normal, wait for both to complete

**Requirements**: Android 7.0+ (API 24+), WebGL support

## ⌨️ Keyboard Shortcuts

**Desktop:**
* `Space`: Start/Stop timer
* `R`: Reset timer
* `Mouse Drag`: Rotate 3D cube

**Mobile/Android:**
* Touch controls for cube rotation
* On-screen timer buttons
* Tap to expand/collapse sections

## 🎯 Unique Features

### Reproducible Scrambles
Every scramble has a unique hex ID. Save and share specific scrambles with friends!

### 281 Trillion Unique Scrambles
Using seeded random generation for endless practice variety.

### Mobile-Optimized Experience
* Touch-based cube rotation
* Responsive sizing (adapts to screen size)
* Compact 2D cube visualization
* Battery-efficient rendering

## 🛠️ Building from Source

See **SETUP-GUIDE.md** for detailed instructions.
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

* **Frontend**: React + TypeScript
* **3D Graphics**: Three.js
* **Desktop**: Electron
* **Mobile**: Capacitor
* **Styling**: Tailwind CSS

## 📱 Platforms

✅ **Linux** - AppImage  
✅ **Windows** - Installer & Portable  
✅ **macOS** - DMG  
✅ **Android** - APK  

## 📝 License

MIT License

## 🙏 Built for the Cubing Community

Happy Cubing! 🎲✨
