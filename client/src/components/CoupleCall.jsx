import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useStreamVideoClient, Call, StreamCall, SpeakerLayout, CallControls } from '@stream-io/video-react-sdk';

export default function CoupleCall({ partnerId }) {
    const { user } = useUser();
    const videoClient = useStreamVideoClient();
    const [call, setCall] = useState(null);

    const callId = [user?.id, partnerId].sort().join('_call-');

    const startCall = async () => {
        if (!videoClient || call) return;
        const newCall = videoClient.call('default', callId);

        try {
            await newCall.get(); 
            await newCall.join({ create: true }); 
            setCall(newCall);
        } catch (error) {
            console.error('Failed to join/create call:', error);
            alert('Failed to start the video call. Check console.');
        }
    };

    const endCall = () => {
        if (call) {
            call.leave().then(() => setCall(null));
        }
    };

    if (call) {
        return (
            <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden h-96 relative border-4 border-secondary-purple/70">
                <StreamCall call={call}>
                    <SpeakerLayout />
                    <CallControls onLeave={endCall} />
                </StreamCall>
                <div className="absolute top-2 left-2 text-xs font-bold text-white bg-secondary-purple px-2 py-1 rounded-full">LIVE</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-secondary-purple/50 flex flex-col items-center justify-center h-96 transition duration-300 hover:shadow-secondary-purple/70">
            <h3 className="text-3xl font-extrabold text-primary-pink mb-2">
                Live Video Date 📞
            </h3>
            <p className="text-gray-400 mb-6 text-center">
                Connect instantly for a shared movie stream or private chat.
            </p>
            <button 
                onClick={startCall} 
                disabled={!videoClient}
                className={`w-48 py-3 rounded-full font-bold text-lg transition duration-300 ${
                    !videoClient 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-secondary-purple hover:bg-primary-pink shadow-lg shadow-secondary-purple/50'
                }`}
            >
                {videoClient ? 'Start Call Now' : 'Connecting Services...'}
            </button>
        </div>
    );
}