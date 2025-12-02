import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; 
import StreamProvider from './components/StreamProvider'; 

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