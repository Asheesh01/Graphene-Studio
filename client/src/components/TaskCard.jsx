import { formatDueDate, isOverdue } from '../utils/dateUtils';

const PRIORITY_LABELS = { low: 'Low', medium: 'Med', high: 'High' };

export default function TaskCard({ task, onToggle, onEdit, onDelete, dragHandleProps }) {
  const due = task.dueDate ? formatDueDate(task.dueDate) : null;
  const overdue = isOverdue(task);

  return (
    <div
      id={`task-${task.id}`}
      className={`task-card priority-border-${task.priority} ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}
    >
      {/* Drag handle */}
      <button className="drag-handle" aria-label="Drag to reorder" {...dragHandleProps}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <circle cx="4" cy="3" r="1.2"/><circle cx="10" cy="3" r="1.2"/>
          <circle cx="4" cy="7" r="1.2"/><circle cx="10" cy="7" r="1.2"/>
          <circle cx="4" cy="11" r="1.2"/><circle cx="10" cy="11" r="1.2"/>
        </svg>
      </button>

      {/* Complete toggle */}
      <button
        className={`task-check ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        aria-pressed={task.completed}
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6l3 3 5-5"/>
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="task-content">
        <div className="task-top">
          <span className={`task-title ${task.completed ? 'struck' : ''}`}>{task.title}</span>

          {/* Prominent OVERDUE chip — only when past due AND not completed */}
          {overdue && (
            <span className="overdue-chip" aria-label="This task is overdue">
              <span className="overdue-pulse" />
              OVERDUE
            </span>
          )}

          <span className={`priority-badge priority-${task.priority}`}>
            <span className="priority-dot" />
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}

        {due && (
          <div className={`task-due ${due.overdue ? 'due-overdue' : due.today ? 'due-today' : 'due-future'}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {due.label}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="task-actions">
        <button className="action-btn edit-btn" onClick={() => onEdit(task)} aria-label="Edit task" title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button className="action-btn delete-btn" onClick={() => onDelete(task)} aria-label="Delete task" title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
