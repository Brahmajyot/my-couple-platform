import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
// ✅ FIX: Import both Client and Component from the same SDK
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import Spinner from './Spinner';

const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api'; 
  }
  return '/api';
};

export default function StreamProvider({ children }) {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn, getToken } = useAuth(); 
  
  const [chatClient, setChatClient] = useState(null);
  const [videoClient, setVideoClient] = useState(null);
  const [loadingError, setLoadingError] = useState(null);

  const isLoaded = userLoaded && authLoaded;
  const API_BASE_URL = getApiBaseUrl();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) return;

    const initializeClient = async () => {
      const apiKey = import.meta.env.VITE_STREAM_API_KEY;
      const clerkUserId = user.id;

      if (!apiKey) {
        setLoadingError("Stream API Key is missing. Check Vercel Environment Variables.");
        return;
      }

      try {
        // 1. Get Clerk Token
        const clerkToken = await getToken(); 
        
        // 2. Call Backend to get Stream Token
        const response = await fetch(`${API_BASE_URL}/users/stream-token`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clerkToken}`, 
          },
          body: JSON.stringify({ clerkUserId }), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Token Fetch Failed: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        const { token, userId } = data;

        // 3. Setup Chat Client
        const chatClientInstance = new StreamChat(apiKey);
        await chatClientInstance.connectUser(
            { 
                id: userId, 
                name: user.username || user.firstName || 'User',
                image: user.imageUrl 
            }, 
            token
        );
        setChatClient(chatClientInstance);

        // 4. Setup Video Client
        const videoClientInstance = new StreamVideoClient({ 
          apiKey, 
          user: { 
              id: userId, 
              name: user.username || user.firstName || 'User',
              image: user.imageUrl 
          }, 
          token 
        });
        setVideoClient(videoClientInstance);

      } catch (error) {
        console.error('Stream initialization error:', error);
        setLoadingError("Failed to connect to real-time services.");
      }
    };

    initializeClient();

    return () => {
      // Cleanup
      if (chatClient) chatClient.disconnectUser();
      if (videoClient) videoClient.disconnectUser();
      setChatClient(null);
      setVideoClient(null);
    };
  }, [isLoaded, isSignedIn, user?.id, getToken]);

  if (!isLoaded || !isSignedIn) {
    return children;
  }

  if (loadingError) {
      return <div className="text-center p-12 text-red-500">{loadingError}</div>
  }

  if (!chatClient || !videoClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-lg text-gray-400">
        <Spinner /> 
        <span className="ml-3 animate-pulse">Connecting to HeartStream...</span>
      </div>
    );
  }

  return (
    <Chat client={chatClient}>
      <StreamVideo client={videoClient}>
        {children}
      </StreamVideo>
    </Chat>
  );
}