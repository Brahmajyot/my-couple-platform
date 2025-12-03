import React, { useState, useEffect } from 'react';
import { StreamVideo, StreamCall, useStreamVideoClient, useCall, CallParticipantsList, CallControls, SpeakerLayout } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/clerk-react';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import Spinner from './Spinner';

export default function CoupleCall() {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [call, setCall] = useState(null);

  useEffect(() => {
    if (!client || !user) return;

    // Create a call with a fixed ID 'room-1' so both partners join the same one
    const myCall = client.call('default', 'room-1'); 
    
    const joinCall = async () => {
      try {
        await myCall.join({ create: true });
        setCall(myCall);
      } catch (err) {
        console.error("Error joining call:", err);
      }
    };

    joinCall();

    return () => {
      // Optional: Leave call on unmount (or keep it running in background)
      // myCall.leave(); 
    };
  }, [client, user]);

  if (!call) return <div className="h-full w-full flex items-center justify-center bg-gray-900"><Spinner /></div>;

  return (
    <div className="w-full h-full overflow-hidden rounded-xl bg-black">
      <StreamCall call={call}>
        {/* Simple layout that fits in small boxes */}
        <div className="relative w-full h-full flex flex-col">
            <div className="flex-1 min-h-0">
                 <SpeakerLayout participantsBarPosition="bottom" />
            </div>
            <div className="bg-gray-900/80 backdrop-blur p-2 flex justify-center scale-75 origin-bottom">
                 <CallControls />
            </div>
        </div>
      </StreamCall>
    </div>
  );
}