import React, { useState } from 'react';

export default function SpotifyMusicBox() {
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');

  const handleLoadMusic = (e) => {
    e.preventDefault();
    if (!spotifyUrl) return;

    let newUrl = spotifyUrl;

    // ✅ FIX: Real logic to convert standard Spotify links to Embed links
    // Input:  https://open.spotify.com/track/12345...
    // Output: https://open.spotify.com/embed/track/12345...
    
    if (newUrl.includes('open.spotify.com') && !newUrl.includes('/embed')) {
        newUrl = newUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }

    setEmbedUrl(newUrl);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
        
        {/* Input Bar */}
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-xl">
            <form onSubmit={handleLoadMusic} className="flex gap-3">
                <input 
                    type="text" 
                    placeholder="Paste Spotify Song or Playlist Link..." 
                    className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-green-500 outline-none"
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                />
                <button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition shadow-lg shadow-green-900/50"
                >
                    Load
                </button>
            </form>
        </div>

        {/* The Player */}
        <div className="relative w-full aspect-video md:aspect-[2/1] bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            {embedUrl ? (
                <iframe 
                    style={{ borderRadius: '12px' }} 
                    src={`${embedUrl}?utm_source=generator&theme=0`} 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allowFullScreen="" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                ></iframe>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <span className="text-4xl mb-2">🎵</span>
                    <p>Paste a link to start the vibes.</p>
                </div>
            )}
        </div>

        <p className="text-center text-gray-500 text-sm">
            Tip: Paste a Playlist link for endless vibes.
        </p>
    </div>
  );
}