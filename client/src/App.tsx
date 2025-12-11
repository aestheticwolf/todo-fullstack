import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddTaskPage from './pages/AddTaskPage';
import ViewTaskPage from './pages/ViewTaskPage'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddTaskPage />} />
          <Route path="/view/:id" element={<ViewTaskPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;