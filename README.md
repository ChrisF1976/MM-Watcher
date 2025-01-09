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
The `refreshCommand` should point to a shell script that restarts or refreshes your MagicMirror. I'm using [xdotool](https://github.com/jordansissel/xdotool) key-command in headless mode.
Below is an example `refresh/script.sh`:

```bash
export DISPLAY=:0.0 && xdotool key ctrl+r
```
Make the script executable:
```bash
chmod +x /path/to/your/refresh/script.sh
```
**Ensure the script works manually before automating it!**

## Manual Usage without pm2
Start the file watcher:
```bash
node watchConfig.js
```
Modify and save `config.js` to see the MagicMirror automatically refresh.

## Contributing

Feel free to submit issues or pull requests if you’d like to enhance this script.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file
