import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import Login from './components/login';
import Domain from './components/domain';
import PrivateRoute from './PrivateRoute';
// import DomainList from './components/DomainList'

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/domain"
            element={
              <PrivateRoute>
                <Domain />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
