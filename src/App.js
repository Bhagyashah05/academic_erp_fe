import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import DomainPage from './components/domain';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/domain" element={<DomainPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;
