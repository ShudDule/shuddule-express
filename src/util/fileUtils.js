const fs = require('fs');
const path = require('path');

// Function to ensure directory and file exist
function ensureFileExists(filePath) {
    const dirPath = path.dirname(filePath);

    // Recursively create the directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Create an empty JSON file if it doesn't exist
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([])); // Initialize with empty array
    }
}

module.exports = {
    ensureFileExists,
};
