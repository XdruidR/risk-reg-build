const { contextBridge, ipcRenderer } = require('electron');
const appPaths = require('./src/main/paths');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  getRisks: () => ipcRenderer.invoke('get-risks'),
  listInbox: () => ipcRenderer.invoke('list-inbox')
});

contextBridge.exposeInMainWorld('appPaths', {
  get: () => ({
    dataDir: appPaths.dataDir,
    inboxDir: appPaths.inboxDir,
    processedDir: appPaths.processedDir,
    logsDir: appPaths.logsDir
  })
});