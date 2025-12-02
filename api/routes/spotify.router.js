const express = require('express');
const axios = require('axios');

const router = express.Router();

let cachedAccessToken = null;
let tokenExpiry = 0;

const getSpotifyAccessToken = async () => {
    if (cachedAccessToken && Date.now() < tokenExpiry) {
        return cachedAccessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("Spotify API keys are not set on the server.");
    }

    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        cachedAccessToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
        
        return cachedAccessToken;

    } catch (error) {
        console.error('Spotify token generation failed:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Spotify.');
    }
};


router.get('/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Search query (q) is required.' });
    }

    try {
        const accessToken = await getSpotifyAccessToken();

        const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                q: query,
                type: 'track', 
                limit: 5,     
            },
        });

        const tracks = searchResponse.data.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            uri: track.uri, 
        }));

        res.status(200).json({ tracks });

    } catch (error) {
        console.error('Spotify Search Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;