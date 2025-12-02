const express = require('express');
const axios = require('axios');
const { connectToDatabase } = require('../lib/db');
const Movie = require('../lib/models/Movie'); 
const router = express.Router();

router.post('/upload-url', async (req, res) => {
  
    const { clerkUserId, title } = req.body; 

    if (!clerkUserId || !title) {
        return res.status(400).json({ error: 'Missing user ID or movie title.' });
    }

    try {
        const apiEndpoint = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream`;

        
        const response = await axios.post(
            apiEndpoint,
            { 
                maxDurationSeconds: 7200, 
                meta: { title: title, uploaderId: clerkUserId } 
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const { uploadURL, uid } = response.data.result;

        
        await connectToDatabase();
        const newMovie = await Movie.create({
            uploaderId: clerkUserId, 
            cfUid: uid, 
            title: title,
            status: 'processing' 
        });

        
        res.status(200).json({ 
            uploadURL, 
            uid,
            message: 'Upload URL generated and metadata saved as processing.'
        });

    } catch (error) {
        console.error('Cloudflare API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to get Cloudflare upload URL.' });
    }
});


router.post('/update-status', async (req, res) => {
    const { cfUid, status } = req.body;
    
    if (!cfUid || !status) {
        return res.status(400).json({ error: 'Missing Cloudflare UID or status.' });
    }

    try {
        await connectToDatabase();
        const updatedMovie = await Movie.findOneAndUpdate(
            { cfUid: cfUid },
            { status: status },
            { new: true }
        );

        if (!updatedMovie) {
            return res.status(404).json({ error: 'Movie not found in database.' });
        }

        res.status(200).json({ message: 'Movie status updated.', movie: updatedMovie });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Failed to update movie status.' });
    }
});

module.exports = router;