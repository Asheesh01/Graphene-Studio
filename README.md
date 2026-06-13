# TaskFlow — Personal Task Manager

> **Exercise 1** from the Studio Graphene take-home brief.
>
> TaskFlow is a full-stack personal task manager built with Node.js + Express on the backend and React 18 + Vite on the frontend. It lets you create, edit, complete, and delete tasks with priorities, due-date countdowns, drag-and-drop reordering, search/filter, dark/light mode, and keyboard shortcuts — all persisted to a JSON file on the server so tasks survive restarts.

---

## Live Demo

| Layer | URL |
|-------|-----|
| **Frontend** | **https://graphene-studio.vercel.app** |
| **Backend** | **https://taskflow-api-rxoc.onrender.com** |

> ⚠️ The backend runs on Render's **free tier** — the first request after a period of inactivity may take up to **50 seconds** to wake the server. Subsequent requests are instant.

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Backend runtime** | Node.js 18 | LTS, widely supported, zero install friction |
| **Backend framework** | Express 4 | Minimal, un-opinionated; easy to structure into MVC layers without boilerplate |
| **Persistence** | JSON file (`data/tasks.json`) | Zero external dependencies — no database to provision; survives server restarts; readable in any text editor |
| **Unique IDs** | `uuid` (v4) | Collision-free task IDs without a database sequence |
| **Environment config** | `dotenv` | Keeps secrets and paths out of source code |
| **Frontend framework** | React 18 | Component model maps cleanly to a card-based UI; hooks make state management concise |
| **Frontend build tool** | Vite 5 | Sub-second HMR, native ESM, minimal config |
| **Drag-and-drop** | `@dnd-kit/core` + `@dnd-kit/sortable` | Accessible (keyboard + pointer), tree-shakeable, no jQuery dependency |
| **HTTP client** | Axios | Automatic JSON parsing, clean interceptor support |
| **Styling** | Vanilla CSS with CSS custom properties | Full control over the design system; dark/light theming with a single `data-theme` attribute swap; no build-time CSS-in-JS overhead |
| **Testing** | Jest + Supertest | Fast unit tests; Supertest spins up the Express app in-process (no real port needed) |
| **Dev server** | Nodemon | Auto-restarts on file changes during development |

---

## How to Run Locally

> **Assumption:** Node.js ≥ 18 is installed. No other global tools are required.

```bash
# 1. Clone the repository
git clone https://github.com/Asheesh01/Graphene-Studio.git
cd Graphene-Studio

# 2. Start the backend (runs on http://localhost:5000)
cd server
npm install
npm run dev

# 3. Open a second terminal — start the frontend (runs on http://localhost:3000)
cd ../client
npm install
npm run dev

# 4. Open your browser at http://localhost:3000
```

The Vite dev server automatically **proxies** all `/api/*` requests to `http://localhost:5000`, so there is no CORS configuration needed during development.

### Optional Environment Variables

Copy `server/.env.example` to `server/.env` to override defaults:

