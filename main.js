const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  // IPC handler to get config
  ipcMain.handle('get-config', async () => {
    const configPath = path.join(app.getAppPath(), 'config.json');
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  });

  // IPC handler to get risk data
  ipcMain.handle('get-risks', async () => {
    const risksPath = path.join(app.getAppPath(), 'risk_register.csv');
    const data = fs.readFileSync(risksPath, 'utf8');
    return data;
  });

  // IPC handler to list files in the inbox
  ipcMain.handle('list-inbox', async () => {
    const inboxPath = path.join(app.getAppPath(), 'inbox');
    const files = fs.readdirSync(inboxPath);
    return files;
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});