const fs = require('fs').promises;
const path = require('path');

// Function to ensure directory and file exist
async function ensureFileExists(filePath) {
    const dirPath = path.dirname(filePath);

    // Recursively create the directory if it doesn't exist
    await fs.mkdir(dirPath, { recursive: true });

    // Create an empty JSON file if it doesn't exist
    try {
        await fs.access(filePath);
    } catch (err) {
        await fs.writeFile(filePath, JSON.stringify([])); // Initialize with empty array
    }
}

async function readAllowedIPs(allowedIPsPath) {
    await ensureFileExists(allowedIPsPath); // Ensure file exists before reading
    const data = await fs.readFile(allowedIPsPath, 'utf8');
    return JSON.parse(data);
}

async function writeAllowedIPs(allowedIPsPath, ips) {
    await ensureFileExists(allowedIPsPath); // Ensure file exists before writing
    await fs.writeFile(allowedIPsPath, JSON.stringify([...ips]), 'utf8');
}

module.exports = {
    ensureFileExists,
    readAllowedIPs,
    writeAllowedIPs
};
