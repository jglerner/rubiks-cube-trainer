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

