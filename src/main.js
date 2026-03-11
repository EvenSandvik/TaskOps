import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';

const STORAGE_KEY = 'tasktrack.tasks';
const ZOOM_STORAGE_KEY = 'tasktrack.zoom';
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;
const KEYBOARD_ZOOM_STEP = 0.05;
const WHEEL_ZOOM_SENSITIVITY = 0.0022;
const URL_PATTERN = /(https?:\/\/[^\s<>"]+)/gi;
const DETAILS_PLACEHOLDER = 'Write the task here...';
const tasks = [];
let zoom = 1;
let zoomIndicatorTimer;
let draggedTaskId = null;
let draggedTaskElement = null;
let dragPreviewElement = null;
let isMenuOpen = false;

const app = document.querySelector('#app');

const createTask = (id) => ({
  id,
  title: `Task ${id}`,
  details: '',
  notes: [],
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

const getTimelineHtml = (notes) => {
  if (!notes.length) {
    return '';
  }

  return notes
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
};

const saveTasks = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const loadTasks = () => {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (!storedTasks) {
      return;
    }

    const parsedTasks = JSON.parse(storedTasks);
    if (!Array.isArray(parsedTasks)) {
      return;
    }

    tasks.splice(
      0,
      tasks.length,
      ...parsedTasks.map((task, index) => ({
        id: Number(task.id) || index + 1,
        title: typeof task.title === 'string' && task.title.trim() ? task.title : `Task ${index + 1}`,
        details: typeof task.details === 'string' ? task.details : '',
        notes: Array.isArray(task.notes)
          ? task.notes
              .map((note) => ({
                text: typeof note?.text === 'string' ? note.text : '',
                createdAt: Number(note?.createdAt) || Date.now(),
              }))
              .filter((note) => note.text.trim())
          : [],
      })),
    );
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const saveZoom = () => {
  localStorage.setItem(ZOOM_STORAGE_KEY, String(zoom));
};

const loadZoom = () => {
  const storedZoom = Number(localStorage.getItem(ZOOM_STORAGE_KEY));
  if (Number.isFinite(storedZoom)) {
    zoom = clamp(storedZoom, MIN_ZOOM, MAX_ZOOM);
  }
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
  const nextId = (tasks.at(-1)?.id ?? 0) + 1;
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

const deleteTask = (id) => {
  const taskIndex = tasks.findIndex((item) => item.id === id);
  if (taskIndex === -1) {
    return;
  }

  tasks.splice(taskIndex, 1);
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

const taskCard = (task) => `
  <section class="task-column" data-task-column data-task-id="${task.id}">
    <article class="task-card" data-task-card data-task-id="${task.id}">
      <div class="task-card-header">
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
    </article>
    <section class="task-timeline">
      <ul class="timeline-list ${task.notes.length ? '' : 'is-empty'}" data-timeline-list>
        ${getTimelineHtml(task.notes)}
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

const render = () => {
  app.innerHTML = `
    <main class="shell">
      <div class="menu-overlay ${isMenuOpen ? 'is-open' : ''}" data-menu-overlay></div>
      <aside class="left-menu ${isMenuOpen ? 'is-open' : ''}" aria-hidden="${isMenuOpen ? 'false' : 'true'}">
        <h2 class="left-menu-title">Meny</h2>
        <p class="left-menu-text">Her kan du senere legge inn filter, prosjekter eller tags.</p>
      </aside>

      <div class="toolbar">
        <button class="menu-toggle-button" type="button" aria-label="Åpne/lukk meny" data-toggle-menu>
          <i class="bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'}" aria-hidden="true"></i>
        </button>
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

  document.querySelector('[data-toggle-menu]')?.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    render();
  });

  document.querySelector('[data-menu-overlay]')?.addEventListener('click', () => {
    if (!isMenuOpen) {
      return;
    }

    isMenuOpen = false;
    render();
  });

  document.querySelector('[data-add-task]')?.addEventListener('click', addTask);

  document.querySelectorAll('[data-drag-task]').forEach((element) => {
    element.addEventListener('dragstart', (event) => {
      const target = event.currentTarget;
      const id = Number(target.dataset.taskId);
      const taskElement = target.closest('[data-task-card]');
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
      clearDragState();
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
    clearDragState();
    if (droppedTaskId) {
      deleteTask(droppedTaskId);
    }
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

loadTasks();
loadZoom();
render();
