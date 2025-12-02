import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { StreamChat } from 'stream-chat';
import { StreamVideoClient } from '@stream-io/video-client';
import { Chat } from 'stream-chat-react';
import { StreamVideo } from '@stream-io/video-react-sdk';
import { Spinner } from './Spinner'; 
const getApiBaseUrl = () => {
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
   
    return 'http://localhost:3000/api'; 
  }
 
  return `${window.location.origin}/api`;
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

      try {
        const clerkToken = await getToken({ template: 'stream-token' });
        
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

        const chatClientInstance = new StreamChat(apiKey);
        await chatClientInstance.connectUser({ id: userId, name: user.username || user.firstName }, token);
        setChatClient(chatClientInstance);

        const videoClientInstance = new StreamVideoClient({ 
          apiKey, 
          user: { id: userId, name: user.username || user.firstName }, 
          token 
        });
        setVideoClient(videoClientInstance);

      } catch (error) {
        console.error('Stream initialization error:', error);
        setLoadingError("Failed to connect to real-time services. Please try again.");
      }
    };

    initializeClient();

    return () => {
      chatClient?.disconnectUser();
      videoClient?.disconnect();
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
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-400">
        <Spinner /> 
        <span className="ml-3">Connecting to HeartStream services...</span>
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