import './styles.css';

const STORAGE_KEY = 'tasktrack.tasks';
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;
const KEYBOARD_ZOOM_STEP = 0.05;
const WHEEL_ZOOM_SENSITIVITY = 0.0022;
const tasks = [];
let zoom = 1;
let zoomIndicatorTimer;

const app = document.querySelector('#app');

const createTask = (id) => ({
  id,
  title: `Task ${id}`,
  details: '',
});

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
      })),
    );
  } catch {
    localStorage.removeItem(STORAGE_KEY);
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

const taskCard = (task) => `
  <article class="task-card">
    <input
      class="task-title"
      type="text"
      value="${task.title}"
      aria-label="Task title ${task.id}"
      data-task-input="title"
      data-task-id="${task.id}"
    />
    <textarea
      class="task-details"
      rows="8"
      placeholder="Write the task here..."
      aria-label="Task details ${task.id}"
      data-task-input="details"
      data-task-id="${task.id}"
    >${task.details}</textarea>
  </article>
`;

const render = () => {
  app.innerHTML = `
    <main class="shell">
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
    </main>
  `;

  document.querySelector('[data-add-task]')?.addEventListener('click', addTask);

  document.querySelectorAll('[data-task-input]').forEach((element) => {
    element.addEventListener('input', (event) => {
      const target = event.currentTarget;
      const id = Number(target.dataset.taskId);
      const key = target.dataset.taskInput;
      updateTask(id, key, target.value);
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
render();
