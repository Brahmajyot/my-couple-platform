import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : `${window.location.origin}/api`;

export default function SpotifyMusicBox() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [currentTrackUri, setCurrentTrackUri] = useState('spotify:track:5FVd6RIdJcEabkZPFX5TzC'); 
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.length < 3) return;
    setIsSearching(true);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/spotify/search`, {
        params: { q: searchTerm },
      });
      setResults(response.data.tracks);
    } catch (error) {
      console.error('Frontend Spotify Search Failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTrack = (uri) => {
    setCurrentTrackUri(uri);
    setResults([]);
    setSearchTerm('');
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 h-[400px]">
      <h2 className="text-xl font-bold text-secondary-purple mb-4 border-b border-gray-700 pb-2">
        Shared Music Box 🎶
      </h2>

      <iframe 
        style={{ borderRadius: '12px' }}
        src={`https://open.spotify.com/embed/track/${currentTrackUri.split(':').pop()}?utm_source=generator&theme=0`}
        width="100%" 
        height="100" 
        frameBorder="0" 
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="mb-4"
      />

      <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
        <input
          type="search"
          placeholder="Search songs or artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 bg-stone-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-secondary-purple focus:border-secondary-purple"
        />
        <button 
          type="submit" 
          disabled={isSearching}
          className="bg-primary-pink py-2 px-4 rounded-lg font-bold hover:bg-primary-pink/80 transition duration-200"
        >
          {isSearching ? '...' : 'Search'}
        </button>
      </form>

      
      <div className="space-y-2 overflow-y-auto max-h-36">
        {results.map((track) => (
          <div 
            key={track.id} 
            onClick={() => handleSelectTrack(track.uri)}
            className="p-2 bg-stone-900 rounded-lg flex justify-between items-center cursor-pointer hover:bg-stone-800 transition duration-150"
          >
            <div>
              <p className="text-sm font-medium text-white">{track.name}</p>
              <p className="text-xs text-gray-400">{track.artist}</p>
            </div>
            <span className="text-secondary-purple text-xs">SELECT</span>
          </div>
        ))}
      </div>
    </div>
  );
}