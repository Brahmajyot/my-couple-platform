import React from 'react';
import { SignInButton, SignUpButton, useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-dark text-white p-4">
      <div className="max-w-4xl w-full text-center bg-gray-800/80 backdrop-blur-sm p-10 md:p-16 rounded-3xl shadow-2xl shadow-secondary-purple/30">
        
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-pink to-secondary-purple">
          HeartStream 💖
        </h1>
        <p className="text-xl md:text-3xl font-light text-gray-300 mb-10">
          Your Private Digital Space. Yours, Exclusively.
        </p>
        
        <div className="space-y-4">
          
          {isLoaded && !isSignedIn && (
            <>
              <p className="text-lg text-gray-200 mb-6">
                Please sign in to access your shared movies, live video chat, and music.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                
              
                <SignInButton mode="modal">
                  <button className="w-full sm:w-60 py-3 rounded-full font-bold text-lg transition duration-300 bg-secondary-purple hover:bg-secondary-purple/80 shadow-lg shadow-secondary-purple/50">
                    Sign In
                  </button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <button className="w-full sm:w-60 py-3 rounded-full font-bold text-lg transition duration-300 border-2 border-primary-pink text-primary-pink hover:bg-primary-pink/10">
                    Create Account
                  </button>
                </SignUpButton>
                
              </div>
            </>
          )}

          {isLoaded && isSignedIn && (
            <div className="mt-8">
              <p className="text-2xl text-primary-pink mb-4">You are already signed in!</p>
              <Link to="/dashboard" className="inline-block py-3 px-10 rounded-full font-bold text-lg bg-primary-pink hover:bg-primary-pink/80 transition duration-300">
                Go to Dashboard →
              </Link>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>🔒 End-to-End Encryption for Messages</p>
          <p>☁️ Secure Streaming powered by Cloudflare</p>
        </div>
      </div>
    </div>
  );
}