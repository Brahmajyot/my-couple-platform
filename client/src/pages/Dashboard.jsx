import React, { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { 
  Channel, 
  Window, 
  MessageList, 
  MessageInput, 
  useChatContext 
} from 'stream-chat-react';
import { Phone, PhoneOff, Film, Music, Tv } from 'lucide-react'; // Icons for UI

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
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      
      {/* --- LEFT SIDE: MAIN MEDIA AREA --- */}
      <div className="flex-1 flex flex-col relative min-w-0">
        
        {/* 1. TOP HEADER (CONTROLS) */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shadow-lg z-20">
            
            {/* Logo */}
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent hidden md:block">
                HeartStream
            </h1>

            {/* CENTER: MODE TOGGLE (The Switch) */}
            <div className="flex bg-gray-800 rounded-full p-1 border border-gray-700">
                <button 
                    onClick={() => setActiveMode('movie')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                        activeMode === 'movie' 
                        ? 'bg-secondary-purple text-white shadow-lg shadow-purple-500/30' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Film size={16} /> Movie
                </button>
                <button 
                    onClick={() => setActiveMode('music')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                        activeMode === 'music' 
                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Music size={16} /> Music
                </button>
            </div>

            {/* RIGHT: CALL & PROFILE */}
            <div className="flex items-center gap-4">
                {/* Video Call Toggle Button */}
                <button 
                    onClick={() => setIsCallActive(!isCallActive)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all border ${
                        isCallActive 
                        ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30' 
                        : 'bg-gray-800 text-green-400 border-green-500/30 hover:bg-green-500/20'
                    }`}
                >
                    {isCallActive ? <PhoneOff size={18} /> : <Phone size={18} />}
                    <span className="hidden md:inline">{isCallActive ? 'End Call' : 'Video Call'}</span>
                </button>

                <div className="w-px h-8 bg-gray-700 mx-2 hidden md:block"></div>
                
                <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-9 h-9 ring-2 ring-purple-500/30' } }} />
            </div>
        </header>

        {/* 2. MAIN CONTENT STAGE */}
        <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
            
            {/* A. MOVIE PLAYER */}
            {activeMode === 'movie' && (
                <div className="w-full h-full animate-in fade-in duration-500">
                    <VideoRoom />
                </div>
            )}

            {/* B. SPOTIFY MUSIC BOX */}
            {activeMode === 'music' && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black animate-in fade-in duration-500 p-8">
                    <div className="w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl shadow-green-900/20">
                        <div className="text-center mb-8">
                             <div className="inline-block p-4 rounded-full bg-green-500/10 mb-4">
                                <Music size={48} className="text-green-500" />
                             </div>
                             <h2 className="text-3xl font-bold text-white mb-2">Vibe Session</h2>
                             <p className="text-gray-400">Control the music for both of you.</p>
                        </div>
                        <SpotifyMusicBox />
                    </div>
                </div>
            )}

            {/* C. FLOATING VIDEO CALL (Picture-in-Picture) */}
            {isCallActive && (
                <div className="absolute bottom-6 right-6 z-50 w-64 md:w-80 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <div className="bg-gray-800 px-4 py-2 flex justify-between items-center border-b border-gray-700 cursor-move">
                        <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 
                            Live Call
                        </span>
                        <button onClick={() => setIsCallActive(false)} className="text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>
                    <div className="h-48 md:h-56 bg-black relative">
                        {/* We pass a 'compact' prop if your CoupleCall supports it, otherwise just rendering it is fine */}
                        <CoupleCall /> 
                    </div>
                </div>
            )}

        </div>
      </div>

      {/* --- RIGHT SIDE: CHAT SIDEBAR --- */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-l border-gray-800 bg-gray-900 flex flex-col flex-shrink-0 z-30`}>
        <div className="h-16 bg-gray-900 flex items-center px-4 border-b border-gray-800">
            <span className="font-bold text-gray-200">Chat & Notes</span>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col relative custom-chat-theme">
            {!channel ? (
              <div className="flex items-center justify-center h-full">
                <Spinner />
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