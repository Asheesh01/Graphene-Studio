const request = require('supertest');
const app = require('../src/index');
const taskModel = require('../src/models/taskModel');

// Mock the model so tests never touch the filesystem
jest.mock('../src/models/taskModel');

const BASE_TASK = {
  id: 'task-1',
  title: 'Buy groceries',
  description: null,
  dueDate: null,
  priority: 'medium',
  completed: false,
  order: 0,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

beforeEach(() => jest.clearAllMocks());

// ── Health ─────────────────────────────────────────────────────────────────────
describe('GET /api/health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

// ── GET all tasks ──────────────────────────────────────────────────────────────
describe('GET /api/tasks', () => {
  it('returns a sorted array of tasks', async () => {
    taskModel.findAll.mockReturnValue([BASE_TASK]);
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toBe('Buy groceries');
  });
});

// ── POST /api/tasks ────────────────────────────────────────────────────────────
describe('POST /api/tasks', () => {
  it('creates a task with valid data', async () => {
    taskModel.insert.mockImplementation(t => t);
    const res = await request(app).post('/api/tasks').send({ title: 'Buy groceries', priority: 'high' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Buy groceries');
    expect(res.body.priority).toBe('high');
    expect(res.body.completed).toBe(false);
    expect(taskModel.insert).toHaveBeenCalledTimes(1);
  });

  it('rejects an empty title', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'No title here' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Title is required.');
  });

  it('rejects an invalid priority', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Test', priority: 'critical' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0]).toMatch(/priority/i);
  });
});

// ── PUT /api/tasks/:id ─────────────────────────────────────────────────────────
describe('PUT /api/tasks/:id', () => {
  it('updates a task successfully', async () => {
    taskModel.findById.mockReturnValue(BASE_TASK);
    taskModel.update.mockReturnValue({ ...BASE_TASK, title: 'Updated', priority: 'high' });

    const res = await request(app).put('/api/tasks/task-1').send({ title: 'Updated', priority: 'high' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
    expect(taskModel.update).toHaveBeenCalledWith('task-1', expect.objectContaining({ title: 'Updated' }));
  });

  it('returns 404 for an unknown task', async () => {
    taskModel.findById.mockReturnValue(undefined);
    const res = await request(app).put('/api/tasks/ghost').send({ title: 'Anything' });
    expect(res.status).toBe(404);
  });
});

// ── PATCH /api/tasks/:id/toggle ───────────────────────────────────────────────
describe('PATCH /api/tasks/:id/toggle', () => {
  it('toggles completed to true', async () => {
    taskModel.findById.mockReturnValue({ ...BASE_TASK, completed: false });
    taskModel.update.mockReturnValue({ ...BASE_TASK, completed: true });

    const res = await request(app).patch('/api/tasks/task-1/toggle');
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
    expect(taskModel.update).toHaveBeenCalledWith('task-1', { completed: true });
  });

  it('returns 404 for unknown task', async () => {
    taskModel.findById.mockReturnValue(undefined);
    const res = await request(app).patch('/api/tasks/nope/toggle');
    expect(res.status).toBe(404);
  });
});

// ── DELETE /api/tasks/:id ──────────────────────────────────────────────────────
describe('DELETE /api/tasks/:id', () => {
  it('deletes an existing task and returns 204', async () => {
    taskModel.remove.mockReturnValue(true);
    const res = await request(app).delete('/api/tasks/task-1');
    expect(res.status).toBe(204);
    expect(taskModel.remove).toHaveBeenCalledWith('task-1');
  });

  it('returns 404 for a missing task', async () => {
    taskModel.remove.mockReturnValue(false);
    const res = await request(app).delete('/api/tasks/ghost');
    expect(res.status).toBe(404);
  });
});

// ── PATCH /api/tasks/reorder ──────────────────────────────────────────────────
describe('PATCH /api/tasks/reorder', () => {
  it('calls model reorder with ordered ids', async () => {
    taskModel.reorder.mockReturnValue(undefined);
    const res = await request(app).patch('/api/tasks/reorder').send({ orderedIds: ['task-1', 'task-2'] });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(taskModel.reorder).toHaveBeenCalledWith(['task-1', 'task-2']);
  });

  it('returns 400 if orderedIds is missing', async () => {
    const res = await request(app).patch('/api/tasks/reorder').send({});
    expect(res.status).toBe(400);
  });
});
