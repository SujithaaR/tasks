const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Authorization header missing or malformed.');
            return res.status(401).send('Unauthorized: Token missing or malformed');
        }

        const token = authHeader.split(' ')[1];
        // console.log('Received token:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded token:', decoded);

        const user = await User.findById(decoded.id);
        
        if (!user || user.role !== 'admin') {
            console.log('User not found or not an admin.');
            return res.status(403).send('Forbidden: User is not an admin');
        }
        
        req.user = user;
        next();
    } catch (error) {
        // if (error.name === 'TokenExpiredError') {
        //     console.error('Token expired:', error.message);
        //     return res.status(401).send('Unauthorized: Token has expired');
        // }
        // if (error.name === 'JsonWebTokenError') {
        //     console.error('Invalid token:', error.message);
        //     return res.status(401).send('Unauthorized: Invalid token');
        // }
        // console.error('Error in isAdmin middleware:', error.message);
        res.status(500).send(`Server Error: ${error.message}`);
    }
};


// Middleware to check for team lead role
const isTeamLead = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).send('Unauthorized');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'teamlead') {
            return res.status(403).send('Forbidden');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Middleware to check for user role
const isUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).send('Unauthorized');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'user') {
            return res.status(403).send('Forbidden');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

module.exports = { isAdmin, isTeamLead, isUser };
