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
    pm2 start watchConfig.js --name "MM-Watcher"
    pm2 save
    ```

## Refresh Script Example
The `refreshCommand` should point to a shell script that restarts or refreshes your MagicMirror. The script below automatically detects whether you're using X11 or Wayland and uses the appropriate method.

### Step 1: Install Required Tools

**For X11 systems:**

```bash
sudo apt install xdotool
```

**For Wayland systems:**

```bash
sudo apt install ydotool
sudo usermod -a -G input $USER
```

**Important:** Reboot your system after installing ydotool to apply the group changes.

**For systems with both (or if unsure):** Install both tools - the script will choose the right one automatically:

```bash
sudo apt install xdotool ydotool
sudo usermod -a -G input $USER
```


### Step 2: Create the Refresh Script

Create your refresh script (e.g., /home/pi/refresh.sh):

```bash
#!/bin/bash

# Auto-detect X11 or Wayland and refresh MagicMirror
if [ -n "$WAYLAND_DISPLAY" ]; then
    # Wayland system detected
    if command -v ydotool &> /dev/null; then
        ydotool key ctrl+r
    else
        # Fallback for Xwayland
        export DISPLAY=:0
        export XAUTHORITY=/home/$USER/.Xauthority
        xdotool key ctrl+r
    fi
else
    # X11 system detected
    export DISPLAY=:0.0
    xdotool key ctrl+r
fi
```

### Step 3: Make the Script Executable

```bash
chmod +x /home/pi/refresh.sh
```

### Step 4: Test the Script

**For X11:**

```bash
/home/pi/refresh.sh
```

**For Wayland:**
You may need to run a test from the local console (not SSH) first to verify:

```bash
/home/pi/refresh.sh
```
If the MagicMirror doesn't refresh, try running the script from the Pi's local terminal (not over SSH).

### Step 5: Update watchConfig.js

In your `watchConfig.js`, point to your refresh script:

```bash
const refreshCommand = '/home/pi/refresh.sh';
```
**Notes:**
- The script works on both X11 and Wayland systems automatically
- No changes to watchConfig.js are needed when switching between display servers
- If using Wayland with SSH, you may need to run the watcher from the local terminal or use pm2 to start it on boot

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
