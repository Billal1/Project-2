const express = require("express")
const router  = express.Router()
const Email = require("../models/Email")

router.post('/new', async (req, res) => {
    try {
        const { name,email, message } = req.body;


        // Create a new document with the user's email
        const newEmail = new Email({name, email, message });
        await newEmail.save();

        res.status(201).json({ message: 'Email subscribed successfully' });
    } catch (error) {
        console.error('Error subscribing email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router