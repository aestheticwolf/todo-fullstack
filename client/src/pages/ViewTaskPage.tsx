// client/src/pages/ViewTaskPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task } from '../types';
import { fetchTasks } from '../api';

const ViewTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const tasks = await fetchTasks();
        const found = tasks.find(t => t.id === parseInt(id!));
        if (!found) {
          alert('Task not found');
          navigate('/');
          return;
        }
        setTask(found);
      } catch (err) {
        alert('Failed to load task');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [id, navigate]);

  if (loading) {
    return <p className="container">Loading task...</p>;
  }

  if (!task) {
    return <p className="container">Task not found.</p>;
  }

  return (
    <div className="container">
      <header>
        <h1>Task Details</h1>
        <button onClick={() => navigate('/')} className="btn btn-outline">Back to List</button>
      </header>

      <div className="task-detail-card">
        <div className="task-header">
          <span className={`status-badge ${task.status}`}>
            {task.status}
          </span>
          <h2>{task.name}</h2>
        </div>

        {task.description && (
          <div className="task-description-section">
            <h3>Description</h3>
            <p>{task.description}</p>
          </div>
        )}

        <div className="task-footer">
          <button onClick={() => navigate('/')} className="btn btn-outline">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskPage;