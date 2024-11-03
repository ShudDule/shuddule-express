const https = require('https');
const fs = require('fs');

function getPublicIP() {
    return new Promise((resolve, reject) => {
        https.get('https://api.ipify.org?format=json', (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data).ip));
        }).on('error', (err) => reject(err));
    });
}

function mkdirRecursive(dirPath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  getPublicIP,
  mkdirRecursive
};

