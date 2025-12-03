const express = require('express');
const { StreamChat } = require('stream-chat');
const { connectToDatabase } = require('../lib/db.js');
const User = require('../lib/models/user.js'); 
const router = express.Router();

router.post('/stream-token', async (req, res) => {
    
    const { clerkUserId } = req.body; 

    if (!clerkUserId) {
        return res.status(401).json({ error: 'Missing User ID.' });
    }
    
    if (!process.env.STREAM_API_KEY || !process.env.STREAM_SECRET_KEY) {
        return res.status(500).json({ error: 'Stream keys not configured on server.' });
    }
    
    const chatClient = StreamChat.getInstance(
        process.env.STREAM_API_KEY, 
        process.env.STREAM_SECRET_KEY
    );

    try {
        await connectToDatabase();
        // Ensure you have a User model matching this query
        const mongoUser = await User.findOne({ clerkId: clerkUserId });
        
        await chatClient.upsertUser({
            id: clerkUserId, 
            name: mongoUser?.username || 'Guest', 
        });

        const streamToken = chatClient.createToken(clerkUserId);

        res.status(200).json({ 
            token: streamToken, 
            apiKey: process.env.STREAM_API_KEY, 
            userId: clerkUserId 
        });

    } catch (error) {
        console.error('Error generating Stream token:', error);
        res.status(500).json({ error: 'Failed to generate communication token.' });
    }
});

module.exports = router;