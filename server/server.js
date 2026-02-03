const express = require('express');
const cors = require('cors');

const http = require('http');
const socketio = require('socket.io');

const configs = require("./src/config/config");
const router = require('./src/routes/router');
const socketAuth = require('./src/socket/socketAuth');

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

socketAuth(io);
require('./src/socket/socketHandler')(io);

app.use(cors());
app.use(express.json());

app.use('/api',router);

server.listen(configs.PORT , () => {
    console.log(`Server is running on port ${configs.PORT}`);
})