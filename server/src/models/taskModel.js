const fs = require('fs');
const path = require('path');

const DATA_FILE = process.env.DATA_FILE
  ? path.resolve(process.env.DATA_FILE)
  : path.join(__dirname, '../../../data/tasks.json');

/**
 * Ensures the data directory and file exist on disk.
 */
function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

/**
 * Reads all tasks from the JSON file.
 * @returns {Array} tasks
 */
function findAll() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

/**
 * Writes the tasks array back to the JSON file.
 * @param {Array} tasks
 */
function saveAll(tasks) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

/**
 * Finds a single task by ID.
 * @param {string} id
 * @returns {object|undefined}
 */
function findById(id) {
  return findAll().find(t => t.id === id);
}

/**
 * Inserts a new task at the front of the list.
 * @param {object} task  — fully formed task object (id, title, etc.)
 * @returns {object} the saved task
 */
function insert(task) {
  const tasks = findAll();
  tasks.forEach(t => (t.order += 1)); // shift existing tasks down
  tasks.unshift(task);
  saveAll(tasks);
  return task;
}

/**
 * Replaces an existing task by ID.
 * @param {string} id
 * @param {object} updates — partial or full task fields to merge
 * @returns {object|null} updated task, or null if not found
 */
function update(id, updates) {
  const tasks = findAll();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date().toISOString() };
  saveAll(tasks);
  return tasks[idx];
}

/**
 * Removes a task by ID.
 * @param {string} id
 * @returns {boolean} true if deleted, false if not found
 */
function remove(id) {
  const tasks = findAll();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  saveAll(tasks);
  return true;
}

/**
 * Applies a new ordering to tasks based on an ordered array of IDs.
 * @param {string[]} orderedIds
 */
function reorder(orderedIds) {
  const tasks = findAll();
  const map = new Map(tasks.map(t => [t.id, t]));
  orderedIds.forEach((id, i) => {
    if (map.has(id)) map.get(id).order = i;
  });
  saveAll([...map.values()]);
}

module.exports = { findAll, findById, insert, update, remove, reorder };
