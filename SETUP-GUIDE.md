# RUBIK'S CUBE TRAINER - COMPLETE SETUP GUIDE

## PART 1: Initial Project Setup

### Create project:
npm create vite@latest rubiks-cube-trainer -- --template react-ts
cd rubiks-cube-trainer
npm install

### Install dependencies:
npm install three
npm install -D tailwindcss@^3.4.0 postcss autoprefixer @types/three

### Initialize Tailwind CSS v3:
npx tailwindcss init -p

Update src/index.css with:
@tailwind base;
@tailwind components;
@tailwind utilities;

## PART 2: Fix React.StrictMode

Edit src/main.tsx - Remove <React.StrictMode> wrapper to prevent duplicate rendering

## PART 3: Fix Brave Browser Colors

Go to: brave://flags/#ignore-gpu-blocklist
Set to Enabled, restart Brave

## PART 4: Electron Desktop App Setup

### Install dependencies:
npm install --save-dev electron electron-builder cross-env

### Create electron/main.cjs (use .cjs not .js!)
mkdir -p electron

### Update package.json:
npm pkg set main="electron/main.cjs"
npm pkg set scripts.electron="cross-env NODE_ENV=development electron ."
npm pkg set scripts.build:linux="vite build && electron-builder --linux"
npm pkg set scripts.build:win="vite build && electron-builder --win"
npm pkg set scripts.build:mac="vite build && electron-builder --mac"

### Create electron-builder.json with proper configuration

### Update vite.config.ts with base: './'

## PART 5: Building and Running

### Development:
Terminal 1: npm run dev
Terminal 2: npm run electron

### Build for Linux:
npm run build:linux
Output: release/Rubiks Cube Trainer-0.1.0.AppImage

### Build for Windows:
Install Wine, then: npm run build:win

### Build for macOS:
Requires macOS: npm run build:mac

## PART 6: Installing the App

### Make executable:
chmod +x release/Rubiks\ Cube\ Trainer-0.1.0.AppImage

### Install system-wide:
mkdir -p ~/.local/share/apps
cp release/Rubiks\ Cube\ Trainer-0.1.0.AppImage ~/.local/share/apps/
chmod +x ~/.local/share/apps/Rubiks\ Cube\ Trainer-0.1.0.AppImage

### Create launcher:
cat > ~/.local/share/applications/rubiks-cube-trainer.desktop << DESKTOPEOF
[Desktop Entry]
Name=Rubiks Cube Trainer
Comment=Practice Rubik's Cube sequences
Exec=\$HOME/.local/share/apps/Rubiks Cube Trainer-0.1.0.AppImage
Icon=applications-games
Terminal=false
Type=Application
Categories=Education;Game;
DESKTOPEOF

chmod +x ~/.local/share/applications/rubiks-cube-trainer.desktop
update-desktop-database ~/.local/share/applications

## TROUBLESHOOTING

- White screen: Check electron/main.cjs path
- Tailwind not working: npm list tailwindcss (should be 3.4.x)
- Brave colors: Enable ignore-gpu-blocklist flag
- AppImage errors: Run with ELECTRON_ENABLE_LOGGING=1

## FEATURES

✅ Interactive 3D Rubik's Cube
✅ Customizable scrambles (2-25 moves)
✅ Unique scramble IDs (281 trillion)
✅ Timer with Space/R shortcuts
✅ Statistics (ao5, ao12, ao100, DNF)
✅ Persistent history
✅ Draggable windows
✅ Cross-platform desktop app

## QUICK COMMANDS

npm run dev              # Start dev server
npm run electron         # Run in Electron
npm run build:linux      # Build for Linux
npm run build:win        # Build for Windows
npm run build:mac        # Build for macOS


## CHANGING THE ICON

### 1. Replace the icon file:
cp /path/to/your/new-icon.png ~/rubiks-cube-trainer/public/icon.png

