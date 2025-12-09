import { Task } from './types';

// In development: localhost backend
// In production: set REACT_APP_API_URL in Netlify
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

export const createTask = async (name: string, status: 'Complete' | 'Incomplete'): Promise<Task> => {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, status })
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
};

export const updateTask = async (id: number, name: string, status: 'Complete' | 'Incomplete'): Promise<Task> => {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, status })
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
};

export const deleteTask = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete task');
};