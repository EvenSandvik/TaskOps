# TaskTrack

A lightweight local-first task board built with Vite + vanilla JavaScript.

TaskTrack is designed for personal planning with horizontal task cards, board organization, timeline updates, drag-and-drop workflows, and local JSON file persistence.

The project can now run as a desktop app through Electron, with automatic local file persistence and no browser startup flow.

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

Do not open `index.html` directly from disk. This is a Vite app, and opening it over `file://` can trigger browser CORS or ES module loading errors.

Use the localhost URL printed by Vite instead.

### Desktop app

```bash
npm start
```

That builds the frontend and opens TaskTrack in its own desktop window.

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
2. In the desktop app, data is saved automatically to the app data folder.
3. In the web version, click **Open data file** and select your `notes.json` (or another `.json` file).
4. Start creating boards/tasks.

If the browser says the app is blocked by CORS, you are almost certainly opening the app the wrong way. Run `npm run dev` or `npm run preview` and use the served URL instead of opening the HTML file directly.

## Keyboard / interaction highlights

- `Cmd/Ctrl` + `+` / `-` to zoom board
- `Cmd/Ctrl` + trackpad/mouse wheel to zoom
- Double-click board name to rename
- Drag task handle to reorder or move to trash
- Drag board handle in sidebar to reorder boards

## Project structure

- [index.html](index.html)
- [electron/main.js](electron/main.js)
- [electron/preload.cjs](electron/preload.cjs)
- [src/main.js](src/main.js)
- [src/styles.css](src/styles.css)
- [package.json](package.json)

## License

MIT (recommended). Add a `LICENSE` file if publishing publicly.
