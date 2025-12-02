import React, { useState } from 'react';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';
import { useE2EEContext } from './E2EEProvider'; 

export function E2EEMessageInput() {
    const { client } = useChatContext();
    const { channel } = useChannelStateContext();
    const { encryptMessage } = useE2EEContext();
    const [text, setText] = useState('');

    const partner = channel.state.members.find(member => member.user_id !== client.user.id);
    const partnerId = partner?.user_id || null;

    const handleSend = async () => {
        if (!text.trim() || !partnerId) return;

        const encryptedText = encryptMessage(text, partnerId);
        
        try {
            await channel.sendMessage({ text: encryptedText });
            setText('');
        } catch (error) {
            console.error('Failed to send encrypted message:', error);
        }
    };

    return (
        <div className="flex p-4 border-t border-gray-700 bg-gray-900">
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Send an E2EE message..."
                className="flex-grow p-3 bg-stone-800 border-none rounded-l-lg text-white placeholder-gray-500 focus:ring-primary-pink focus:border-primary-pink"
                onKeyPress={(event) => {
                    if (event.key === 'Enter') handleSend();
                }}
            />
            <button
                onClick={handleSend}
                className="bg-primary-pink hover:bg-secondary-purple text-white font-bold py-3 px-6 rounded-r-lg transition duration-300"
            >
                Send
            </button>
        </div>
    );
}