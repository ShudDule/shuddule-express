const express = require('express');

const { getPublicIP } = require('./util/getPublicIP');
const { ensureFileExists } = require('./util/fileUtils');
const {
    ipRestrictionMiddleware,
    initializeAllowedIPs
} = require('./middleware/ipRestriction');
const { loggingMiddleware } = require('./middleware/logging');

const homeRoute = require('./routes/home');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // Specify the views directory

const hostUrl = process.env.HOST_URL || 'http://localhost';
const port = process.env.PORT || 3000;

// Prepare file
const pathData = 'data';
const files = [`${pathData}/allowed_ip.json`];

async function prepareFiles() {
    for (const file of files) {
        await ensureFileExists(file);
    }
}

async function main() {
    try {
        await prepareFiles();
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
        console.log(`Server running at ${hostUrl}`);
    });
}

main();
