import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/tasks';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchTasks();
      setTasks(data);
    } catch {
      setError('Failed to load tasks. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const createTask = useCallback(async (data) => {
    const task = await api.createTask(data);
    setTasks(prev => [task, ...prev]);
    return task;
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const updated = await api.updateTask(id, data);
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    return updated;
  }, []);

  const toggleTask = useCallback(async (id) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    try {
      const updated = await api.toggleTask(id);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch {
      // Rollback
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await api.deleteTask(id);
    } catch {
      await load(); // refetch on error
    }
  }, [load]);

  const reorderTasks = useCallback(async (newOrder) => {
    setTasks(newOrder); // optimistic
    const ids = newOrder.map(t => t.id);
    try {
      await api.reorderTasks(ids);
    } catch {
      await load();
    }
  }, [load]);

  return { tasks, loading, error, createTask, updateTask, toggleTask, deleteTask, reorderTasks, reload: load };
}
