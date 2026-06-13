# TaskFlow — Personal Task Manager

> **Exercise 1** from the Studio Graphene take-home brief. A full-stack task manager with priorities, due-date countdowns, dark/light mode, drag-and-drop, and keyboard shortcuts.

---

## Live Demo

| Layer    | URL |
|----------|-----|
| Frontend | *(deploy to Vercel — see below)* |
| Backend  | *(deploy to Render — see below)* |

---

## Tech Stack

| Layer     | Choice | Why |
|-----------|--------|-----|
| Backend   | Node.js + Express | Lightweight, easy to structure into MVC layers |
| Frontend  | React 18 + Vite | Fast HMR, minimal config, modern JSX |
| Storage   | JSON file (`data/tasks.json`) | Zero-dependency persistence across restarts |
| Styling   | Vanilla CSS with CSS variables | Full control, dark/light theming with one attribute |
| DnD       | @dnd-kit/core + sortable | Accessible, pointer-sensor drag-and-drop |
| Testing   | Jest + Supertest | Clean unit tests with model mocking |

---

## How to Run Locally

> **Assumption:** Node.js ≥ 18 is installed.

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd graphene-studio

# 2. Install & start the backend (runs on :5000)
cd server
npm install
npm run dev

# 3. In a second terminal — install & start the frontend (runs on :3000)
cd client
npm install
npm run dev

# 4. Open http://localhost:3000
```

The Vite dev server proxies all `/api/*` requests to `http://localhost:5000` automatically — no CORS setup needed during development.

### Environment Variables (optional)

Copy `server/.env.example` to `server/.env`:

```
PORT=5000
DATA_FILE=./data/tasks.json   # path to persist tasks
```

---

## API Documentation

Base URL: `http://localhost:5000`

| Method   | Path                      | Body / Params                                              | Response           |
|----------|---------------------------|------------------------------------------------------------|--------------------|
| `GET`    | `/api/health`             | —                                                          | `{ status, timestamp }` |
| `GET`    | `/api/tasks`              | —                                                          | `Task[]` sorted by order |
| `POST`   | `/api/tasks`              | `{ title*, description?, dueDate?, priority? }`            | `Task` (201)       |
| `PUT`    | `/api/tasks/:id`          | `{ title*, description?, dueDate?, priority? }`            | `Task`             |
| `PATCH`  | `/api/tasks/:id/toggle`   | —                                                          | `Task`             |
| `PATCH`  | `/api/tasks/reorder`      | `{ orderedIds: string[] }`                                 | `{ ok: true }`     |
| `DELETE` | `/api/tasks/:id`          | —                                                          | `204 No Content`   |

**Task shape:**
```json
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
```

Validation errors return `400 { errors: string[] }`.  
Not-found returns `404 { error: string }`.

---

## Project Structure

```
graphene-studio/
├── server/
│   ├── src/
│   │   ├── models/
│   │   │   └── taskModel.js        ← data layer (JSON file I/O)
│   │   ├── controllers/
│   │   │   └── taskController.js   ← business logic + validation
│   │   ├── routes/
│   │   │   └── tasks.js            ← Express.Router definitions only
│   │   └── index.js                ← app bootstrap + middleware
│   ├── tests/
│   │   └── tasks.test.js           ← 13 Jest + Supertest tests
│   ├── data/
│   │   └── tasks.json              ← auto-created on first run
│   └── package.json
│
└── client/
    ├── src/
    │   ├── api/
    │   │   └── tasks.js            ← Axios API helpers
    │   ├── components/
    │   │   ├── Header.jsx          ← stats, theme toggle, kbd hints
    │   │   ├── FilterBar.jsx       ← search, status/priority filters
    │   │   ├── TaskForm.jsx        ← create/edit modal
    │   │   ├── TaskList.jsx        ← DnD sortable list
    │   │   ├── TaskCard.jsx        ← individual task card
    │   │   ├── EmptyState.jsx      ← empty state UI
    │   │   └── ConfirmModal.jsx    ← delete confirmation
    │   ├── hooks/
    │   │   └── useTasks.js         ← all task state + API calls
    │   ├── utils/
    │   │   └── dateUtils.js        ← "Due in 2 days" formatting
    │   ├── App.jsx                 ← root component + keyboard shortcuts
    │   ├── main.jsx
    │   └── index.css               ← CSS variables + full design system
    ├── index.html
    └── package.json
```

---

## Features Implemented

### Must Have ✅
- Add task with title (required), description, due date
- View tasks sorted by creation date (newest first)
- Toggle complete / incomplete
- Edit task title, description, due date, priority
- Delete with confirmation modal
- Filter by All / Active / Completed

### Should Have ✅
- Active vs completed count in header
- Overdue tasks highlighted with red left border + "Overdue by N days"
- Empty state UI (different for no tasks vs no filter matches)

### Bonus ✅
- **Search** by title and description
- **Persist to JSON file** — tasks survive server restarts
- **Drag-and-drop** reorder via @dnd-kit
- **Priority badges** — Low (green) / Medium (orange) / High (red) with colored left border
- **Due date countdown** — "Due in 2 days", "Due today", "Overdue by 3 days"
- **Dark / Light mode toggle** — one CSS-variable switch, persisted to localStorage
- **Keyboard shortcuts** — `N` to open new task form, `Esc` to close any modal
- **Optimistic UI** — toggle and delete update instantly without waiting for the server

---

## Running Tests

```bash
cd server
npm test
```

13 tests covering health, CRUD, toggle, reorder, and validation — all passing.

---

## Next Steps

With more time I would:

1. **Authentication** — even a simple PIN/passphrase to make it multi-user
2. **Subtasks** — nested checklist items inside a task
3. **Due date notifications** — browser Notification API for overdue reminders
4. **Recurring tasks** — daily/weekly repeat patterns
5. **SQLite migration** — swap the JSON store for better-sqlite3 for concurrent writes
6. **Accessibility audit** — full keyboard navigation through the task list, ARIA live regions for updates
7. **E2E tests** — Playwright smoke tests for the happy path (create → complete → delete)

---

## Deployment

### Frontend (Vercel)
```bash
cd client && npm run build
# Push to GitHub, connect repo to vercel.com, set root to /client
```

### Backend (Render)
1. Connect GitHub repo to render.com → New Web Service
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add env var: `CLIENT_ORIGIN=https://your-vercel-url.vercel.app`
