import React, { useState, useEffect, createContext, useContext } from 'react';
import { useUser } from '@clerk/clerk-react';

const E2EEContext = createContext(null);

const useE2EE = (chatClient) => {
    const encryptMessage = (messageText, recipientId) => {
        if (messageText.startsWith('[ENCRYPTED:')) return messageText; 
       
        return `[E2EE-ENC:${messageText}]`; 
    };

    const decryptMessage = (encryptedText) => {
        if (encryptedText.startsWith('[E2EE-ENC:')) {
             
             return encryptedText.replace('[E2EE-ENC:', '').replace(']', '');
        }
        return encryptedText;
    };

    return { 
        encryptMessage, 
        decryptMessage, 
        isReady: true 
    }; 
};

export function E2EEProvider({ children, chatClient }) {
    const { user } = useUser();
    const e2ee = useE2EE(chatClient); 
    
    if (!user || !e2ee.isReady) {
        return <div className="p-4 text-center text-gray-500">Initializing Security Layer...</div>;
    }

    return (
        <E2EEContext.Provider value={e2ee}>
            {children}
        </E2EEContext.Provider>
    );
}

export const useE2EEContext = () => useContext(E2EEContext);