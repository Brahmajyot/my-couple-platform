const express = require('express');
const { Webhook } = require('svix');
const { connectToDatabase } = require('../lib/db');
const User = require('../lib/models/User');

const router = express.Router();

const rawBodyMiddleware = (req, res, next) => {
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', chunk => req.rawBody += chunk);
    req.on('end', () => next());
};

router.post('/clerk', rawBodyMiddleware, async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        return res.status(500).json({ error: 'Missing webhook secret' });
    }

    const payload = req.rawBody;
    const headers = req.headers;

    const wh = new Webhook(WEBHOOK_SECRET);
    let event;
    try {
        event = wh.verify(payload, {
            'svix-id': headers['svix-id'],
            'svix-timestamp': headers['svix-timestamp'],
            'svix-signature': headers['svix-signature'],
        });
    } catch (err) {
        console.error('Webhook verification failed:', err.message);
        return res.status(400).json({ error: 'Invalid signature' });
    }

    
    await connectToDatabase();
    const { id, email_addresses, username } = event.data;
    const primaryEmail = email_addresses[0].email_address;

    try {
        if (event.type === 'user.created') {
            await User.create({ clerkId: id, email: primaryEmail, username });
        } else if (event.type === 'user.updated') {
            await User.findOneAndUpdate({ clerkId: id }, { email: primaryEmail, username }, { new: true });
        }
        return res.status(200).json({ success: true, message: `Processed event: ${event.type}` });
    } catch (dbError) {
        console.error('DB error:', dbError);
        return res.status(500).json({ error: 'Database operation failed.' });
    }
});

module.exports = router;