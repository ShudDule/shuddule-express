const https = require('https');

function getPublicIP() {
    return new Promise((resolve, reject) => {
        https.get('https://api.ipify.org?format=json', (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data).ip));
        }).on('error', (err) => reject(err));
    });
}

module.exports = {
    getPublicIP
};
