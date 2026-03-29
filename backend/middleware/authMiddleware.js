const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        // Token comes in format "Bearer <token>"
        const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET || 'secret');
        
        // Add user payload to request
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
