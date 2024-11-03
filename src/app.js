const express = require('express');
const fs = require('fs');
const path = require('path');
const { getPublicIP } = require('./util');

const app = express();
const port = process.env.PORT || 3000;
const dirLogsPath = path.join(__dirname, 'logs');

// Import routes
const homeRoute = require('./routes/home');

// Define allowed IPs
const allowedIPs = new Set([
    '',
    ''
]);

async function main() {
    try {
        const hostIp = process.env.HOST_IP || await getPublicIP();
        console.log('Your public IP address is:', hostIp);
        allowedIPs.add(hostIp);
    } catch (error) {
        console.error('Error retrieving public IP:', error);
    }

    // Logging Middleware
    app.use((req, res, next) => {
        const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        const requestedUrl = req.originalUrl;
        const timestamp = new Date();
        const formattedDate = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = timestamp.toTimeString().split(' ')[0].replace(/:/g, '-');

        const logFileName = `${time}.txt`;
        const logFileDir = path.join(dirLogsPath, clientIP, ...formattedDate.split('-'));
        const logFilePath = path.join(logFileDir, logFileName);
        const logContent = `IP: ${clientIP}\nURL: ${requestedUrl}\nTimestamp: ${timestamp.toISOString()}\n\n`;

        // Ensure logs directory exists and write log file
        fs.mkdir(logFileDir, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating log directory:', err);
                return next();
            }

            fs.writeFile(logFilePath, logContent, (err) => {
                if (err) {
                    console.error('Error writing log file:', err);
                }
                next();
            });
        });
    });

    // IP Restriction Middleware
    app.use((req, res, next) => {
        const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        if (allowedIPs.has(clientIP)) {
            next();
        } else {
            console.warn(`Blocked access attempt from IP: ${clientIP}`);
            res.status(404).send('Not Found');
        }
    });

    // Use routes
    app.use('/', homeRoute);

    // Catch-all route for undefined paths
    app.use((req, res) => {
        res.status(404).send('Not Found');
    });

    // Start server
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

main();
