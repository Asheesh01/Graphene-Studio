import axios from 'axios';

// In production (Vercel) set VITE_API_URL to your Render backend URL,
// e.g. https://taskflow-api.onrender.com
// Locally the Vite proxy handles /api → localhost:5000 automatically.
const API_ORIGIN = import.meta.env.VITE_API_URL ?? '';
const BASE = `${API_ORIGIN}/api/tasks`;

export const fetchTasks = () => axios.get(BASE).then(r => r.data);

export const createTask = (data) => axios.post(BASE, data).then(r => r.data);

export const updateTask = (id, data) => axios.put(`${BASE}/${id}`, data).then(r => r.data);

export const toggleTask = (id) => axios.patch(`${BASE}/${id}/toggle`).then(r => r.data);

export const deleteTask = (id) => axios.delete(`${BASE}/${id}`);

export const reorderTasks = (orderedIds) =>
  axios.patch(`${BASE}/reorder`, { orderedIds }).then(r => r.data);
