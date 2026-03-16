import { app, BrowserWindow, ipcMain, safeStorage, shell } from 'electron';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distIndexPath = path.join(__dirname, '..', 'dist', 'index.html');
const ENCRYPTED_STATE_VERSION = 1;

const getDataDirectoryPath = () => path.join(app.getPath('userData'), 'data-files');
const getCatalogPath = () => path.join(app.getPath('userData'), 'tasktrack-files.json');

const buildDefaultCatalog = () => ({
  recentFilePath: null,
  files: [],
});

const isEncryptedStateEnvelope = (value) =>
  Boolean(
    value
    && typeof value === 'object'
    && value.type === 'tasktrack-encrypted-state'
    && value.version === ENCRYPTED_STATE_VERSION
    && typeof value.payload === 'string'
    && value.payload,
  );

const getEncryptionMeta = () => {
  let encryptionAvailable = false;

  try {
    encryptionAvailable = safeStorage.isEncryptionAvailable();
  } catch {
    encryptionAvailable = false;
  }

  return {
    encryptionAvailable,
    isEncrypted: false,
    encryptionError: false,
  };
};

const serializeState = (state) => {
  const plaintext = JSON.stringify(state, null, 2);
  const encryptionMeta = getEncryptionMeta();

  if (!encryptionMeta.encryptionAvailable) {
    return {
      raw: plaintext,
      ...encryptionMeta,
    };
  }

  const encrypted = safeStorage.encryptString(plaintext);
  return {
    raw: JSON.stringify({
      type: 'tasktrack-encrypted-state',
      version: ENCRYPTED_STATE_VERSION,
      payload: encrypted.toString('base64'),
    }),
    encryptionAvailable: true,
    isEncrypted: true,
    encryptionError: false,
  };
};

const parseStoredState = (raw) => {
  const encryptionMeta = getEncryptionMeta();
  const trimmed = raw.trim();

  if (!trimmed) {
    return {
      state: null,
      rawState: '',
      ...encryptionMeta,
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return {
      state: null,
      rawState: raw,
      ...encryptionMeta,
    };
  }

  if (!isEncryptedStateEnvelope(parsed)) {
    return {
      state: parsed,
      rawState: raw,
      ...encryptionMeta,
    };
  }

  if (!encryptionMeta.encryptionAvailable) {
    return {
      state: null,
      rawState: raw,
      encryptionAvailable: false,
      isEncrypted: true,
      encryptionError: true,
    };
  }

  try {
    const decrypted = safeStorage.decryptString(Buffer.from(parsed.payload, 'base64'));
    return {
      state: JSON.parse(decrypted),
      rawState: decrypted,
      encryptionAvailable: true,
      isEncrypted: true,
      encryptionError: false,
    };
  } catch {
    return {
      state: null,
      rawState: raw,
      encryptionAvailable: true,
      isEncrypted: true,
      encryptionError: true,
    };
  }
};

const ensureStorageReady = async () => {
  await fs.mkdir(getDataDirectoryPath(), { recursive: true });

  try {
    await fs.access(getCatalogPath());
  } catch {
    await fs.writeFile(getCatalogPath(), JSON.stringify(buildDefaultCatalog(), null, 2), 'utf8');
  }
};

const readCatalog = async () => {
  await ensureStorageReady();
  try {
    const raw = await fs.readFile(getCatalogPath(), 'utf8');
    const parsed = JSON.parse(raw);
    return {
      recentFilePath: typeof parsed?.recentFilePath === 'string' ? parsed.recentFilePath : null,
      files: Array.isArray(parsed?.files) ? parsed.files : [],
    };
  } catch {
    return buildDefaultCatalog();
  }
};

const writeCatalog = async (catalog) => {
  await ensureStorageReady();
  await fs.writeFile(getCatalogPath(), JSON.stringify(catalog, null, 2), 'utf8');
};

const createOrUpdateCatalogEntry = (catalog, filePath, updates = {}) => {
  const existingIndex = catalog.files.findIndex((item) => item?.path === filePath);
  const nextEntry = {
    path: filePath,
    fileName: path.basename(filePath),
    description: '',
    lastUsedAt: Date.now(),
    lastSavedAt: null,
    ...(existingIndex >= 0 ? catalog.files[existingIndex] : {}),
    ...updates,
  };

  if (existingIndex >= 0) {
    catalog.files.splice(existingIndex, 1, nextEntry);
  } else {
    catalog.files.push(nextEntry);
  }
};

const listCatalogFiles = async () => {
  await ensureStorageReady();
  const catalog = await readCatalog();

  const diskFiles = await fs.readdir(getDataDirectoryPath(), { withFileTypes: true });
  const jsonFilePaths = diskFiles
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.json'))
    .map((entry) => path.join(getDataDirectoryPath(), entry.name));

  jsonFilePaths.forEach((filePath) => createOrUpdateCatalogEntry(catalog, filePath));
  catalog.files = catalog.files.filter((entry) => entry?.path && jsonFilePaths.includes(entry.path));

  const filesWithStats = await Promise.all(
    catalog.files.map(async (entry) => {
      try {
        const stats = await fs.stat(entry.path);
        const mtimeMs = Number(stats.mtimeMs) || 0;
        return {
          ...entry,
          fileName: path.basename(entry.path),
          description: typeof entry.description === 'string' ? entry.description : '',
          _sortTime: Math.max(Number(entry.lastUsedAt) || 0, Number(entry.lastSavedAt) || 0, mtimeMs),
        };
      } catch {
        return null;
      }
    }),
  );

  const files = filesWithStats
    .filter(Boolean)
    .sort((a, b) => b._sortTime - a._sortTime)
    .map(({ _sortTime, ...entry }) => entry);

  catalog.files = files;
  if (catalog.recentFilePath && !files.some((item) => item.path === catalog.recentFilePath)) {
    catalog.recentFilePath = null;
  }

  await writeCatalog(catalog);
  return catalog;
};

const sanitizeBaseName = (value) =>
  (value ?? '')
    .toString()
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/\.+$/g, '')
    .trim();

