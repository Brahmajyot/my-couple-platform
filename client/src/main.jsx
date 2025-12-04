import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; 

import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY from client/.env');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   
    <BrowserRouter> 
   
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        
        navigate={(to) => window.location.href = to} 
      >
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </React.StrictMode>,
);