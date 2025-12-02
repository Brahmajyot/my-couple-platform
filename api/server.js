const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { clerkMiddleware } = require('@clerk/express');

// Routes
const webhooksRouter = require('./routes/webhooks.router');
const usersRouter = require('./routes/users.router');
const moviesRouter = require('./routes/movies.router');
const spotifyRouter = require('./routes/spotify.router');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
})); 

app.use('/api/webhooks', webhooksRouter); 
app.use(bodyParser.json()); 
app.use(clerkMiddleware());

// App Routes
app.use('/api/users', usersRouter); 
app.use('/api/movies', moviesRouter);
app.use('/api/spotify', spotifyRouter);

app.get('/api/status', (req, res) => {
    res.json({ status: 'OK', environment: process.env.NODE_ENV || 'development' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`✅ Server running locally on port ${PORT}`);
    });
}

module.exports = app;