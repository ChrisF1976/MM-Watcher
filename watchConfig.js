const fs = require('fs');
const { exec } = require('child_process');

// Path to your MagicMirror config.js
const configPath = '/home/pi/MagicMirror/config/config.js';

// Command to refresh the MagicMirror
const refreshCommand = '/path/to/your/refresh/script.sh';

fs.watch(configPath, (eventType, filename) => {
    if (eventType === 'change') {
        console.log(`Detected change in ${configPath}. Refreshing MagicMirror...`);
        exec(refreshCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error refreshing MagicMirror: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Refresh script error: ${stderr}`);
                return;
            }
            console.log(`MagicMirror refreshed successfully: ${stdout}`);
        });
    }
});

console.log(`Watching ${configPath} for changes...`);
