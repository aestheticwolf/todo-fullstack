// client/src/pages/HomePage.tsx
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
  const [editingId, setEditingId] = useState<number | null>(null); // ← NEW STATE

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
      const updated = await updateTask(id, task.name, newStatus, task.description);
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

  const handleEditStart = (id: number) => {
    setEditingId(id); //SHows which task is being edited
  };

  const handleEditCancel = () => {
    setEditingId(null); // thisexit edit mode
  };

  const handleEditSubmit = async (id: number, newName: string, newDescription: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || !newName.trim()) return;
    try {
      const updated = await updateTask(id, newName.trim(), task.status, newDescription.trim());
      setTasks(tasks.map(t => (t.id === id ? updated : t)));
      setEditingId(null); // this exitedit mode after save
    } catch (err) {
      alert('Failed to update task');
    }
  };

  // here apply filter, search, sort
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
                onEditStart={handleEditStart}
                onEditCancel={handleEditCancel}
                onEditSubmit={handleEditSubmit}
                isEditing={editingId === task.id} //this shows whether this task is being edited
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
  onEditStart: (id: number) => void;
  onEditCancel: () => void;
  onEditSubmit: (id: number, name: string, description: string) => void;
  isEditing: boolean;
}> = ({ task, onToggle, onDelete, onEditStart, onEditCancel, onEditSubmit, isEditing }) => {
  const [editName, setEditName] = useState(task.name);
  const [editDescription, setEditDescription] = useState(task.description);

  const saveEdit = () => {
    if (editName.trim()) {
      onEditSubmit(task.id, editName, editDescription);
    }
  };

  return (
    <li className={`task-item ${task.status === 'Complete' ? 'complete' : ''}`}>
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            placeholder="Task name"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            placeholder="Task description"
            className="edit-description-input"
            rows={4}
          />
          <button onClick={saveEdit} className="btn btn-small">Update</button>
          <button onClick={onEditCancel} className="btn btn-small btn-outline">Cancel</button>
        </div>
      ) : (
        <>
          <div className="task-content">
            <h3 className="task-name">{task.name}</h3>
            {task.description && (
              <p className="task-description">
                {task.description.length > 80 
                  ? task.description.substring(0, 80) + '...' 
                  : task.description}
              </p>
            )}
            <span className={`task-status ${task.status}`}>{task.status}</span>
          </div>
          <div className="task-actions">
            <button onClick={() => onToggle(task.id, task.status)} className="btn btn-small">
              {task.status === 'Complete' ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={() => onEditStart(task.id)} className="btn btn-small">Edit</button>
            <button onClick={() => onDelete(task.id)} className="btn btn-small btn-danger">Delete</button>
            <Link to={`/view/${task.id}`} className="btn btn-small btn-outline">View</Link>
          </div>
        </>
      )}
    </li>
  );
};

export default HomePage;