### 2. Update system icon:
cp ~/rubiks-cube-trainer/public/icon.png ~/.local/share/icons/hicolor/512x512/apps/rubiks-cube-trainer.png
gtk-update-icon-cache -f -t ~/.local/share/icons/hicolor

### 3. Rebuild the app:
cd ~/rubiks-cube-trainer
npm run build:linux

### 4. Reinstall:
cp release/Rubiks\ Cube\ Trainer-0.1.0.AppImage ~/.local/share/apps/
chmod +x ~/.local/share/apps/Rubiks\ Cube\ Trainer-0.1.0.AppImage

### 5. Refresh GNOME (if icon doesn't update):
killall -3 gnome-shell
# Or just log out and back in

Note: Icon should be PNG format, ideally 512x512 pixels

## PART 7: Android App Setup (Capacitor)

### Prerequisites:
- Android Studio installed
- Java JDK 17+ or 21
- Android SDK installed via Android Studio
- exFAT support: `sudo apt install exfatprogs`

### Install Capacitor:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Rubiks Cube Trainer" "com.rubikscube.trainer" --web-dir=dist
```

### Add Android platform:
```bash
npx cap add android
```

### Prepare Android-specific version:
```bash
# Keep separate Android version
cp src/App.tsx src/App.tsx.desktop
cp src/App.tsx src/App.tsx.Android
# Edit App.tsx.Android with mobile optimizations
```

### Generate Android icons:
```bash
sudo apt install imagemagick
cd ~/rubiks-cube-trainer

# Create icon directories
mkdir -p android/app/src/main/res/mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}

# Generate all icon sizes
convert public/icon.png -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert public/icon.png -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert public/icon.png -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert public/icon.png -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert public/icon.png -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Also generate round and foreground variants
convert public/icon.png -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
convert public/icon.png -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
convert public/icon.png -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
convert public/icon.png -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
convert public/icon.png -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png

convert public/icon.png -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png
convert public/icon.png -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png
convert public/icon.png -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png
convert public/icon.png -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png
convert public/icon.png -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png
```

### Build APK:
```bash
# Switch to Android version
mv src/App.tsx src/App.tsx.desktop-temp
cp src/App.tsx.Android src/App.tsx

# Build
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug && cd ..

# Restore desktop version
mv src/App.tsx.desktop-temp src/App.tsx

# Copy APK
cp android/app/build/outputs/apk/debug/app-debug.apk ~/Downloads/Rubiks.Cube.Trainer.0.1.0.apk
```

### APK Location:
`android/app/build/outputs/apk/debug/app-debug.apk`

### Android-Specific Features:
✅ Touch controls for cube rotation  
✅ Responsive sizing (250px-600px cube)  
✅ Compact 2D cube visualization  
✅ Mobile-optimized layout  
✅ Collapsible manual controls  
✅ All statistics and timer features  

### Release Build (for distribution):
```bash
cd android
./gradlew assembleRelease
cd ..
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

**Note:** Release builds require code signing. See Android documentation.

### Installing on Device:

**Via SD Card (recommended for DAPs):**
1. Copy APK to SD card root
2. Insert SD card into device
3. Settings → Security → Enable "Install from Unknown Sources"
4. Open File Manager, locate the APK
5. Tap to install

**Important - Security Verification:**
Some devices (especially DAPs like HiBy) perform **double security checks**:
- First check: "Install from Unknown Sources" permission
- Second check: Automatic malware/signature verification
- This is normal and ensures app safety
- Wait for both checks to complete before installation proceeds

**Note:** If installation fails after security checks, try:
- Uninstalling any previous version first
- Restarting the device
- Re-enabling "Unknown Sources" after restart

### Installing via ADB (alternative method):
```bash
adb install ~/Downloads/Rubiks.Cube.Trainer.0.1.0.apk
```
## PLATFORMS SUPPORTED

✅ **Linux** - AppImage  
✅ **Windows** - Setup.exe  
✅ **macOS** - DMG  
✅ **Android** - APK
