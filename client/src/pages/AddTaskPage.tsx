import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../api';

const AddTaskPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); 
  const [status, setStatus] = useState<'Complete' | 'Incomplete'>('Incomplete');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a task name');
      return;
    }

    setSubmitting(true);
    try {
      await createTask(name.trim(), status, description.trim()); //DESCRIPTION
      navigate('/');
    } catch (err) {
      alert('Failed to add task. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1>Add New Task</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Buy groceries"
            required
          />
        </div>
    
<div className="form-group">
  <label>Description</label>
  <textarea
    value={description}
    onChange={e => setDescription(e.target.value)}
    placeholder="Briefly describe the task"
    className="description-input"
    rows={4}
    style={{ resize: 'none' }} //resize handle
  />
</div>
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value as any)}>
            <option value="Incomplete">Incomplete</option>
            <option value="Complete">Complete</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Adding...' : 'Add Task'}
          </button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskPage;