import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Play, Link2, Film } from 'lucide-react';

export default function VideoRoom() {
  const [url, setUrl] = useState('');
  const [playing, setPlaying] = useState(false);
  const [inputUrl, setInputUrl] = useState('');

  const handleLoadVideo = (e) => {
    e.preventDefault();
    if (inputUrl) {
        setUrl(inputUrl);
        setPlaying(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden rounded-xl shadow-2xl border border-gray-800">
      
      {/* Decorative Background Glows (Subtle) */}
      <div className="absolute top-0 left-1/4 w-96 h-1 bg-pink-500/50 blur-[50px] pointer-events-none"></div>
      
      {/* --- Top Bar: Glass Control Panel --- */}
      <div className="relative z-20 bg-gray-900/80 backdrop-blur-md border-b border-white/10 p-4 flex gap-4 items-center shadow-lg">
        
        <div className="hidden md:flex items-center gap-2 text-pink-400 font-bold px-2 border-r border-white/10 pr-4">
            <Film size={20} />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Cinema
            </span>
        </div>

        <form onSubmit={handleLoadVideo} className="flex-1 flex gap-3">
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Link2 size={16} className="text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Paste YouTube, Drive, or Direct Video Link..." 
                  className="w-full bg-black/50 text-white text-sm rounded-xl pl-10 pr-4 py-3 border border-white/10 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all placeholder-gray-600"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                />
            </div>
            
            <button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-purple-900/50 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Play size={16} fill="currentColor" />
              <span className="hidden sm:inline">Play</span>
            </button>
        </form>
      </div>

      {/* --- Main Video Area --- */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden group">
        
        {url ? (
            <div className='w-full h-full animate-in fade-in duration-700'>
                <ReactPlayer 
                    url={url} 
                    playing={playing}
                    controls={true}
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    config={{
                        youtube: { playerVars: { showinfo: 1 } }
                    }}
                />
            </div>
        ) : (
            /* Empty State Design */
            <div className="text-center relative z-10 p-8">
                <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-20 animate-pulse"></div>
                    <Film size={64} className="text-gray-700 relative z-10" />
                </div>
                
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-200 to-gray-600 mb-2">
                    Ready for Movie Night?
                </h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                    Paste a link above to start watching together. <br/> 
                    Supports <span className="text-pink-500/80">YouTube</span>, <span className="text-purple-500/80">Google Drive</span>, and more.
                </p>
            </div>
        )}

        {/* Cinematic Grain Overlay (Subtle Texture) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      </div>
    </div>
  );
}