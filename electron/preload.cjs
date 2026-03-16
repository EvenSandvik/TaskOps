const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('taskTrackDesktop', {
  isDesktop: true,
  loadState: () => ipcRenderer.invoke('tasktrack:load-state'),
  saveState: (state) => ipcRenderer.invoke('tasktrack:save-state', state),
});