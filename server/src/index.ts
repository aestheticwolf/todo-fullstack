import express = require('express');
import cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// this Inmemory task storage
let tasks: { id: number; name: string; status: 'Complete' | 'Incomplete'; description: string }[] = [
  { 
    id: 1, 
    name: 'Welcome to To-Do App', 
    status: 'Incomplete',
    description: 'This is a sample task to get you started. You can edit, delete, or mark it as complete.' 
  }
];

//GET /api/tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

//POST /api/tasks
app.post('/api/tasks', (req, res) => {
  const { name, status, description } = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and must be a string' });
  }
  if (status !== 'Complete' && status !== 'Incomplete') {
    return res.status(400).json({ error: 'Status must be "Complete" or "Incomplete"' });
  }
  if (typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string' });
  }

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    name: name.trim(),
    status: status,
    description: description.trim()
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

//PUT /api/tasks/:id
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, status, description } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }
  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (status !== 'Complete' && status !== 'Incomplete') {
    return res.status(400).json({ error: 'Status must be "Complete" or "Incomplete"' });
  }
  if (typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string' });
  }

  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[taskIndex] = { id, name: name.trim(), status, description: description.trim() };
  res.json(tasks[taskIndex]);
});

//DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});