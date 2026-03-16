import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distIndexPath = path.join(__dirname, '..', 'dist', 'index.html');

const getDataFilePath = () => path.join(app.getPath('userData'), 'tasktrack-data.json');

const ensureDataFileExists = async () => {
  const dataFilePath = getDataFilePath();
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });

  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.writeFile(dataFilePath, '', 'utf8');
  }

  return dataFilePath;
};

const loadStoredState = async () => {
  const dataFilePath = await ensureDataFileExists();
  const raw = await fs.readFile(dataFilePath, 'utf8');

  return {
    fileName: path.basename(dataFilePath),
    path: dataFilePath,
    state: raw.trim() ? JSON.parse(raw) : null,
  };
};

const saveStoredState = async (_event, state) => {
  const dataFilePath = await ensureDataFileExists();
  await fs.writeFile(dataFilePath, JSON.stringify(state, null, 2), 'utf8');

  return {
    fileName: path.basename(dataFilePath),
    path: dataFilePath,
  };
};

const createWindow = async () => {
  await ensureDataFileExists();

  const window = new BrowserWindow({
    width: 1500,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: '#f8fafc',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  await window.loadFile(distIndexPath);

  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });
};

ipcMain.handle('tasktrack:load-state', loadStoredState);
ipcMain.handle('tasktrack:save-state', saveStoredState);

app.whenReady().then(async () => {
  await createWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});