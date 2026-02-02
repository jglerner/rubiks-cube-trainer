# 🎲 Rubik's Cube Trainer

A modern desktop application for practicing Rubik's Cube with an integrated timer, comprehensive statistics, and 281 trillion unique scrambles.

## ✨ Features

- **Interactive 3D Cube**: Smooth Three.js visualization with drag-to-rotate
- **Smart Scrambler**: Generate 2-25 move sequences with unique reproducible IDs
- **Professional Timer**: Spacebar to start/stop, R to reset
- **Advanced Statistics**: Track ao5, ao12, ao100, DNF, best/worst times
- **Step-by-Step Mode**: Execute moves one at a time for learning
- **Persistent History**: All your solves are saved locally
- **Draggable UI**: Customize your workspace layout
- **Visual Scramble Display**: 2D unfolded cube view

## 📥 Download

### Linux (All Distros)
Download the latest AppImage from [Releases](../../releases/latest)
```bash
chmod +x Rubiks-Cube-Trainer-*.AppImage
./Rubiks-Cube-Trainer-*.AppImage
```

### Windows
**Option 1: Installer (Recommended)**
- Download `Rubiks.Cube.Trainer.Setup.*.exe`from [Releases](../../releases/latest)
- Run the installer and follow the prompts

**Option 2: Portable**
- Download `Rubiks.Cube.Trainer.*.exe` from [Releases](../../releases/latest)
- Run directly (no installation needed)

### macOS
- Download `Rubiks-Cube-Trainer-*-mac.zip` from [Releases](../../releases/latest)
- Extract and drag to Applications folder
- **Note:** You may need to allow the app in System Preferences → Security & Privacy
To update:

## ⌨️ Keyboard Shortcuts

- **Space**: Start/Stop timer
- **R**: Reset timer
- **Mouse Drag**: Rotate 3D cube

## 🎯 Unique Features

### Reproducible Scrambles
Every scramble has a unique hex ID. Save and share specific scrambles with friends!

### 281 Trillion Unique Scrambles
Using seeded random generation for endless practice variety.

## 🛠️ Building from Source

See [SETUP-GUIDE.md](SETUP-GUIDE.md) for detailed instructions.
```bash
npm install
npm run dev              # Development
npm run build:linux      # Build for Linux
```

## 🧰 Tech Stack

- React + TypeScript
- Three.js for 3D rendering
- Electron for desktop packaging
- Tailwind CSS for styling

## 📝 License

MIT License

## 🙏 Built for the Cubing Community

Happy Cubing! 🎲✨
