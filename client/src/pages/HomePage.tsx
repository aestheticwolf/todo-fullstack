import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { fetchTasks, updateTask, deleteTask } from '../api';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Complete' | 'Incomplete'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'status'>('name');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const toggleStatus = async (id: number, currentStatus: 'Complete' | 'Incomplete') => {
    const newStatus = currentStatus === 'Complete' ? 'Incomplete' : 'Complete';
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      const updated = await updateTask(id, task.name, newStatus);
      setTasks(tasks.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleEdit = async (id: number, newName: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !newName.trim()) return;
    try {
      const updated = await updateTask(id, newName.trim(), task.status);
      setTasks(tasks.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      alert('Failed to update task');
    }
  };

  // Apply filter, search, sort
  let filteredTasks = [...tasks];
  if (filter !== 'All') {
    filteredTasks = filteredTasks.filter(t => t.status === filter);
  }
  if (search) {
    filteredTasks = filteredTasks.filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  filteredTasks.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return a.status.localeCompare(b.status);
  });

  return (
    <div className="container">
      <header>
        <h1>To-Do List</h1>
        <Link to="/add" className="btn btn-primary">+ Add Task</Link>
      </header>

      <div className="controls">
        <div>
          <label>Filter:</label>
          <select value={filter} onChange={e => setFilter(e.target.value as any)}>
            <option value="All">All</option>
            <option value="Complete">Complete</option>
            <option value="Incomplete">Incomplete</option>
          </select>
        </div>

        <div>
          <label>Sort by:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleStatus}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </ul>
      )}
    </div>
  );
};

// Individual Task Item
const TaskItem: React.FC<{
  task: Task;
  onToggle: (id: number, status: 'Complete' | 'Incomplete') => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, name: string) => void;
}> = ({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);

  const saveEdit = () => {
    if (editName.trim()) {
      onEdit(task.id, editName);
    }
    setIsEditing(false);
  };

  return (
    <li className={`task-item ${task.status === 'Complete' ? 'complete' : ''}`}>
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            autoFocus
          />
          <button onClick={saveEdit} className="btn btn-small">Save</button>
          <button onClick={() => setIsEditing(false)} className="btn btn-small btn-outline">Cancel</button>
        </div>
      ) : (
        <>
          <span className="task-name">{task.name}</span>
          <span className="task-status">{task.status}</span>
          <div className="task-actions">
            <button onClick={() => onToggle(task.id, task.status)} className="btn btn-small">
              {task.status === 'Complete' ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={() => setIsEditing(true)} className="btn btn-small">Edit</button>
            <button onClick={() => onDelete(task.id)} className="btn btn-small btn-danger">Delete</button>
          </div>
        </>
      )}
    </li>
  );
};

export default HomePage;