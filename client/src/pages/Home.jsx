import React from 'react';
import { SignInButton, SignUpButton, useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Heart, Lock, Music, Film, ArrowRight, Stars } from 'lucide-react';

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white font-sans selection:bg-pink-500 selection:text-white">
      
      {/* --- 1. Ambient Background Effects --- */}
      <div className="absolute inset-0 w-full h-full">
        {/* Deep Purple Blob */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/40 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        {/* Hot Pink Blob */}
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-900/40 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        {/* Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
        {/* Grain Texture (Adds cinematic feel) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      </div>

      {/* --- 2. Main Glass Card --- */}
      <div className="relative z-10 max-w-5xl w-full mx-4">
        <div className="bg-gray-900/60 backdrop-blur-2xl border border-white/10 p-8 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden group hover:shadow-pink-500/10 transition-shadow duration-700">
          
          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div className="text-center space-y-8 relative z-20">
            
            {/* Header / Logo */}
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center p-4 mb-2 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-3xl border border-white/5 shadow-lg transform hover:scale-105 transition-transform duration-300">
                 <Heart className="w-12 h-12 text-pink-500 fill-pink-500 animate-pulse" />
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-sm">
                  HeartStream
                </span>
              </h1>
              
              <p className="text-lg md:text-2xl font-light text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Your private digital universe. <br/>
                <span className="text-white/50 text-base">Watch, Listen, and Be Together. Anytime, Anywhere.</span>
              </p>
            </div>

            {/* Auth Buttons Section */}
            <div className="py-8">
              {isLoaded && !isSignedIn && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  {/* Sign In - Glowy Primary Button */}
                  <SignInButton mode="modal">
                    <button className="group relative px-8 py-4 bg-white text-black font-bold rounded-full text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300 w-full sm:w-auto overflow-hidden">
                      <span className="relative z-10 flex items-center gap-2">
                        Sign In <ArrowRight size={18} />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </SignInButton>
                  
                  {/* Sign Up - Glass Ghost Button */}
                  <SignUpButton mode="modal">
                    <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm">
                      Create Our Space
                    </button>
                  </SignUpButton>
                </div>
              )}

              {/* Already Logged In State */}
              {isLoaded && isSignedIn && (
                <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center gap-2 text-pink-200 bg-pink-500/10 px-6 py-2 rounded-full border border-pink-500/20 shadow-lg shadow-pink-900/20">
                    <Stars size={16} className="text-pink-400" />
                    <span className="font-medium tracking-wide">Welcome back home.</span>
                  </div>
                  
                  <Link 
                    to="/dashboard" 
                    className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-white transition-all duration-300 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600 hover:scale-105 hover:shadow-[0_0_40px_-5px_rgba(236,72,153,0.5)]"
                  >
                    Enter Dashboard
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>

            {/* --- 3. Feature Icons Footer --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12 pt-12 border-t border-white/10">
                <FeatureCard 
                    icon={<Film className="w-6 h-6 text-purple-300" />}
                    title="Movie Dates"
                    desc="Sync play/pause for the perfect movie night."
                />
                <FeatureCard 
                    icon={<Music className="w-6 h-6 text-green-300" />}
                    title="Our Playlist"
                    desc="Control the vibe with shared Spotify music."
                />
                <FeatureCard 
                    icon={<Lock className="w-6 h-6 text-pink-300" />}
                    title="Private Connection"
                    desc="End-to-End encrypted chat & video calls."
                />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Helper Component for the Feature Grid
function FeatureCard({ icon, title, desc }) {
    return (
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-300 hover:border-white/20">
            <div className="p-3 bg-gray-900 rounded-xl shadow-inner border border-white/5">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-gray-100 text-lg mb-1">{title}</h3>
                <p className="text-sm text-gray-400 leading-snug">{desc}</p>
            </div>
        </div>
    )
}