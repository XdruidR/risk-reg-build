const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');
const { getPaths } = require('./src/main/paths');
const { registerIpcHandlers } = require('./src/main/ipc');

function bootstrap(paths) {
  // Configure logging
  log.transports.file.resolvePath = () => paths.logFile;
  log.info('App starting...');

  // Create directory structure
  [paths.dataDir, paths.inboxDir, paths.processedDir, paths.logsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log.info(`Created directory: ${dir}`);
    }
  });

  // Bootstrap config.json
  if (!fs.existsSync(paths.configPath)) {
    const defaultConfigPath = path.join(app.getAppPath(), 'config.json');
    fs.copyFileSync(defaultConfigPath, paths.configPath);
    log.info(`Copied default config.json to ${paths.configPath}`);
  }

  // Bootstrap risk_register.csv
  if (!fs.existsSync(paths.csvPath)) {
    const configData = JSON.parse(fs.readFileSync(paths.configPath, 'utf8'));
    const headers = configData.fields.map(field => field.name).join(',');
    fs.writeFileSync(paths.csvPath, headers);
    log.info(`Created risk_register.csv with headers at ${paths.csvPath}`);
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
  const paths = getPaths(app);
  bootstrap(paths);

  // Register all IPC handlers
  registerIpcHandlers(ipcMain, paths);

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