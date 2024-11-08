const { readAllowedIPs, writeAllowedIPs } = require('../util/fileUtils');
const allowedIPs = new Set();

function ipRestrictionMiddleware(req, res, next) {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    if (allowedIPs.has(clientIP)) {
        next();
    } else {
        console.warn(`Blocked access attempt from IP: ${clientIP}`);
        res.status(404).send('Not Found');
    }
}

async function initializeAllowedIPs(getPublicIP) {
    const hostIp = process.env.HOST_IP || await getPublicIP();
    console.log('Your public IP address is:', hostIp);
    
    // Load allowed IPs from JSON
    const savedIPs = readAllowedIPs();
    savedIPs.forEach(ip => allowedIPs.add(ip));

    // Add host IP if not in the list, then save if added
    if (!allowedIPs.has(hostIp)) {
        allowedIPs.add(hostIp);
        writeAllowedIPs(allowedIPs);
    }
}

module.exports = {
    ipRestrictionMiddleware,
    initializeAllowedIPs
};