```bash
cp server/.env.example server/.env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Port the Express server listens on |
| `DATA_FILE` | `./data/tasks.json` | Path (relative to `server/`) where tasks are persisted |
| `CLIENT_ORIGIN` | `*` | CORS allowed origin — set to your frontend URL in production |

### Running Tests

```bash
cd server
npm test
```

Runs 13 Jest + Supertest tests covering health, CRUD, toggle, reorder, and validation — all passing.

---

## API Documentation

**Base URL (local):** `http://localhost:5000`  
**Base URL (production):** `https://taskflow-api-rxoc.onrender.com`

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/tasks` | List all tasks |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `PATCH` | `/api/tasks/:id/toggle` | Toggle completed status |
| `PATCH` | `/api/tasks/reorder` | Reorder tasks |
| `DELETE` | `/api/tasks/:id` | Delete a task |

---

### `GET /api/health`
**Response `200`**
```json
{ "status": "ok", "timestamp": "2026-06-13T18:00:00.000Z" }
```

---

### `GET /api/tasks`
Returns all tasks sorted by `order` ascending.

**Response `200`**
```json
[
  {
    "id": "uuid-v4",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "dueDate": "2026-06-15",
    "priority": "high",
    "completed": false,
    "order": 0,
    "createdAt": "2026-06-11T18:00:00.000Z",
    "updatedAt": "2026-06-11T18:00:00.000Z"
  }
]
```

---

### `POST /api/tasks`
**Request body**
```json
{
  "title": "Buy groceries",       // required — non-empty string
  "description": "Milk, eggs",    // optional string
  "dueDate": "2026-06-15",        // optional — YYYY-MM-DD, must not be in the past
  "priority": "high"              // optional — "low" | "medium" | "high" (default: "medium")
}
```
**Response `201`** — the created task object  
**Response `400`** — `{ "errors": ["Title is required.", ...] }`

---

### `PUT /api/tasks/:id`
**Request body** — same shape as `POST /api/tasks` (all fields optional except `title`)  
**Response `200`** — the updated task object  
**Response `400`** — `{ "errors": [...] }`  
**Response `404`** — `{ "error": "Task not found." }`

---

### `PATCH /api/tasks/:id/toggle`
No request body required.  
**Response `200`** — the task with `completed` flipped  
**Response `404`** — `{ "error": "Task not found." }`

---

### `PATCH /api/tasks/reorder`
**Request body**
```json
{ "orderedIds": ["uuid-1", "uuid-2", "uuid-3"] }
```
**Response `200`** — `{ "ok": true }`  
**Response `400`** — `{ "errors": ["orderedIds must be a non-empty array."] }`

---

### `DELETE /api/tasks/:id`
**Response `204`** — No content  
**Response `404`** — `{ "error": "Task not found." }`

---

## Project Structure

```
Graphene-Studio/
│
├── server/                          ← Express API
│   ├── src/
│   │   ├── index.js                 ← App bootstrap, middleware, error handlers
│   │   ├── routes/
│   │   │   └── tasks.js             ← Express.Router — route definitions only
│   │   ├── controllers/
│   │   │   └── taskController.js    ← Business logic, input validation
│   │   └── models/
│   │       └── taskModel.js         ← Data layer — JSON file I/O (findAll, insert, update, remove, reorder)
│   ├── tests/
│   │   └── tasks.test.js            ← 13 Jest + Supertest integration tests
│   ├── data/
│   │   └── tasks.json               ← Auto-created on first run (gitignored)
│   ├── .env.example                 ← Environment variable template
│   └── package.json
│
├── client/                          ← React + Vite frontend
│   ├── src/
│   │   ├── main.jsx                 ← React DOM entry point
│   │   ├── App.jsx                  ← Root component — layout, keyboard shortcuts, global state
│   │   ├── index.css                ← Design system: CSS variables, dark/light theme, all component styles
│   │   ├── api/
│   │   │   └── tasks.js             ← Axios helper functions — one per API endpoint
│   │   ├── components/
│   │   │   ├── Header.jsx           ← Branding, active/done counters, theme toggle, keyboard hints
│   │   │   ├── FilterBar.jsx        ← Search input, status tabs (All/Active/Completed), priority dropdown
│   │   │   ├── TaskForm.jsx         ← Create / edit modal with date picker and priority selector
│   │   │   ├── TaskList.jsx         ← @dnd-kit sortable list wrapper
│   │   │   ├── TaskCard.jsx         ← Individual task card — checkbox, badges, due-date chip, edit/delete
│   │   │   ├── EmptyState.jsx       ← Illustrated empty state (different copy for no tasks vs no results)
│   │   │   ├── ConfirmModal.jsx     ← Delete confirmation dialog
│   │   │   └── ToastContainer.jsx   ← Toast notification stack (success / info)
│   │   ├── hooks/
│   │   │   ├── useTasks.js          ← All task state + CRUD + optimistic updates
│   │   │   └── useToast.js          ← Toast queue management
│   │   └── utils/
│   │       └── dateUtils.js         ← Human-readable due-date labels ("Due in 2 days", "Overdue by 3 days")
│   ├── index.html                   ← HTML shell with Google Fonts and meta tags
│   ├── vercel.json                  ← Vercel build config + SPA rewrite rule
│   ├── vite.config.js               ← Vite config with dev proxy to :5000
│   └── package.json
│
├── data/
│   └── .gitkeep                     ← Keeps the data/ directory tracked in git
├── render.yaml                      ← Render infrastructure-as-code config
├── .gitignore
└── README.md
```

---

## Features Implemented

### Must Have ✅
- Add task with title (required), description, and due date
- View tasks sorted by creation order (newest first by default)
- Toggle complete / incomplete
- Edit task title, description, due date, and priority
- Delete with confirmation modal

### Should Have ✅
- Active vs completed count displayed in the header
- Overdue tasks highlighted with a red left border and "Overdue by N days" chip
- Empty state UI — different messaging for "no tasks" vs "no filter results"

### Bonus ✅
- **Full-text search** across title and description
- **JSON file persistence** — tasks survive server restarts with zero database setup
- **Drag-and-drop reorder** via `@dnd-kit` with full keyboard support
- **Priority badges** — Low (green) / Medium (orange) / High (red) with matching left border colour
- **Due-date countdown** — "Due in 2 days", "Due today", "Overdue by 3 days"
- **Dark / Light mode** — one CSS-variable swap, persisted to `localStorage`
- **Keyboard shortcuts** — `N` opens the new-task form; `Esc` closes any modal
- **Optimistic UI** — toggle and delete update instantly without waiting for the server
- **Toast notifications** — completion and revert actions surface a brief confirmation

---

## Next Steps

With more time I would prioritise:

1. **Authentication** — a simple JWT-based login so tasks are scoped per user rather than shared globally
2. **Subtasks** — nested checklist items inside a parent task, stored as a `subtasks[]` array on the task object
3. **Due-date browser notifications** — use the Web Notification API to alert the user when a task becomes overdue, even while the tab is in the background
4. **Recurring tasks** — a `recurrence` field (`daily` / `weekly` / `monthly`) that auto-creates the next instance when the current one is completed
5. **SQLite migration** — swap the JSON store for `better-sqlite3` to handle concurrent writes safely and enable indexed queries (filtering by priority, date range, etc.)
6. **Accessibility audit** — full arrow-key navigation through the task list, ARIA live regions for toast announcements, and a focus-trap inside modals
7. **E2E test suite** — Playwright smoke tests for the core happy path: create → edit → complete → delete
8. **Labels / tags** — free-form colour-coded labels for cross-cutting categorisation (e.g. "Work", "Personal", "Urgent")
