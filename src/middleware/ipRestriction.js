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
    allowedIPs.add(hostIp);
}

module.exports = {
    ipRestrictionMiddleware,
    initializeAllowedIPs
};
