const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({role:'user'});
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
// In your backend routes file (e.g., userRoutes.js)

router.get('/teamleads', async (req, res) => {
    try {
        const teamLeads = await User.find({ role: 'teamlead' });
        res.json(teamLeads);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
