import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
// ✅ Renamed Link to LinkIcon to avoid confusion with React Router
import { Link as LinkIcon, Plus, Loader2 } from 'lucide-react';

const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api'; 
  }
  return '/api'; 
};

export default function MovieUploader() {
  const { user } = useUser();
  
  const [title, setTitle] = useState('');
  const [movieUrl, setMovieUrl] = useState(''); 
  const [status, setStatus] = useState('Idle');

  const handleSaveLink = async (e) => {
    e.preventDefault();

    if (!movieUrl || !title) {
      alert("Please enter a title and a valid link.");
      return;
    }

    setStatus('Saving...');

    try {
      const API_BASE_URL = getApiBaseUrl();
      
      await axios.post(`${API_BASE_URL}/movies/save-link`, {
        title,
        url: movieUrl,
        clerkUserId: user.id,
        username: user.username || user.firstName
      });

      setStatus('✅ Added to Library!');
      setTitle('');
      setMovieUrl('');
      
      setTimeout(() => setStatus('Idle'), 3000);

    } catch (error) {
      console.error("Save failed:", error);
      setStatus(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-[50px] pointer-events-none"></div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
          {/* ✅ Used the renamed icon here */}
          <LinkIcon size={20} className="text-purple-400" />
          Add to Collection
        </h3>

        <form onSubmit={handleSaveLink} className="space-y-4">
          
          <div>
            <label className="text-xs text-gray-400 ml-1 mb-1 block">Movie Title</label>
            <input 
              type="text" 
              placeholder="e.g. Our First Date Movie" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 ml-1 mb-1 block">Paste Link (YouTube, Drive, MP4)</label>
            <input 
              type="url" 
              placeholder="https://youtube.com/watch?v=..." 
              value={movieUrl} 
              onChange={(e) => setMovieUrl(e.target.value)} 
              required
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-blue-300 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm"
            />
          </div>
          
          <button 
            type="submit"
            disabled={status === 'Saving...'}
            className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              status === 'Saving...'
                ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] text-white'
            }`}
          >
            {status === 'Saving...' ? (
                <>
                    <Loader2 size={18} className="animate-spin" /> Saving...
                </>
            ) : (
                <>
                    <Plus size={18} /> Add to Library
                </>
            )}
          </button>
        </form>

        {status !== 'Idle' && status !== 'Saving...' && (
            <p className={`mt-3 text-center text-sm font-medium animate-in fade-in slide-in-from-top-2 ${status.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {status}
            </p>
        )}
      </div>
    </div>
  );
}