/**
 * Returns a human-readable due date label.
 * e.g. "Due in 2 days", "Overdue by 3 days", "Due today"
 */
export function formatDueDate(dueDate) {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diff = Math.round((due - today) / (1000 * 60 * 60 * 24));

  if (diff === 0) return { label: 'Due today', overdue: false, today: true };
  if (diff === 1) return { label: 'Due tomorrow', overdue: false };
  if (diff === -1) return { label: 'Overdue by 1 day', overdue: true };
  if (diff > 1) return { label: `Due in ${diff} days`, overdue: false };
  return { label: `Overdue by ${Math.abs(diff)} days`, overdue: true };
}

/**
 * Returns true if a task is overdue (past due date and not completed).
 */
export function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const due = new Date(task.dueDate);
  due.setHours(23, 59, 59, 999);
  return due < new Date();
}

/**
 * Formats ISO date string to "Jun 11, 2026"
 */
export function formatShortDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}
