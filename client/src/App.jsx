import { useState, useEffect } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import EmptyState from './components/EmptyState';
import ConfirmModal from './components/ConfirmModal';
import ToastContainer from './components/ToastContainer';
import useTasks from './hooks/useTasks';
import useToast from './hooks/useToast';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const { tasks, loading, error, createTask, updateTask, toggleTask, deleteTask, reorderTasks } = useTasks();
  const { toasts, showToast, dismissToast } = useToast();

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if (e.key === 'Escape') {
        setIsFormOpen(false);
        setEditingTask(null);
        setDeletingTask(null);
      }
      if ((e.key === 'n' || e.key === 'N') && !isTyping) {
        e.preventDefault();
        setEditingTask(null);
        setIsFormOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Derived state ────────────────────────────────────────────────────────────
  const filtered = tasks.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q));
    const matchStatus =
      filter === 'all' ||
      (filter === 'active' && !t.completed) ||
      (filter === 'completed' && t.completed);
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const openNew = () => { setEditingTask(null); setIsFormOpen(true); };
  const openEdit = (task) => { setEditingTask(task); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditingTask(null); };

  // Toggle + show toast based on new state
  const handleToggle = async (id) => {
    const task = tasks.find(t => t.id === id);
    const wasCompleted = task?.completed;
    await toggleTask(id);
    if (!wasCompleted) {
      // Task is now complete
      showToast({ message: `✓ "${task?.title}" marked as complete!`, type: 'success' });
    } else {
      // Task moved back to active
      showToast({ message: `↩ "${task?.title}" moved back to active.`, type: 'info' });
    }
  };

  const handleSave = async (data) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
    closeForm();
  };

  const handleDeleteRequest = (task) => setDeletingTask(task);

  const handleDeleteConfirm = async () => {
    if (deletingTask) {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <Header
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        activeCount={activeCount}
        completedCount={completedCount}
      />

      <main className="main">
        <div className="container">
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            onNewTask={openNew}
          />

          {isFormOpen && (
            <TaskForm task={editingTask} onSave={handleSave} onClose={closeForm} />
          )}

          {loading && (
            <div className="status-box">
              <div className="spinner" aria-label="Loading" />
              <span>Loading tasks…</span>
            </div>
          )}

          {error && !loading && (
            <div className="status-box error-box" role="alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <EmptyState filter={filter} search={search} />
          )}

          {!loading && !error && filtered.length > 0 && (
            <TaskList
              tasks={filtered}
              onToggle={handleToggle}
              onEdit={openEdit}
              onDelete={handleDeleteRequest}
              onReorder={reorderTasks}
            />
          )}
        </div>
      </main>

      {deletingTask && (
        <ConfirmModal
          task={deletingTask}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingTask(null)}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
