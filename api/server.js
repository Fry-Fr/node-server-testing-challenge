const express = require('express');

const server = express();

server.use(express.json());

server.get('/', (req, res, next) => {
    res.json({ api: "up" })
});

server.use((err, req, res, next) => {
    res.status( err.status || 500 ).json({
        message: err.message,
        stack: err.statck,
    });
});

module.exports = server;