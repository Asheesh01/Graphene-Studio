const { v4: uuidv4 } = require('uuid');
const taskModel = require('../models/taskModel');

const VALID_PRIORITIES = ['low', 'medium', 'high'];

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(body) {
  const errors = [];
  if (!body.title || !String(body.title).trim()) {
    errors.push('Title is required.');
  }
  if (body.title && String(body.title).trim().length > 200) {
    errors.push('Title must be 200 characters or fewer.');
  }
  if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
    errors.push('Priority must be low, medium, or high.');
  }
  if (body.dueDate) {
    if (isNaN(Date.parse(body.dueDate))) {
      errors.push('Invalid due date format.');
    } else {
      // Compare YYYY-MM-DD strings to avoid timezone shift issues
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
      if (body.dueDate < todayStr) {
        errors.push('Due date cannot be in the past.');
      }
    }
  }
  return errors;
}

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * GET /api/tasks
 * Returns all tasks sorted by order (asc) then createdAt (desc).
 */
function getAllTasks(req, res) {
  const tasks = taskModel.findAll();
  tasks.sort((a, b) => a.order - b.order || new Date(b.createdAt) - new Date(a.createdAt));
  res.json(tasks);
}

/**
 * POST /api/tasks
 * Creates a new task. Title is required.
 */
function createTask(req, res) {
  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const now = new Date().toISOString();
  const task = {
    id: uuidv4(),
    title: String(req.body.title).trim(),
    description: req.body.description ? String(req.body.description).trim() : null,
    dueDate: req.body.dueDate || null,
    priority: req.body.priority || 'medium',
    completed: false,
    order: 0,
    createdAt: now,
    updatedAt: now,
  };

  const saved = taskModel.insert(task);
  res.status(201).json(saved);
}

/**
 * PUT /api/tasks/:id
 * Full update of an existing task (title, description, dueDate, priority).
 */
function updateTask(req, res) {
  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const existing = taskModel.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found.' });

  const updated = taskModel.update(req.params.id, {
    title: String(req.body.title).trim(),
    description: req.body.description ? String(req.body.description).trim() : null,
    dueDate: req.body.dueDate || null,
    priority: req.body.priority || existing.priority,
  });

  res.json(updated);
}

/**
 * PATCH /api/tasks/:id/toggle
 * Flips the completed status of a task.
 */
function toggleTask(req, res) {
  const existing = taskModel.findById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found.' });

  const updated = taskModel.update(req.params.id, { completed: !existing.completed });
  res.json(updated);
}

/**
 * PATCH /api/tasks/reorder
 * Accepts { orderedIds: string[] } and persists the new ordering.
 */
function reorderTasks(req, res) {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds must be an array of task IDs.' });
  }
  taskModel.reorder(orderedIds);
  res.json({ ok: true });
}

/**
 * DELETE /api/tasks/:id
 * Permanently removes a task.
 */
function deleteTask(req, res) {
  const deleted = taskModel.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Task not found.' });
  res.status(204).send();
}

module.exports = { getAllTasks, createTask, updateTask, toggleTask, reorderTasks, deleteTask };
