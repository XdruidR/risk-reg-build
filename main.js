const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');
const appPaths = require('./src/main/paths');

function bootstrap() {
  // Configure logging
  log.transports.file.resolvePath = () => appPaths.logFile;
  log.info('App starting...');

  // Create directory structure
  [appPaths.dataDir, appPaths.inboxDir, appPaths.processedDir, appPaths.logsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log.info(`Created directory: ${dir}`);
    }
  });

  // Bootstrap config.json
  if (!fs.existsSync(appPaths.configPath)) {
    const defaultConfigPath = path.join(app.getAppPath(), 'config.json');
    fs.copyFileSync(defaultConfigPath, appPaths.configPath);
    log.info(`Copied default config.json to ${appPaths.configPath}`);
  }

  // Bootstrap risk_register.csv
  if (!fs.existsSync(appPaths.csvPath)) {
    const configData = JSON.parse(fs.readFileSync(appPaths.configPath, 'utf8'));
    const headers = configData.fields.map(field => field.name).join(',');
    fs.writeFileSync(appPaths.csvPath, headers);
    log.info(`Created risk_register.csv with headers at ${appPaths.csvPath}`);
  }
}

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
  bootstrap();

  // IPC handler to get config
  ipcMain.handle('get-config', async () => {
    const data = fs.readFileSync(appPaths.configPath, 'utf8');
    return JSON.parse(data);
  });

  // IPC handler to get risk data
  ipcMain.handle('get-risks', async () => {
    const data = fs.readFileSync(appPaths.csvPath, 'utf8');
    return data;
  });

  // IPC handler to list files in the inbox
  ipcMain.handle('list-inbox', async () => {
    const files = fs.readdirSync(appPaths.inboxDir);
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