const fs = require('fs');
const path = require('path');
const dirLogsPath = path.join(__dirname, '..', 'logs');

function loggingMiddleware(req, res, next) {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    const requestedUrl = req.originalUrl;
    const timestamp = new Date();
    const formattedDate = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = timestamp.toTimeString().split(' ')[0].replace(/:/g, '-');
    const logFileName = `${time}.txt`;
    const logFileDir = path.join(dirLogsPath, clientIP, ...formattedDate.split('-'));
    const logFilePath = path.join(logFileDir, logFileName);
    const logContent = `IP: ${clientIP}\nURL: ${requestedUrl}\nTimestamp: ${timestamp.toISOString()}\n\n`;

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
}

module.exports = {
    loggingMiddleware
};
