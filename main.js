const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const { getPaths } = require('./src/main/paths');

let paths;

function bootstrap(p) {
  [p.dataDir, p.inboxDir, p.processedDir, p.logsDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
  if (!fs.existsSync(p.configPath)) {
    const defaultCfg = require('./config.json');
    fs.writeFileSync(p.configPath, JSON.stringify(defaultCfg, null, 2), 'utf8');
  }
  if (!fs.existsSync(p.csvPath)) {
    const cfg = JSON.parse(fs.readFileSync(p.configPath, 'utf8'));
    const header = cfg.fields.map(f => f.name);
    fs.writeFileSync(p.csvPath, header.join(',') + '\n', 'utf8');
  }
}

function registerIpc(p) {
  ipcMain.handle('get-app-paths', () => p);
  ipcMain.handle('get-config', () => JSON.parse(fs.readFileSync(p.configPath, 'utf8')));
  ipcMain.handle('get-risks', () => {
    const data = fs.readFileSync(p.csvPath, 'utf8');
    return parse(data, { columns: true, relax_quotes: true });
  });
  ipcMain.handle('list-inbox', () => fs.readdirSync(p.inboxDir).filter(f => !f.startsWith('.')));
}

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');
  console.log('[main] preload at', preloadPath, 'exists?', fs.existsSync(preloadPath));

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // keep false so preload can require()
    },
  });

  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript('console.log("[page] has api?", typeof window.api)').catch(console.error);
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  paths = getPaths();
  bootstrap(paths);
  registerIpc(paths);
  createWindow();
});
