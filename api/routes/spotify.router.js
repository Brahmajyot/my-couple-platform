const express = require('express');
const router = express.Router();

// We are now handling Spotify on the Frontend (Client-side)
// using the "Paste Link" method.

router.get('/', (req, res) => {
    res.json({ message: 'Spotify route is active but logic is handled on frontend.' });
});

module.exports = router;