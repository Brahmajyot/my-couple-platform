import React, { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { 
  Channel, 
  Window, 
  MessageList, 
  MessageInput, 
  useChatContext 
} from 'stream-chat-react';
import { Phone, PhoneOff, Film, Music, MessageSquare, PanelRightClose } from 'lucide-react'; // Added icons

import VideoRoom from '../components/VideoRoom';
import SpotifyMusicBox from '../components/SpotifyMusicBox';
import CoupleCall from '../components/CoupleCall';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  const { user } = useUser();
  const { client } = useChatContext(); 
  const [channel, setChannel] = useState(null);
  
  // --- STATES ---
  const [activeMode, setActiveMode] = useState('movie'); // 'movie' or 'music'
  const [isCallActive, setIsCallActive] = useState(false); // Video Call Toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load Chat Channel
  useEffect(() => {
    if (!client || !user) return;

    const loadChannel = async () => {
      const channel = client.channel('messaging', 'our-private-space-v2', { 
         name: 'Chat',
         members: [user.id], 
      });
      await channel.watch();
      setChannel(channel);
    };

    loadChannel();
  }, [client, user]);

  if (!user) return <div className="flex h-screen items-center justify-center bg-gray-900"><Spinner /></div>;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
      
      {/* --- LEFT SIDE: MAIN MEDIA AREA --- */}
      <div className="flex-1 flex flex-col relative min-w-0">
        
        {/* 1. TOP HEADER (Modern Glass Effect) */}
        <header className="h-20 absolute top-0 left-0 right-0 z-50 px-6 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-[2px]">
            
            {/* Logo Area */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <span className="text-xl">💖</span>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent hidden md:block tracking-wide">
                    HeartStream
                </h1>
            </div>

            {/* CENTER: NEON CAPSULE TOGGLE (The Attractive Part) */}
            <div className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-2xl">
                
                {/* Movie Button */}
                <button 
                    onClick={() => setActiveMode('movie')}
                    className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500 ease-out ${
                        activeMode === 'movie' 
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] ring-1 ring-white/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <Film size={16} className={activeMode === 'movie' ? 'animate-pulse' : ''} />
                    <span>Cinema</span>
                </button>

                {/* Music Button */}
                <button 
                    onClick={() => setActiveMode('music')}
                    className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500 ease-out ${
                        activeMode === 'music' 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-1 ring-white/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <Music size={16} className={activeMode === 'music' ? 'animate-bounce' : ''} />
                    <span>Vibes</span>
                </button>
            </div>

            {/* RIGHT: ACTIONS */}
            <div className="flex items-center gap-3">
                {/* Video Call Button */}
                <button 
                    onClick={() => setIsCallActive(!isCallActive)}
                    className={`p-3 rounded-full transition-all duration-300 shadow-lg ${
                        isCallActive 
                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/30 rotate-0' 
                        : 'bg-white/10 text-green-400 hover:bg-green-500 hover:text-white hover:rotate-12 border border-white/5'
                    }`}
                    title="Toggle Video Call"
                >
                    {isCallActive ? <PhoneOff size={20} /> : <Phone size={20} />}
                </button>

                {/* Toggle Sidebar Button (Mobile/Desktop) */}
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`p-3 rounded-full transition-all duration-300 ${
                        sidebarOpen ? 'bg-white/10 text-pink-300' : 'bg-transparent text-gray-400 hover:text-white'
                    }`}
                >
                    {sidebarOpen ? <PanelRightClose size={20} /> : <MessageSquare size={20} />}
                </button>

                <div className="w-px h-8 bg-white/10 mx-1 hidden md:block"></div>
                
                <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-10 h-10 ring-2 ring-white/20 hover:scale-105 transition' } }} />
            </div>
        </header>

        {/* 2. MAIN CONTENT STAGE */}
        <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center pt-20">
            
            {/* Background Ambient Glow */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${activeMode === 'movie' ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full"></div>
            </div>
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${activeMode === 'music' ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-900/20 blur-[120px] rounded-full"></div>
            </div>

            {/* A. MOVIE PLAYER */}
            {activeMode === 'movie' && (
                <div className="w-full h-full animate-in fade-in zoom-in-95 duration-700 p-4 md:p-6">
                    <VideoRoom />
                </div>
            )}

            {/* B. SPOTIFY MUSIC BOX */}
            {activeMode === 'music' && (
                <div className="w-full h-full flex items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 p-8">
                    <div className="w-full max-w-4xl bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                        {/* Decorative gradient for music card */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-teal-500"></div>
                        
                        <div className="text-center mb-8 relative z-10">
                             <div className="inline-block p-4 rounded-full bg-green-500/10 mb-4 ring-1 ring-green-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                <Music size={40} className="text-green-400 drop-shadow-md" />
                             </div>
                             <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Vibe Session</h2>
                             <p className="text-gray-400 font-medium">Curate the soundtrack of your moment.</p>
                        </div>
                        <div className="relative z-10">
                            <SpotifyMusicBox />
                        </div>
                    </div>
                </div>
            )}

            {/* C. FLOATING VIDEO CALL (Picture-in-Picture) */}
            {isCallActive && (
                <div className="absolute bottom-6 right-6 z-50 w-72 md:w-80 bg-gray-900/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in slide-in-from-bottom-20 fade-in duration-500 ring-1 ring-white/5">
                    <div className="bg-white/5 px-4 py-3 flex justify-between items-center cursor-move">
                        <span className="text-xs font-bold text-green-400 flex items-center gap-2 uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Live Connection
                        </span>
                        <button onClick={() => setIsCallActive(false)} className="text-gray-400 hover:text-white transition-colors">
                            ✕
                        </button>
                    </div>
                    <div className="h-48 md:h-56 bg-black/50 relative">
                        <CoupleCall /> 
                    </div>
                </div>
            )}

        </div>
      </div>

      {/* --- RIGHT SIDE: CHAT SIDEBAR --- */}
      <div className={`${sidebarOpen ? 'w-80 border-l border-white/10' : 'w-0 border-none'} transition-all duration-500 bg-[#0a0a0a] flex flex-col flex-shrink-0 z-30 shadow-2xl`}>
        <div className="h-20 flex items-center px-6 border-b border-white/5 bg-white/[0.02]">
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 text-lg">
                Private Chat
            </span>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col relative custom-chat-theme">
            {!channel ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
                <Spinner />
                <span className="text-xs uppercase tracking-widest opacity-50">Connecting...</span>
              </div>
            ) : (
              <Channel channel={channel}>
                <Window>
                  <MessageList />
                  <MessageInput placeholder="Type a message..." />
                </Window>
              </Channel>
            )}
        </div>
      </div>

    </div>
  );
}