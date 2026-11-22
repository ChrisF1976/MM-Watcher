# MM-Watcher
 
A [MagicMirror²](https://magicmirror.builders/) module that automatically refreshes the display whenever `config.js` or `css/custom.css` is saved.
 
It works as a regular MagicMirror module: a `node_helper` watches the files and notifies every connected client over MagicMirror's own socket. The page reloads itself, so it works in **Chrome, Firefox, Electron, kiosk mode, remote browsers** - on X11, Wayland, Linux, macOS or Windows. No `xdotool`/`ydotool` and no external scripts needed.
 
## Installation
 
```bash
cd ~/MagicMirror/modules
git clone https://github.com/ChrisF1976/MM-Watcher.git
```
 
Add to `config.js`:
 
```js
{
  module: "MM-Watcher"
}
```
 
(No `position` needed, the module has no visible output.)
 
## Options
 
| Option | Default | Description |
|---|---|---|
| `files` | `[]` | Paths relative to the MagicMirror root. Empty = `config.js` (respects `MM_CONFIG_FILE`) + `css/custom.css`. |
| `debounce` | `500` | Wait time (ms) after a change before reloading. |
| `cssHotReload` | `true` | A changed CSS file is re-applied without reloading the page. Set `false` for a full reload. |
| `restartCommand` | `""` | Command to restart the server when `config.js` changes, e.g. `"pm2 restart MagicMirror"`. Clients wait until the server is back, then reload. |
 
## Important: does `config.js` need a server restart?
 
Recent MagicMirror versions read `config.js` **once at server start**. A browser reload alone then only shows the *old* config. If your `config.js` changes do not take effect after the reload, set `restartCommand`:
 
```js
{
  module: "MM-Watcher",
  config: {
    restartCommand: "pm2 restart MagicMirror"
  }
}
```
 
Changes to `custom.css` never need a restart.
 
## Migrating from the old version
 
The old `watchConfig.js`, `mr.sh`, `pm2` entry and the `xdotool`/`ydotool` setup are no longer needed. Stop and remove the old pm2 process (`pm2 delete MM-Watcher`).
 
## License
 
MIT
 
