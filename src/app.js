const express = require('express');
const { getPublicIP } = require('./util/getPublicIP');

const {
    ipRestrictionMiddleware,
    initializeAllowedIPs
} = require('./middleware/ipRestriction');

const { loggingMiddleware } = require('./middleware/logging');
const homeRoute = require('./routes/home');

const app = express();

const hostUrl = process.env.HOST_URL || 'http://localhost';

const port = process.env.PORT || 3000;

async function main() {
    try {
        await initializeAllowedIPs(getPublicIP);
    } catch (error) {
        console.error('Error retrieving public IP:', error);
    }

    app.use(loggingMiddleware);
    app.use(ipRestrictionMiddleware);
    app.use('/', homeRoute);

    app.use((req, res) => {
        res.status(404).send('Not Found');
    });

    app.listen(port, () => {
        console.log(`Server running at ${hostUrl}:${port}`);
    });
}

main();
