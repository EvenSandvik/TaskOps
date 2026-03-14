import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;
const KEYBOARD_ZOOM_STEP = 0.05;
const WHEEL_ZOOM_SENSITIVITY = 0.0022;
const URL_PATTERN = /(https?:\/\/[^\s<>"]+)/gi;
const DETAILS_PLACEHOLDER = 'Write the task here...';
const DEFAULT_TASK_WIDTH = 420;
const MIN_TASK_WIDTH = 300;
const MAX_TASK_WIDTH = 920;
const tasks = [];
const boards = [];
let activeBoardId = null;
let zoom = 1;
let zoomIndicatorTimer;
let draggedTaskId = null;
let draggedTaskElement = null;
let dragPreviewElement = null;
let didHandleDragDrop = false;
let didPreviewReorder = false;
let isCompletedSectionCollapsed = false;
let isTrashSectionCollapsed = false;
let isSidebarCollapsed = false;
let dataFileHandle = null;

const FILE_HANDLE_DB_NAME = 'tasktrack-file-handle-db';
const FILE_HANDLE_STORE_NAME = 'handles';
const FILE_HANDLE_KEY = 'primary';

const app = document.querySelector('#app');

const openFileHandleDb = () =>
  new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(FILE_HANDLE_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(FILE_HANDLE_STORE_NAME)) {
        db.createObjectStore(FILE_HANDLE_STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

const readStoredFileHandle = async () => {
  const db = await openFileHandleDb();
  if (!db) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(FILE_HANDLE_STORE_NAME, 'readonly');
    const store = transaction.objectStore(FILE_HANDLE_STORE_NAME);
    const request = store.get(FILE_HANDLE_KEY);

    request.onsuccess = () => {
      resolve(request.result ?? null);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

const storeFileHandle = async (handle) => {
  const db = await openFileHandleDb();
  if (!db) {
    return;
  }

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(FILE_HANDLE_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(FILE_HANDLE_STORE_NAME);
    const request = store.put(handle, FILE_HANDLE_KEY);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

const clearStoredFileHandle = async () => {
  const db = await openFileHandleDb();
  if (!db) {
    return;
  }

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(FILE_HANDLE_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(FILE_HANDLE_STORE_NAME);
    const request = store.delete(FILE_HANDLE_KEY);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

const ensureFilePermission = async (handle, write = true) => {
  if (!handle?.queryPermission || !handle.requestPermission) {
    return false;
  }

  const options = write ? { mode: 'readwrite' } : { mode: 'read' };
  if ((await handle.queryPermission(options)) === 'granted') {
    return true;
  }

  return (await handle.requestPermission(options)) === 'granted';
};

const createTask = (id) => ({
  id,
  title: `#${id}`,
  details: '',
  completed: false,
  width: DEFAULT_TASK_WIDTH,
  notes: [],
});

const clampTaskWidth = (value) => {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue)) {
    return DEFAULT_TASK_WIDTH;
  }

  return Math.min(MAX_TASK_WIDTH, Math.max(MIN_TASK_WIDTH, parsedValue));
};

const createBoard = (id, name, boardTasks = [], trashedTasks = [], nextTaskNumber = 1) => ({
  id,
  name,
  tasks: boardTasks,
  trashedTasks,
  nextTaskNumber,
});

const escapeHtml = (text) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const linkifyText = (text) => {
  const source = text ?? '';
  let output = '';
  let cursor = 0;

  for (const match of source.matchAll(URL_PATTERN)) {
    const index = match.index ?? 0;
    const url = match[0];
    output += escapeHtml(source.slice(cursor, index));
    output += `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>`;
    cursor = index + url.length;
  }

  output += escapeHtml(source.slice(cursor));
  return output.replaceAll('\n', '<br>');
};

const getDetailsPreviewHtml = (text) => {
  if (!text?.trim()) {
    return `<span class="task-links-placeholder">${escapeHtml(DETAILS_PLACEHOLDER)}</span>`;
  }

  return linkifyText(text);
};

const formatNoteTime = (time) => {
  const date = new Date(time);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getTimelineHtml = (notes, isCompleted = false) => {
  const notesHtml = notes
    .toSorted((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0))
    .map(
      (note) => `
        <li class="timeline-item">
          <div class="timeline-content">
            <time class="timeline-time" datetime="${new Date(note.createdAt).toISOString()}">${escapeHtml(formatNoteTime(note.createdAt))}</time>
            <p class="timeline-note">${linkifyText(note.text)}</p>
          </div>
        </li>
      `,
    )
    .join('');

  const finishedHtml = isCompleted
    ? `
        <li class="timeline-item timeline-item-finished">
          <div class="timeline-content">
            <p class="timeline-note timeline-note-finished"><i class="bi bi-check2-circle" aria-hidden="true"></i> Finished</p>
          </div>
        </li>
      `
    : '';

  return `${notesHtml}${finishedHtml}`;
};

const normalizeTasks = (rawTasks) => {
  if (!Array.isArray(rawTasks)) {
    return [];
  }

  return rawTasks.map((task, index) => ({
    id: Number(task.id) || index + 1,
    title: typeof task.title === 'string' && task.title.trim() ? task.title : `#${index + 1}`,
    details: typeof task.details === 'string' ? task.details : '',
    completed: Boolean(task.completed),
    width: clampTaskWidth(task.width),
    notes: Array.isArray(task.notes)
      ? task.notes
          .map((note) => ({
            text: typeof note?.text === 'string' ? note.text : '',
            createdAt: Number(note?.createdAt) || Date.now(),
          }))
          .filter((note) => note.text.trim())
      : [],
  }));
};

const getInitialNextTaskNumber = (boardTasks, trashedTasks = []) => {
  const maxTaskId = [...boardTasks, ...trashedTasks].reduce((max, task) => Math.max(max, Number(task?.id) || 0), 0);
  return Math.max(1, maxTaskId + 1);
};

const getActiveBoard = () => boards.find((board) => board.id === activeBoardId) ?? boards[0] ?? null;

const syncTasksFromActiveBoard = () => {
  const board = getActiveBoard();
  if (!board) {
    tasks.splice(0, tasks.length);
    return;
  }

  tasks.splice(0, tasks.length, ...normalizeTasks(board.tasks));
};

const buildPersistedState = () => ({
  boards,
  activeBoardId,
  zoom,
  menuSections: {
    completed: isCompletedSectionCollapsed,
    trash: isTrashSectionCollapsed,
  },
  sidebarCollapsed: isSidebarCollapsed,
});

const persistStateToFile = async () => {
  if (!dataFileHandle) {
    return;
  }

  const writable = await dataFileHandle.createWritable();
  await writable.write(JSON.stringify(buildPersistedState(), null, 2));
  await writable.close();
};

const requestPersist = () => {
  void persistStateToFile().catch(() => {
    // ignore write failures silently to avoid breaking interaction flow
  });
};

const loadDefaultState = () => {
  const defaultBoard = createBoard(1, 'Board 1', [], [], 1);
  boards.splice(0, boards.length, defaultBoard);
  activeBoardId = defaultBoard.id;
  zoom = 1;
  isCompletedSectionCollapsed = false;
  isTrashSectionCollapsed = false;
  isSidebarCollapsed = false;
  syncTasksFromActiveBoard();
};

const restoreStateFromFile = (state) => {
  const sourceBoards = Array.isArray(state?.boards) ? state.boards : [];

  if (!sourceBoards.length) {
    loadDefaultState();
    return;
  }

  boards.splice(
    0,
    boards.length,
    ...sourceBoards.map((board, index) => {
      const normalizedTasks = normalizeTasks(board?.tasks);
      const normalizedTrashedTasks = normalizeTasks(board?.trashedTasks);
      return createBoard(
        Number(board?.id) || index + 1,
        typeof board?.name === 'string' && board.name.trim() ? board.name : `Board ${index + 1}`,
        normalizedTasks,
        normalizedTrashedTasks,
        Number(board?.nextTaskNumber) || getInitialNextTaskNumber(normalizedTasks, normalizedTrashedTasks),
      );
    }),
  );

  const candidateActiveBoardId = Number(state?.activeBoardId);
  activeBoardId = Number.isFinite(candidateActiveBoardId) ? candidateActiveBoardId : boards[0].id;
  if (!boards.some((board) => board.id === activeBoardId)) {
    activeBoardId = boards[0].id;
  }

  const candidateZoom = Number(state?.zoom);
  if (Number.isFinite(candidateZoom)) {
    zoom = clamp(candidateZoom, MIN_ZOOM, MAX_ZOOM);
  }

  isCompletedSectionCollapsed = Boolean(state?.menuSections?.completed);
  isTrashSectionCollapsed = Boolean(state?.menuSections?.trash);
  isSidebarCollapsed = Boolean(state?.sidebarCollapsed);

  syncTasksFromActiveBoard();
};

const restoreConnectedDataFile = async () => {
  if (!window.showOpenFilePicker) {
    return false;
  }

  try {
    const storedHandle = await readStoredFileHandle();
    if (!storedHandle) {
      return false;
    }

    const hasPermission = await ensureFilePermission(storedHandle, true);
    if (!hasPermission) {
      return false;
    }

    const file = await storedHandle.getFile();
    const text = await file.text();

    dataFileHandle = storedHandle;
    if (text.trim()) {
      restoreStateFromFile(JSON.parse(text));
    } else {
      loadDefaultState();
    }

    return true;
  } catch (error) {
    await clearStoredFileHandle().catch(() => {
      // ignore IndexedDB cleanup failures
    });
    return false;
  }
};

const connectDataFile = async () => {
  if (!window.showOpenFilePicker) {
    window.alert('File storage needs a Chromium-based browser and localhost/https context.');
    return;
  }

  try {
    const [handle] = await window.showOpenFilePicker({
      multiple: false,
      types: [
        {
          description: 'TaskTrack data',
          accept: {
            'application/json': ['.json'],
          },
        },
      ],
    });

    const hasPermission = await ensureFilePermission(handle, true);
    if (!hasPermission) {
      return;
    }

    dataFileHandle = handle;
    await storeFileHandle(dataFileHandle);

    const file = await dataFileHandle.getFile();
    const text = await file.text();

    if (text.trim()) {
      restoreStateFromFile(JSON.parse(text));
    } else {
      loadDefaultState();
    }

    await persistStateToFile();
    render();
  } catch (error) {
    // user cancelled picker or parse/write failed
  }
};

const saveBoards = () => {
  requestPersist();
};

const saveTasks = () => {
  const board = getActiveBoard();
  if (!board) {
    return;
  }

  board.tasks = normalizeTasks(tasks);
  saveBoards();
};

const loadBoards = () => {
  loadDefaultState();
};

const addBoard = () => {
  const nextId = (boards.at(-1)?.id ?? 0) + 1;
  boards.push(createBoard(nextId, `Board ${boards.length + 1}`, [], [], 1));
  activeBoardId = nextId;
  syncTasksFromActiveBoard();
  saveBoards();
  render();
};

const switchBoard = (id) => {
  if (id === activeBoardId || !boards.some((board) => board.id === id)) {
    return;
  }

  saveTasks();
  activeBoardId = id;
  syncTasksFromActiveBoard();
  saveBoards();
  render();
};

const renameBoard = (id) => {
  const board = boards.find((item) => item.id === id);
  if (!board) {
    return;
  }

  const nextName = window.prompt('Gi board et navn', board.name)?.trim();
  if (!nextName) {
    return;
  }

  board.name = nextName;
  saveBoards();
  render();
};

const deleteBoard = (id) => {
  if (boards.length <= 1) {
    return;
  }

  const board = boards.find((item) => item.id === id);
  if (!board || !window.confirm(`Slette board "${board.name}"?`)) {
    return;
  }

  const boardIndex = boards.findIndex((item) => item.id === id);
  boards.splice(boardIndex, 1);
  if (activeBoardId === id) {
    activeBoardId = boards[0].id;
    syncTasksFromActiveBoard();
  }
  saveBoards();
  render();
};

const emptyTrash = () => {
  const board = getActiveBoard();
  if (!board || !board.trashedTasks?.length) {
    return;
  }

  if (!window.confirm('Empty trash for this board?')) {
    return;
  }

  board.trashedTasks = [];
  saveBoards();
  render();
};

const saveMenuSections = () => {
  requestPersist();
};

const loadMenuSections = () => {
  // loaded from file state when connected
};

const saveSidebarState = () => {
  requestPersist();
};

const loadSidebarState = () => {
  // loaded from file state when connected
};

const toggleSidebar = () => {
  isSidebarCollapsed = !isSidebarCollapsed;
  saveSidebarState();
  render();
};

const toggleMenuSection = (section) => {
  if (section === 'completed') {
    isCompletedSectionCollapsed = !isCompletedSectionCollapsed;
  }

  if (section === 'trash') {
    isTrashSectionCollapsed = !isTrashSectionCollapsed;
  }

  saveMenuSections();
  render();
};

const saveZoom = () => {
  requestPersist();
};

const loadZoom = () => {
  // loaded from file state when connected
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getWheelZoomDelta = (deltaY) => {
  const scaledDelta = -deltaY * WHEEL_ZOOM_SENSITIVITY;
  return clamp(scaledDelta, -0.04, 0.04);
};

const updateZoomLabel = () => {
  const zoomValue = document.querySelector('[data-zoom-value]');
  if (zoomValue) {
    zoomValue.textContent = `${Math.round(zoom * 100)}%`;
  }
};

const showZoomIndicator = () => {
  const zoomIndicator = document.querySelector('[data-zoom-indicator]');
  if (!zoomIndicator) {
    return;
  }

  zoomIndicator.classList.add('is-visible');
  clearTimeout(zoomIndicatorTimer);
  zoomIndicatorTimer = window.setTimeout(() => {
    zoomIndicator.classList.remove('is-visible');
  }, 900);
};

const setDraggingState = (isDragging) => {
  document.body.classList.toggle('is-dragging-task', isDragging);
};

const removeDragPreview = () => {
  dragPreviewElement?.remove();
  dragPreviewElement = null;
};

const getTaskColumns = () => Array.from(document.querySelectorAll('[data-task-column]'));

const previewTaskReorder = (fromTaskId, overTaskId) => {
  if (!fromTaskId || !overTaskId || fromTaskId === overTaskId) {
    return;
  }

  const boardElement = document.querySelector('[data-board]');
  if (!boardElement) {
    return;
  }

  const columns = getTaskColumns();
  const fromColumn = columns.find((column) => Number(column.dataset.taskId) === fromTaskId);
  const overColumn = columns.find((column) => Number(column.dataset.taskId) === overTaskId);
  if (!fromColumn || !overColumn || fromColumn === overColumn) {
    return;
  }

  const fromIndex = columns.indexOf(fromColumn);
  const overIndex = columns.indexOf(overColumn);
  if (fromIndex === -1 || overIndex === -1 || fromIndex === overIndex) {
    return;
  }

  if (fromIndex < overIndex) {
    boardElement.insertBefore(fromColumn, overColumn.nextSibling);
  } else {
    boardElement.insertBefore(fromColumn, overColumn);
  }

  didPreviewReorder = true;
};

const getPreviewedIndexForTask = (taskId) =>
  getTaskColumns().findIndex((column) => Number(column.dataset.taskId) === taskId);

const createDragPreview = (taskElement) => {
  removeDragPreview();

  const preview = taskElement.cloneNode(true);
  preview.classList.add('task-card-drag-preview');
  preview.style.width = `${taskElement.offsetWidth}px`;
  preview.style.height = `${taskElement.offsetHeight}px`;
  preview.style.position = 'fixed';
  preview.style.top = '-9999px';
  preview.style.left = '-9999px';
  preview.style.transform = `scale(${zoom})`;
  preview.style.transformOrigin = 'top left';
  preview.querySelectorAll('input, textarea, button').forEach((element) => {
    element.setAttribute('tabindex', '-1');
  });

  document.body.append(preview);
  dragPreviewElement = preview;
  return preview;
};

const clearDragState = () => {
  draggedTaskId = null;
  draggedTaskElement?.classList.remove('is-dragging-source');
  draggedTaskElement = null;
  removeDragPreview();
  setDraggingState(false);
  didHandleDragDrop = false;
  didPreviewReorder = false;
  document.querySelectorAll('[data-task-column].is-drop-target').forEach((column) => {
    column.classList.remove('is-drop-target');
  });
  document.querySelector('[data-trash-zone]')?.classList.remove('is-over');
};

const applyZoom = ({ showIndicator = false } = {}) => {
  const board = document.querySelector('[data-board]');
  if (!board) {
    return;
  }

  board.style.setProperty('--zoom', zoom.toString());
  updateZoomLabel();
  if (showIndicator) {
    showZoomIndicator();
  }
};

const setZoom = (nextZoom, { showIndicator = true } = {}) => {
  zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
  saveZoom();
  applyZoom({ showIndicator });
};

const addTask = () => {
  const board = getActiveBoard();
  if (!board) {
    return;
  }

  const nextId = board.nextTaskNumber;
  board.nextTaskNumber += 1;
  tasks.push(createTask(nextId));
  saveTasks();
  render();
};

const updateTask = (id, key, value) => {
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return;
  }

  task[key] = value;
  saveTasks();
};

const setTaskWidth = (id, nextWidth, { persist = false } = {}) => {
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return;
  }

  task.width = clampTaskWidth(nextWidth);
  if (persist) {
    saveTasks();
  }
};

const deleteTask = (id) => {
  const taskIndex = tasks.findIndex((item) => item.id === id);
  if (taskIndex === -1) {
    return;
  }

  const [removedTask] = tasks.splice(taskIndex, 1);
  const board = getActiveBoard();
  if (board && removedTask) {
    board.trashedTasks = board.trashedTasks ?? [];
    board.trashedTasks.push({
      ...removedTask,
      deletedAt: Date.now(),
    });
  }
  saveTasks();
  render();
};

const toggleTaskCompleted = (id) => {
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return;
  }

  task.completed = !task.completed;
  saveTasks();
  render();
};

const addTaskNote = (taskId, text) => {
  const task = tasks.find((item) => item.id === taskId);
  const noteText = text.trim();
  if (!task || !noteText) {
    return;
  }

  task.notes.push({
    text: noteText,
    createdAt: Date.now(),
  });

  saveTasks();
  render();
};

const moveTaskToIndex = (taskId, toIndex) => {
  const fromIndex = tasks.findIndex((task) => task.id === taskId);
  if (fromIndex === -1 || toIndex < 0 || toIndex >= tasks.length || fromIndex === toIndex) {
    return;
  }


  const [task] = tasks.splice(fromIndex, 1);
  tasks.splice(toIndex, 0, task);
  saveTasks();
  render();
};

const taskCard = (task) => {
  const timelineHtml = getTimelineHtml(task.notes, task.completed);

  return `
  <section class="task-column" data-task-column data-task-id="${task.id}" style="--task-width: ${clampTaskWidth(task.width)}px;">
    <article class="task-card ${task.completed ? 'is-completed' : ''}" data-task-card data-task-id="${task.id}">
      <div class="task-card-header">
        <button
          class="complete-task-button"
          type="button"
          aria-label="${task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}"
          title="${task.completed ? 'Completed' : 'Mark complete'}"
          data-toggle-complete
          data-task-id="${task.id}"
        >
          <i class="bi ${task.completed ? 'bi-check-circle-fill' : 'bi-circle'}" aria-hidden="true"></i>
        </button>
        <button
          class="drag-task-button"
          type="button"
          draggable="true"
          aria-label="Drag task ${task.id} to trash"
          title="Drag to trash"
          data-drag-task
          data-task-id="${task.id}"
        >
          ⋮⋮
        </button>
        <input
          class="task-title"
          type="text"
          value="${escapeHtml(task.title)}"
          aria-label="Task title ${task.id}"
          data-task-input="title"
          data-task-id="${task.id}"
        />
      </div>
      <textarea
        class="task-details task-details-input"
        rows="8"
        placeholder="${DETAILS_PLACEHOLDER}"
        aria-label="Task details ${task.id}"
        data-task-input="details"
        data-task-id="${task.id}"
      >${escapeHtml(task.details)}</textarea>
      <div class="task-links-preview" data-task-links-preview data-task-id="${task.id}">
        ${getDetailsPreviewHtml(task.details)}
      </div>
      <button
        class="task-resize-handle"
        type="button"
        aria-label="Resize task ${task.id}"
        title="Drag to resize"
        data-resize-task
        data-task-id="${task.id}"
      ></button>
    </article>
    <section class="task-timeline">
      <ul class="timeline-list ${timelineHtml.trim() ? '' : 'is-empty'}" data-timeline-list>
        ${timelineHtml}
      </ul>
      <div class="timeline-compose">
        <button class="timeline-plus-button" type="button" aria-label="Add status note" data-open-note-composer data-task-id="${task.id}">+</button>
        <div class="timeline-compose-box" data-note-composer>
          <input
            class="timeline-note-draft"
            type="text"
            placeholder="Write status"
            aria-label="Write status note for task ${task.id}"
            data-note-draft
            data-task-id="${task.id}"
          />
          <button class="timeline-done-button" type="button" data-note-done data-task-id="${task.id}">Done</button>
        </div>
      </div>
    </section>
  </section>
`;
};

const taskMenuPreview = (task) => `
  <li class="menu-task-item">${escapeHtml(task.title)}</li>
`;

const boardMenuItem = (board) => `
  <li class="board-menu-item ${board.id === activeBoardId ? 'is-active' : ''}">
    <button class="board-menu-switch" type="button" data-switch-board data-board-id="${board.id}">${escapeHtml(board.name)}</button>
    <button class="board-menu-icon" type="button" aria-label="Gi nytt navn" data-rename-board data-board-id="${board.id}">
      <i class="bi bi-pencil" aria-hidden="true"></i>
    </button>
    <button class="board-menu-icon" type="button" aria-label="Slett board" data-delete-board data-board-id="${board.id}" ${boards.length <= 1 ? 'disabled' : ''}>
      <i class="bi bi-trash3" aria-hidden="true"></i>
    </button>
  </li>
`;

const render = () => {
  const activeBoard = getActiveBoard();
  const completedTasks = tasks.filter((task) => task.completed);
  const trashedTasks = activeBoard?.trashedTasks ?? [];

  app.innerHTML = `
    <main class="shell ${isSidebarCollapsed ? 'is-sidebar-collapsed' : ''}">
      <aside class="left-menu ${isSidebarCollapsed ? 'is-collapsed' : ''}" aria-hidden="false">
        <div class="left-menu-topbar">
          <button class="left-menu-collapse-button" type="button" aria-label="${isSidebarCollapsed ? 'Expand sidebar' : 'Minimize sidebar'}" data-toggle-sidebar>
            <i class="bi ${isSidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}" aria-hidden="true"></i>
          </button>
          <button class="left-menu-file-button" type="button" data-connect-file>${dataFileHandle ? 'File connected' : 'Open data file'}</button>
        </div>
        <div class="left-menu-head">
          <h2 class="left-menu-title">Boards</h2>
          <button class="left-menu-add-board" type="button" aria-label="Nytt board" data-add-board>+</button>
        </div>
        <ul class="board-menu-list">
          ${boards.map(boardMenuItem).join('')}
        </ul>

        <section class="menu-section">
          <button class="menu-section-toggle" type="button" data-toggle-menu-section="completed" aria-expanded="${!isCompletedSectionCollapsed}">
            <h3 class="menu-section-title">Completed (${completedTasks.length})</h3>
            <i class="bi ${isCompletedSectionCollapsed ? 'bi-chevron-right' : 'bi-chevron-down'}" aria-hidden="true"></i>
          </button>
          <ul class="menu-task-list ${isCompletedSectionCollapsed ? 'is-collapsed' : ''}">
            ${completedTasks.length ? completedTasks.map(taskMenuPreview).join('') : '<li class="menu-task-empty">No completed tasks</li>'}
          </ul>
        </section>

        <section class="menu-section">
          <div class="menu-section-head">
            <button class="menu-section-toggle" type="button" data-toggle-menu-section="trash" aria-expanded="${!isTrashSectionCollapsed}">
              <h3 class="menu-section-title">Trash (${trashedTasks.length})</h3>
              <i class="bi ${isTrashSectionCollapsed ? 'bi-chevron-right' : 'bi-chevron-down'}" aria-hidden="true"></i>
            </button>
          </div>
          <ul class="menu-task-list ${isTrashSectionCollapsed ? 'is-collapsed' : ''}">
            ${trashedTasks.length ? trashedTasks.map(taskMenuPreview).join('') : '<li class="menu-task-empty">Trash is empty</li>'}
          </ul>
          <button class="menu-section-action menu-section-action-bottom ${isTrashSectionCollapsed ? 'is-collapsed' : ''}" type="button" data-empty-trash ${trashedTasks.length ? '' : 'disabled'}>Empty</button>
        </section>
      </aside>

      <div class="toolbar">
        <button class="add-task-button" type="button" aria-label="Add task" data-add-task>
          +
        </button>
      </div>

      <section class="board-viewport" data-viewport>
        <div class="board" data-board>
          ${tasks.map(taskCard).join('')}
        </div>
      </section>

      <div class="zoom-indicator" data-zoom-indicator aria-hidden="true">
        <span class="zoom-value" data-zoom-value>${Math.round(zoom * 100)}%</span>
      </div>

      <div class="trash-zone" data-trash-zone aria-label="Trash drop zone">
        <i class="trash-zone-icon bi bi-trash3" aria-hidden="true"></i>
      </div>
    </main>
  `;

  document.querySelector('[data-toggle-sidebar]')?.addEventListener('click', toggleSidebar);
  document.querySelector('[data-connect-file]')?.addEventListener('click', () => {
    void connectDataFile();
  });

  document.querySelector('[data-add-board]')?.addEventListener('click', addBoard);

  document.querySelectorAll('[data-switch-board]').forEach((element) => {
    element.addEventListener('click', (event) => {
      const id = Number(event.currentTarget.dataset.boardId);
      switchBoard(id);
    });
  });

  document.querySelectorAll('[data-rename-board]').forEach((element) => {
    element.addEventListener('click', (event) => {
      const id = Number(event.currentTarget.dataset.boardId);
      renameBoard(id);
    });
  });

  document.querySelectorAll('[data-delete-board]').forEach((element) => {
    element.addEventListener('click', (event) => {
      const id = Number(event.currentTarget.dataset.boardId);
      deleteBoard(id);
    });
  });

  document.querySelector('[data-empty-trash]')?.addEventListener('click', emptyTrash);

  document.querySelectorAll('[data-toggle-menu-section]').forEach((element) => {
    element.addEventListener('click', (event) => {
      const section = event.currentTarget.dataset.toggleMenuSection;
      toggleMenuSection(section);
    });
  });

  document.querySelectorAll('[data-toggle-complete]').forEach((element) => {
    element.addEventListener('click', (event) => {
      const id = Number(event.currentTarget.dataset.taskId);
      toggleTaskCompleted(id);
    });
  });

  document.querySelector('[data-add-task]')?.addEventListener('click', addTask);

  document.querySelectorAll('[data-drag-task]').forEach((element) => {
    element.addEventListener('dragstart', (event) => {
      const target = event.currentTarget;
      const id = Number(target.dataset.taskId);
      const taskElement = target.closest('[data-task-card]');
      didHandleDragDrop = false;
      didPreviewReorder = false;
      draggedTaskId = id;
      draggedTaskElement = taskElement;
      draggedTaskElement?.classList.add('is-dragging-source');
      event.dataTransfer?.setData('text/plain', String(id));
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        if (taskElement) {
          const preview = createDragPreview(taskElement);
          event.dataTransfer.setDragImage(preview, taskElement.getBoundingClientRect().width / 2, 28);
        }
      }
      setDraggingState(true);
    });

    element.addEventListener('dragend', () => {
      if (!didHandleDragDrop && didPreviewReorder) {
        clearDragState();
        render();
        return;
      }

      clearDragState();
    });
  });

  document.querySelectorAll('[data-task-column]').forEach((element) => {
    element.addEventListener('dragover', (event) => {
      if (!draggedTaskId) {
        return;
      }

      event.preventDefault();
      const overTaskId = Number(element.dataset.taskId);
      previewTaskReorder(draggedTaskId, overTaskId);

      document.querySelectorAll('[data-task-column].is-drop-target').forEach((column) => {
        if (column !== element) {
          column.classList.remove('is-drop-target');
        }
      });
      element.classList.add('is-drop-target');

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
    });

    element.addEventListener('dragleave', () => {
      element.classList.remove('is-drop-target');
    });

    element.addEventListener('drop', (event) => {
      event.preventDefault();
      element.classList.remove('is-drop-target');

      if (!draggedTaskId) {
        return;
      }

      const fromTaskId = draggedTaskId;
      const toIndex = getPreviewedIndexForTask(fromTaskId);
      didHandleDragDrop = true;
      clearDragState();

      if (toIndex >= 0) {
        moveTaskToIndex(fromTaskId, toIndex);
      }
    });
  });

  const trashZone = document.querySelector('[data-trash-zone]');
  trashZone?.addEventListener('dragover', (event) => {
    if (!draggedTaskId) {
      return;
    }

    event.preventDefault();
    trashZone.classList.add('is-over');
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  });

  trashZone?.addEventListener('dragleave', () => {
    trashZone.classList.remove('is-over');
  });

  trashZone?.addEventListener('drop', (event) => {
    event.preventDefault();
    const droppedTaskId = draggedTaskId ?? Number(event.dataTransfer?.getData('text/plain'));
    didHandleDragDrop = true;
    clearDragState();
    if (droppedTaskId) {
      deleteTask(droppedTaskId);
    }
  });

  document.querySelectorAll('[data-resize-task]').forEach((element) => {
    element.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const handle = event.currentTarget;
      const taskId = Number(handle.dataset.taskId);
      const column = handle.closest('[data-task-column]');
      const task = tasks.find((item) => item.id === taskId);
      if (!taskId || !column || !task) {
        return;
      }

      const pointerId = event.pointerId;
      const startX = event.clientX;
      const startWidth = clampTaskWidth(task.width || column.getBoundingClientRect().width);

      handle.setPointerCapture?.(pointerId);

      const onPointerMove = (moveEvent) => {
        if (moveEvent.pointerId !== pointerId) {
          return;
        }

        const delta = (moveEvent.clientX - startX) / zoom;
        const nextWidth = clampTaskWidth(startWidth + delta);
        setTaskWidth(taskId, nextWidth);
        column.style.setProperty('--task-width', `${nextWidth}px`);
      };

      const stopResize = (finishEvent) => {
        if (finishEvent.pointerId !== pointerId) {
          return;
        }

        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', stopResize);
        window.removeEventListener('pointercancel', stopResize);
        handle.releasePointerCapture?.(pointerId);
        setTaskWidth(taskId, task.width, { persist: true });
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', stopResize);
      window.addEventListener('pointercancel', stopResize);
    });
  });

  document.querySelectorAll('[data-task-input="title"]').forEach((element) => {
    element.addEventListener('input', (event) => {
      const target = event.currentTarget;
      const id = Number(target.dataset.taskId);
      const key = target.dataset.taskInput;
      updateTask(id, key, target.value);
    });
  });

  document.querySelectorAll('[data-task-links-preview]').forEach((element) => {
    element.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a')) {
        return;
      }

      const card = element.closest('[data-task-card]');
      const input = card?.querySelector('[data-task-input="details"]');
      if (!(input instanceof HTMLTextAreaElement)) {
        return;
      }

      card?.classList.add('is-editing-details');
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    });
  });

  document.querySelectorAll('[data-task-input="details"]').forEach((element) => {
    element.addEventListener('input', (event) => {
      const target = event.currentTarget;
      const id = Number(target.dataset.taskId);
      updateTask(id, 'details', target.value);

      const preview = target.closest('[data-task-card]')?.querySelector('[data-task-links-preview]');
      if (preview) {
        preview.innerHTML = getDetailsPreviewHtml(target.value);
      }
    });

    element.addEventListener('blur', (event) => {
      event.currentTarget.closest('[data-task-card]')?.classList.remove('is-editing-details');
    });
  });

  document.querySelectorAll('[data-open-note-composer]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.stopPropagation();
      const target = event.currentTarget;
      document.querySelectorAll('.task-column.is-adding-note').forEach((columnElement) => {
        if (columnElement !== target.closest('[data-task-column]')) {
          columnElement.classList.remove('is-adding-note');
          const existingDraft = columnElement.querySelector('[data-note-draft]');
          if (existingDraft instanceof HTMLInputElement) {
            existingDraft.value = '';
          }
        }
      });

      const column = target.closest('[data-task-column]');
      const draft = column?.querySelector('[data-note-draft]');
      if (!(draft instanceof HTMLInputElement)) {
        return;
      }

      column?.classList.add('is-adding-note');
      draft.focus();
    });
  });

  document.querySelectorAll('[data-note-done]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.stopPropagation();
      const target = event.currentTarget;
      const taskId = Number(target.dataset.taskId);
      const column = target.closest('[data-task-column]');
      const draft = column?.querySelector('[data-note-draft]');
      if (!(draft instanceof HTMLInputElement)) {
        return;
      }

      const noteText = draft.value;
      if (noteText.trim()) {
        addTaskNote(taskId, noteText);
        return;
      }

      column?.classList.remove('is-adding-note');
      draft.value = '';
    });
  });

  document.querySelectorAll('[data-note-draft]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    element.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        const target = event.currentTarget;
        target.closest('[data-task-column]')?.classList.remove('is-adding-note');
        target.value = '';
        return;
      }

      if (event.key !== 'Enter') {
        return;
      }

      event.preventDefault();
      const target = event.currentTarget;
      const taskId = Number(target.dataset.taskId);
      addTaskNote(taskId, target.value);
    });
  });

  document.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('[data-note-composer], [data-open-note-composer]')) {
      return;
    }

    document.querySelectorAll('.task-column.is-adding-note').forEach((columnElement) => {
      columnElement.classList.remove('is-adding-note');
      const draft = columnElement.querySelector('[data-note-draft]');
      if (draft instanceof HTMLInputElement) {
        draft.value = '';
      }
    });
  });

  const viewport = document.querySelector('[data-viewport]');
  viewport?.addEventListener(
    'wheel',
    (event) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      event.preventDefault();
      setZoom(zoom + getWheelZoomDelta(event.deltaY));
    },
    { passive: false },
  );

  window.onkeydown = (event) => {
    if (!event.metaKey && !event.ctrlKey) {
      return;
    }

    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      setZoom(zoom + KEYBOARD_ZOOM_STEP);
    }

    if (event.key === '-') {
      event.preventDefault();
      setZoom(zoom - KEYBOARD_ZOOM_STEP);
    }
  };

  applyZoom({ showIndicator: false });
};

const start = async () => {
  loadBoards();
  loadZoom();
  loadMenuSections();
  loadSidebarState();
  await restoreConnectedDataFile();
  render();
};

void start();
