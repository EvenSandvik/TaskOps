const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('taskTrackDesktop', {
  isDesktop: true,
  loadState: (filePath) => ipcRenderer.invoke('tasktrack:load-state', filePath),
  saveState: (payload) => ipcRenderer.invoke('tasktrack:save-state', payload),
  listFiles: () => ipcRenderer.invoke('tasktrack:list-files'),
  createFile: (fileName) => ipcRenderer.invoke('tasktrack:create-file', fileName),
});