# TaskTrack

A lightweight local-first task board built with Vite + vanilla JavaScript.

TaskTrack is designed for personal planning with horizontal task cards, board organization, timeline updates, drag-and-drop workflows, and local JSON file persistence.

## Features

- Multiple boards (create, switch, rename with double-click, delete)
- Horizontal task cards with zoom support
- Drag-and-drop task reordering with live preview
- Drag tasks to trash + undo toast
- Completed + trash sections in sidebar
- Task timeline notes per card
- Click-to-edit task details with URL preview/linking
- Task card width resize by dragging card edge
- Search/filter tasks
- Hide/show completed tasks on board
- Board reordering by drag handle
- Board task count badges
- Auto-save indicator (shown for task edits, timeline updates, completion toggles)

## Persistence model

TaskTrack does **not** rely on `localStorage` for task content.

- Data is stored in a user-selected local `.json` file.
- The app reconnects to the selected file on refresh when permission is available.
- Works best in Chromium-based browsers with File System Access API support.

## Tech stack

- [Vite](https://vitejs.dev/)
- Vanilla JavaScript (ES modules)
- CSS
- Bootstrap Icons

## Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Usage notes

1. Open the app.
2. Click **Open data file** and select your `notes.json` (or another `.json` file).
3. Start creating boards/tasks.

## Keyboard / interaction highlights

- `Cmd/Ctrl` + `+` / `-` to zoom board
- `Cmd/Ctrl` + trackpad/mouse wheel to zoom
- Double-click board name to rename
- Drag task handle to reorder or move to trash
- Drag board handle in sidebar to reorder boards

## Project structure

- [index.html](index.html)
- [src/main.js](src/main.js)
- [src/styles.css](src/styles.css)
- [package.json](package.json)

## License

MIT (recommended). Add a `LICENSE` file if publishing publicly.
