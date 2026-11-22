const NodeHelper = require("node_helper");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { exec } = require("child_process");

module.exports = NodeHelper.create({
	start () {
		this.started = false;
		this.watchers = [];
		this.timers = {};
		this.hashes = {};
	},

	socketNotificationReceived (notification, payload) {
		// Jeder Client schickt seine Config; wir starten nur einmal.
		if (notification === "MM_WATCHER_INIT" && !this.started) {
			this.started = true;
			this.cfg = payload;
			this.setup();
		}
	},

	rootPath () {
		return global.root_path || path.resolve(__dirname, "..", "..");
	},

	resolveFiles () {
		const root = this.rootPath();
		const files = [];
		if (Array.isArray(this.cfg.files) && this.cfg.files.length) {
			this.cfg.files.forEach((f) => files.push(path.resolve(root, f)));
		} else {
			// MM kennt den tatsaechlichen Pfad (auch bei MM_CONFIG_FILE)
			files.push(path.resolve(root, global.configuration_filename || "config/config.js"));
			files.push(path.resolve(root, "css/custom.css"));
		}
		return files;
	},

	hashOf (file) {
		try {
			return crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex");
		} catch (e) {
			return null;
		}
	},

	setup () {
		const files = this.resolveFiles();
		// Verzeichnisse beobachten statt Dateien: Editoren speichern oft per
		// "schreibe temp + rename", wodurch ein Datei-Watcher ins Leere laeuft.
		const dirs = [...new Set(files.map((f) => path.dirname(f)))];

		files.forEach((f) => {
			this.hashes[f] = this.hashOf(f);
			console.log(`[MM-Watcher] watching ${f}`);
		});

		dirs.forEach((dir) => {
			try {
				const w = fs.watch(dir, (event, filename) => {
					files.forEach((f) => {
						if (!filename || path.basename(f) === filename.toString()) {
							this.schedule(f);
						}
					});
				});
				w.on("error", (err) => console.error(`[MM-Watcher] watcher error ${dir}:`, err.message));
				this.watchers.push(w);
			} catch (err) {
				console.error(`[MM-Watcher] cannot watch ${dir}:`, err.message);
			}
		});
	},

	schedule (file) {
		clearTimeout(this.timers[file]);
		this.timers[file] = setTimeout(() => this.check(file), this.cfg.debounce);
	},

	check (file) {
		const hash = this.hashOf(file);
		if (hash === null || hash === this.hashes[file]) return; // unveraendert / gerade nicht lesbar
		this.hashes[file] = hash;

		const name = path.basename(file);
		const isCss = name.endsWith(".css");
		console.log(`[MM-Watcher] ${name} changed`);

		if (!isCss && this.cfg.restartCommand) {
			// Server-Neustart noetig (z.B. "pm2 restart MagicMirror"): Clients warten, bis er wieder da ist.
			this.sendSocketNotification("MM_WATCHER_RESTARTING", { file: name });
			setTimeout(() => {
				exec(this.cfg.restartCommand, (err) => {
					if (err) console.error("[MM-Watcher] restartCommand failed:", err.message);
				});
			}, 300);
			return;
		}

		this.sendSocketNotification("MM_WATCHER_RELOAD", { file: name, css: isCss });
	}
});
