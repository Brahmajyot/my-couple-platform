import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; 
import StreamProvider from './components/StreamProvider.jsx'; 

function App() {
  return (
    <div className="min-h-screen bg-bg-dark font-sans">
      <Routes>
        
        <Route path="/" element={<Home />} />

      
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StreamProvider>
                <Dashboard />
              </StreamProvider>
            </ProtectedRoute>
          }
        />
        
      
      </Routes>
    </div>
  );
}

export default App;