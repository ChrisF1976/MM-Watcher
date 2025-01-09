# MM-Watcher - MagicMirror Config.js Auto-Refresh Script

This project provides a script to monitor changes to the `config.js` file of a [MagicMirror²](https://magicmirror.builders/) installation. When the file is updated and saved, the MagicMirror automatically refreshes to apply the changes.

## Features
- Monitors `config.js` for changes in real-time.
- Automatically refreshes the MagicMirror when the configuration is updated.
- Lightweight and easy to integrate with existing MagicMirror setups.
- Can be run as a background process using a process manager like `pm2`.

## Requirements
- **Node.js**
- A shell script to restart or refresh the MagicMirror.

## Installation

1. **Clone the repository or copy the script to your machine:**
    ```bash
    git clone https://github.com/ChrisF1976/MM-Watcher.git
    cd MM-Watcher
    ```

2. **Update the script with the correct path to your `config.js` file and refresh command:**
   - Open `watchConfig.js` in a text editor.
   - Modify the `configPath` variable to point to your MagicMirror `config.js` file:
     ```javascript
     const configPath = '/home/pi/MagicMirror/config/config.js';
     ```
   - Update the `refreshCommand` variable with the path to your refresh script:
     ```javascript
     const refreshCommand = '/path/to/your/refresh/script.sh';
     ```

3. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Make your `watchConfig.js` executable:**
    ```bash
    chmod +x watchConfig.js
    ```

5. **(Optional) Set up the script to run on startup using `pm2`:**
    ```bash
    npm install -g pm2
    pm2 start watchConfig.js --name "MM-Watcher"
    pm2 save
    ```

## Refresh Script Example
The `refreshCommand` should point to a shell script that restarts or refreshes your MagicMirror. 
I'm using an XdoTool Key-command
Below is an example `refresh/script.sh`:

```bash
#!/bin/bash
cd /home/pi/MagicMirror
DISPLAY=:0 npm start
```
