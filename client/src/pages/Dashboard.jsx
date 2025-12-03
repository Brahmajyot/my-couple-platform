import React, { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { 
  Channel, 
  Window, 
  MessageList, 
  MessageInput, 
  ChannelHeader, 
  Thread, 
  useChatContext 
} from 'stream-chat-react';
import CoupleCall from '../components/CoupleCall'; 
import MovieUploader from '../components/MovieUploader'; 
import SpotifyMusicBox from '../components/SpotifyMusicBox';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  const { user } = useUser();
  const { client } = useChatContext(); // Get the Stream Client from context
  const [channel, setChannel] = useState(null);

  // 1. Setup the Chat Channel Automatically
  useEffect(() => {
    if (!client || !user) return;

    const loadChannel = async () => {
      // Create a specific channel for the couple (using a fixed ID for simplicity)
      const channel = client.channel('messaging', 'our-private-space', {
        name: 'Just Us ❤️',
        image: 'https://cdn-icons-png.flaticon.com/512/2904/2904973.png',
        members: [user.id], // In a real app, you'd add the partner's ID here too
      });

      await channel.watch();
      setChannel(channel);
    };

    loadChannel();
  }, [client, user]);

  if (!user) return <div className="flex h-screen items-center justify-center bg-gray-900"><Spinner /></div>;

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-[#1a1025] to-gray-950 text-white p-6 md:p-10 font-sans">
      
      {/* --- Header --- */}
      <header className="flex justify-between items-center mb-10 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            HeartStream
          </h1>
          <p className="text-gray-400 text-sm mt-1">{greeting}, {user.username || user.firstName}.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
                <p className="text-xs text-gray-500 uppercase tracking-widest">Status</p>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-300">Connected</span>
                </div>
            </div>
          <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-11 h-11 ring-2 ring-purple-500/50' } }} />
        </div>
      </header>

      {/* --- Main Grid --- */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (Chat & Actions) - Spans 8 columns */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Action Row: Call & Upload */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="transform hover:scale-[1.01] transition duration-300">
                <CoupleCall />
            </div>
            <div className="transform hover:scale-[1.01] transition duration-300">
                <MovieUploader />
            </div>
          </div>

          {/* Main Chat Window */}
          <div className="flex-grow bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] relative">
            {!channel ? (
              <div className="flex items-center justify-center h-full text-gray-500 gap-2">
                <Spinner /> Loading your private space...
              </div>
            ) : (
              <Channel channel={channel}>
                <Window>
                  <div className="bg-white/5 border-b border-white/5 p-2">
                    <ChannelHeader />
                  </div>
                  <MessageList />
                  <MessageInput focus />
                </Window>
                <Thread />
              </Channel>
            )}
            
            {/* Decorative background blur for chat */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          </div>
        </div>

        {/* RIGHT COLUMN (Music & Vibe) - Spans 4 columns */}
        <div className="lg:col-span-4 space-y-8">
            
            {/* Music Box */}
            <div className="sticky top-8">
                <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                        <h2 className="text-lg font-semibold text-purple-300">Our Vibe 🎵</h2>
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">Now Playing</span>
                    </div>
                    
                    {/* Spotify Component */}
                    <div className="rounded-xl overflow-hidden shadow-lg border border-white/5">
                        <SpotifyMusicBox /> 
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-xs italic">
                            "Music is the shorthand of emotion."
                        </p>
                    </div>
                </div>

                {/* Optional: Date/Countdown Card or Quote */}
                <div className="mt-8 bg-white/5 border border-white/5 rounded-2xl p-6 text-center">
                    <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Together Since</p>
                    <p className="text-2xl font-mono text-pink-300">2025</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}