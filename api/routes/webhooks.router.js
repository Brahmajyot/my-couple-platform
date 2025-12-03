const express = require('express');
const { Webhook } = require('svix');
const bodyParser = require('body-parser');
const User = require('../lib/models/user.js'); 

const router = express.Router();


router.post('/', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or Vercel');
  }


  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

 
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).send('Error occured -- no svix headers');
  }


  const payload = req.body;
  const body = payload.toString();

  
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).send('Error occured');
  }

 
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, username } = evt.data;
    
    try {
        await User.create({
            clerkId: id,
            email: email_addresses[0].email_address,
            username: username || first_name,
            photo: evt.data.image_url,
        });
        console.log(`User ${id} created in DB`);
    } catch (error) {
        console.log('Error saving user to DB:', error);
    }
  }

  if (eventType === 'user.updated') {
     
      const { id, username, first_name } = evt.data;
      await User.findOneAndUpdate({ clerkId: id }, { 
          username: username || first_name,
          photo: evt.data.image_url
      });
  }

  if (eventType === 'user.deleted') {
      const { id } = evt.data;
      await User.findOneAndDelete({ clerkId: id });
  }

  return res.status(200).json({
    success: true,
    message: 'Webhook received',
  });
});

module.exports = router;