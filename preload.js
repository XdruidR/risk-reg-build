// preload.js
console.log('[preload] starting');
try {
  const { contextBridge, ipcRenderer } = require('electron');

  contextBridge.exposeInMainWorld('api', {
    appPaths: () => ipcRenderer.invoke('get-app-paths'),
    getConfig: () => ipcRenderer.invoke('get-config'),
    getRisks: () => ipcRenderer.invoke('get-risks'),
    listInbox: () => ipcRenderer.invoke('list-inbox'),
  });

  console.log('[preload] api exposed');
} catch (e) {
  console.error('[preload] error', e);
}