const normalizeCreatePayload = (payload) => {
  if (typeof payload === 'string') {
    return {
      name: payload,
      description: '',
    };
  }

  return {
    name: typeof payload?.name === 'string' ? payload.name : '',
    description: typeof payload?.description === 'string' ? payload.description.trim() : '',
  };
};

const createNewDataFile = async (_event, payload) => {
  await ensureStorageReady();
  const requested = normalizeCreatePayload(payload);
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
  const safeName = sanitizeBaseName(requested.name);
  const defaultBaseName = `tasktrack-${stamp}`;
  const baseName = safeName || defaultBaseName;

  let filePath = path.join(getDataDirectoryPath(), `${baseName}.json`);
  let suffix = 1;
  while (true) {
    try {
      await fs.access(filePath);
      filePath = path.join(getDataDirectoryPath(), `${baseName}-${suffix}.json`);
      suffix += 1;
    } catch {
      break;
    }
  }

  await fs.writeFile(filePath, '', 'utf8');

  const catalog = await readCatalog();
  createOrUpdateCatalogEntry(catalog, filePath, {
    description: requested.description,
    lastUsedAt: Date.now(),
    lastSavedAt: Date.now(),
  });
  catalog.recentFilePath = filePath;
  await writeCatalog(catalog);

  const refreshedCatalog = await listCatalogFiles();
  return {
    fileName: path.basename(filePath),
    path: filePath,
    files: refreshedCatalog.files,
    recentFilePath: refreshedCatalog.recentFilePath,
  };
};

