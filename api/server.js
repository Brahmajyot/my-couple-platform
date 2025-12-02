const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const webhooksRouter = require('./routes/webhooks.router');
const usersRouter = require('./routes/users.router');
const app = express();
const usersRouter = require('./routes/users.router');
const moviesRouter = require('./routes/movies.router');
const spotifyRouter = require('./routes/spotify.router')

app.use(cors({
    origin: process.env.FRONTEND_URL || '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
})); 

app.use(bodyParser.json()); 


app.use('/api/webhooks', webhooksRouter); 
app.use('/api/users', usersRouter); 
app.use('/api/movies', moviesRouter);
app.use('/api/spotify', spotifyRouter);


app.get('/api/status', (req, res) => {
    res.json({ status: 'OK', environment: process.env.NODE_ENV || 'development' });
});



module.exports = app;