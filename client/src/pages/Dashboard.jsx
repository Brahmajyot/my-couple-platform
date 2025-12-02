import React from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Channel, Window, MessageList, MessageInput, ChannelHeader } from 'stream-chat-react';
import CoupleCall from '../components/CoupleCall'; 
import MovieUploader from '../components/MovieUploader'; 
import SpotifyMusicBox from '../components/SpotifyMusicBox';

const coupleChannel = {}; 

export default function Dashboard() {
  const { user } = useUser();
  
  if (!user) return <div className="text-white text-center p-8">Loading...</div>;

  return (
    <div className="min-h-screen p-8 md:p-12">
      
      <header className="flex justify-between items-center pb-8 border-b border-gray-700 mb-8">
        <h1 className="text-4xl font-extrabold text-primary-pink">
          HeartStream 💖
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">Welcome, {user.username || user.firstName}!</span>
          <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-10 h-10 ring-2 ring-secondary-purple' } }} />
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid md:grid-cols-2 gap-8">
            <MovieUploader />
            <CoupleCall />
          </div>

          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden h-[500px]">
            <h2 className="p-4 text-xl font-bold text-primary-pink border-b border-gray-700">
              Private Chat
            </h2>
            <div className="h-[440px]">
          
                <div className="flex items-center justify-center h-full text-gray-500">
                    Chat UI Placeholder (Integrate Stream Chat here)
                </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-12 bg-gray-800 rounded-xl shadow-2xl p-6 h-[400px]">
            <h2 className="text-xl font-bold text-secondary-purple mb-4 border-b border-gray-700 pb-2">
              Shared Music Box 🎶
            </h2>
           
            <div className="flex items-center justify-center h-[calc(100%-40px)] bg-stone-900 rounded-lg">
                <p className="text-gray-400">Spotify Embed Widget will go here.</p>
                <div className="lg:col-span-1">
                   <div className="sticky top-12">
                              <SpotifyMusicBox /> 
              </div>
             </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}