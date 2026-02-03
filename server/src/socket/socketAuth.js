const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const socketAuth = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        // console.log("Socket auth token:", token);  
        try {
            if (!token) {
                return next(new Error('Token missing'));
            }
            const decoded = jwt.verify(token, JWT_SECRET);
            socket.user = decoded;

            console.log(`User ${socket.user.username} connected with ID: ${socket.user.user_id}`);

            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new Error('Token expired'));
            }
            return next(new Error('Invalid token'));
        }
    });
};

module.exports = socketAuth;
