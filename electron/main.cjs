const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      nodeIntegation: false,
      contextIsolation: true,
    }
  });

  if (app.isPackaged) {
    // When packaged, dist is at the root level of app.asar
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    // In development
    win.loadURL('http://localhost:1420');
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
