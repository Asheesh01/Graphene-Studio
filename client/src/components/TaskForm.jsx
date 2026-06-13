import { useState, useEffect, useRef } from 'react';

const PRIORITIES = ['low', 'medium', 'high'];

// Returns today's date as YYYY-MM-DD in the local timezone
function todayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function TaskForm({ task, onSave, onClose }) {
  const isEdit = Boolean(task);
  const titleRef = useRef(null);

  // When editing a task that's already overdue, allow its existing past date;
  // otherwise enforce today as the minimum so new tasks can't be set in the past.
  const minDate = isEdit && task.dueDate && task.dueDate.slice(0, 10) < todayStr()
    ? task.dueDate.slice(0, 10)
    : todayStr();

  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
    priority: task?.priority || 'medium',
  });
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { titleRef.current?.focus(); }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = [];
    if (!form.title.trim()) errs.push('Title is required.');
    if (form.dueDate && form.dueDate < todayStr()) {
      errs.push('Due date cannot be in the past.');
    }
    if (errs.length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave({
        title: form.title.trim(),
        description: form.description.trim() || null,
        dueDate: form.dueDate || null,
        priority: form.priority,
      });
    } catch (err) {
      const msgs = err.response?.data?.errors || ['Something went wrong. Please try again.'];
      setErrors(msgs);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-overlay" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit task' : 'New task'} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button className="form-close" onClick={onClose} aria-label="Close form">×</button>
        </div>

        {errors.length > 0 && (
          <div className="form-errors" role="alert">
            {errors.map((e, i) => <p key={i}>{e}</p>)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-body" noValidate>
          <div className="field">
            <label htmlFor="task-title" className="field-label">Title <span className="required">*</span></label>
            <input
              ref={titleRef}
              id="task-title"
              type="text"
              className="field-input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={set('title')}
              maxLength={200}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="task-desc" className="field-label">Description</label>
            <textarea
              id="task-desc"
              className="field-input field-textarea"
              placeholder="Add details (optional)…"
              rows={3}
              value={form.description}
              onChange={set('description')}
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="task-due" className="field-label">Due Date</label>
              <input
                id="task-due"
                type="date"
                className="field-input"
                value={form.dueDate}
                min={minDate}
                onChange={set('dueDate')}
              />
            </div>

            <div className="field">
              <label className="field-label">Priority</label>
              <div className="priority-picker" role="radiogroup" aria-label="Priority">
                {PRIORITIES.map(p => (
                  <button
                    key={p}
                    type="button"
                    id={`priority-${p}`}
                    className={`priority-option priority-${p} ${form.priority === p ? 'selected' : ''}`}
                    onClick={() => setForm(f => ({ ...f, priority: p }))}
                    aria-pressed={form.priority === p}
                  >
                    <span className="priority-dot" />
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" id="save-task-btn" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