const deleteStoredFile = async (_event, requestedPath) => {
  if (typeof requestedPath !== 'string' || !requestedPath.trim()) {
    return {
      deleted: false,
      files: (await listCatalogFiles()).files,
      recentFilePath: (await listCatalogFiles()).recentFilePath,
    };
  }

  const dataDirectory = path.resolve(getDataDirectoryPath());
  const targetPath = path.resolve(requestedPath);
  const isInsideDataDirectory = targetPath === dataDirectory || targetPath.startsWith(`${dataDirectory}${path.sep}`);

  if (!isInsideDataDirectory || !targetPath.toLowerCase().endsWith('.json')) {
    return {
      deleted: false,
      files: (await listCatalogFiles()).files,
      recentFilePath: (await listCatalogFiles()).recentFilePath,
    };
  }

  await fs.rm(targetPath, { force: true });

  const catalog = await readCatalog();
  catalog.files = catalog.files.filter((entry) => entry?.path !== targetPath);
  if (catalog.recentFilePath === targetPath) {
    catalog.recentFilePath = null;
  }
  await writeCatalog(catalog);

  const refreshedCatalog = await listCatalogFiles();
  if (!refreshedCatalog.recentFilePath && refreshedCatalog.files.length) {
    refreshedCatalog.recentFilePath = refreshedCatalog.files[0].path;
    await writeCatalog(refreshedCatalog);
  }

  return {
    deleted: true,
    files: refreshedCatalog.files,
    recentFilePath: refreshedCatalog.recentFilePath,
  };
};

const resolveLoadFilePath = async (requestedPath) => {
  if (typeof requestedPath === 'string' && requestedPath.trim()) {
    return requestedPath;
  }

  const catalog = await listCatalogFiles();
  if (catalog.recentFilePath) {
    return catalog.recentFilePath;
  }

  if (catalog.files.length) {
    return catalog.files[0].path;
  }

  const created = await createNewDataFile();
  return created.path;
};

const loadStoredState = async (_event, requestedPath) => {
  const dataFilePath = await resolveLoadFilePath(requestedPath);
  await ensureStorageReady();

  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.writeFile(dataFilePath, '', 'utf8');
  }

  const raw = await fs.readFile(dataFilePath, 'utf8');
  const parsedState = parseStoredState(raw);

  const catalog = await readCatalog();
  createOrUpdateCatalogEntry(catalog, dataFilePath, {
    lastUsedAt: Date.now(),
  });
  catalog.recentFilePath = dataFilePath;
  await writeCatalog(catalog);

  const refreshedCatalog = await listCatalogFiles();

  return {
    fileName: path.basename(dataFilePath),
    path: dataFilePath,
    state: parsedState.state,
    rawState: parsedState.rawState,
    files: refreshedCatalog.files,
    recentFilePath: refreshedCatalog.recentFilePath,
    encryptionAvailable: parsedState.encryptionAvailable,
    isEncrypted: parsedState.isEncrypted,
    encryptionError: parsedState.encryptionError,
  };
};

const saveStoredState = async (_event, payload) => {
  const requestedPath = typeof payload?.filePath === 'string' ? payload.filePath : null;
  const dataFilePath = await resolveLoadFilePath(requestedPath);
  const state = payload?.state ?? null;
  const serializedState = serializeState(state);

  await fs.writeFile(dataFilePath, serializedState.raw, 'utf8');

  const catalog = await readCatalog();
  createOrUpdateCatalogEntry(catalog, dataFilePath, {
    lastUsedAt: Date.now(),
    lastSavedAt: Date.now(),
  });
  catalog.recentFilePath = dataFilePath;
  await writeCatalog(catalog);

  const refreshedCatalog = await listCatalogFiles();

  return {
    fileName: path.basename(dataFilePath),
    path: dataFilePath,
    files: refreshedCatalog.files,
    recentFilePath: refreshedCatalog.recentFilePath,
    encryptionAvailable: serializedState.encryptionAvailable,
    isEncrypted: serializedState.isEncrypted,
    encryptionError: serializedState.encryptionError,
  };
};

const listStoredFiles = async () => {
  const catalog = await listCatalogFiles();
  return {
    files: catalog.files,
    recentFilePath: catalog.recentFilePath,
  };
};

const createWindow = async () => {
  await ensureStorageReady();

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
ipcMain.handle('tasktrack:list-files', listStoredFiles);
ipcMain.handle('tasktrack:create-file', createNewDataFile);
ipcMain.handle('tasktrack:delete-file', deleteStoredFile);

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