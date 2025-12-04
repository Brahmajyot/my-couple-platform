import React, { useState } from "react";
import ReactPlayer from "react-player";
import { Play, Link2, Film, AlertTriangle, Trash2 } from "lucide-react";

export default function VideoRoom() {
  const [url, setUrl] = useState(null); // Start as null, not empty string
  const [inputUrl, setInputUrl] = useState("");
  const [error, setError] = useState("");

  // --- HELPER: CLEAN THE URL ---
  const getCleanUrl = (rawInput) => {
    if (!rawInput) return null;
    const trimmed = rawInput.trim();

    try {
      // YouTube Short -> Normal
      if (trimmed.includes("youtu.be")) {
        const id = trimmed.split("youtu.be/")[1]?.split("?")[0];
        return `https://www.youtube.com/watch?v=${id}`;
      }
      // Google Drive View -> Direct Download
      if (trimmed.includes("drive.google.com/file")) {
        const id = trimmed.match(/\/file\/d\/(.*?)\//)?.[1];
        if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
      }
    } catch (e) {
      return trimmed;
    }
    return trimmed;
  };

  const handlePlay = (e) => {
    e.preventDefault();
    setError("");
    
    if (!inputUrl) return;

    const clean = getCleanUrl(inputUrl);
    if (!clean) {
        setError("Invalid link.");
        return;
    }

    setUrl(clean); // Only set URL when user clicks Play
  };

  const clearVideo = () => {
      setUrl(null);
      setInputUrl("");
      setError("");
  };

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden rounded-xl shadow-2xl border border-gray-800">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-1 bg-pink-500/50 blur-[50px] pointer-events-none"></div>

      {/* --- TOP BAR --- */}
      <div className="relative z-20 bg-gray-900/80 backdrop-blur-md border-b border-white/10 p-4 flex gap-4 items-center shadow-lg">
        
        <div className="hidden md:flex items-center gap-2 text-pink-400 font-bold px-2 border-r border-white/10 pr-4">
          <Film size={20} />
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Cinema
          </span>
        </div>

        <form onSubmit={handlePlay} className="flex-1 flex gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Link2 size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Paste YouTube or Drive Link..."
              className="w-full bg-black/50 text-white text-sm rounded-xl pl-10 pr-4 py-3 border border-white/10 focus:border-pink-500/50 outline-none transition-all placeholder-gray-600"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
          </div>

          {url ? (
             <button
                type="button"
                onClick={clearVideo}
                className="bg-gray-700 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
             >
                <Trash2 size={16} />
             </button>
          ) : (
            <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2"
            >
                <Play size={16} fill="currentColor" />
                <span className="hidden sm:inline">Play</span>
            </button>
          )}
        </form>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="bg-red-500/10 text-red-400 flex items-center gap-2 px-4 py-2 border-b border-red-500/20 text-sm">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* --- MAIN VIDEO AREA --- */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden group">
        
        {/* NUCLEAR FIX: Only render ReactPlayer if 'url' is not null */}
        {url ? (
          <div className="w-full h-full animate-in fade-in duration-700">
            <ReactPlayer
              key={url} // Forces a fresh player for every new video
              url={url}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0 }}
              config={{
                youtube: { playerVars: { showinfo: 1, autoplay: 1 } },
              }}
              onError={(e) => {
                  console.log("Player Error:", e);
                  setError("Video failed to load. (Is it private?)");
                  setUrl(null); // Immediately unmount player if error
              }}
            />
          </div>
        ) : (
          /* Empty State */
          <div className="text-center relative z-10 p-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-20 animate-pulse"></div>
              <Film size={64} className="text-gray-700 relative z-10" />
            </div>

            <h3 className="text-2xl font-bold text-gray-500 mb-2">
              Ready to Watch?
            </h3>
            <p className="text-gray-600 text-sm">
              Paste a link above to start the movie.
            </p>
          </div>
        )}

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      </div>
    </div>
  );
}