/* MagicMirror² Module: MM-Watcher
 * Reloads the display when config.js or custom.css change.
 * MIT Licensed.
 */
Module.register("MM-Watcher", {
	defaults: {
		files: [], // leer = config.js + css/custom.css; sonst Pfade relativ zum MM-Root
		debounce: 500, // ms
		cssHotReload: true, // custom.css ohne kompletten Seiten-Reload neu laden
		restartCommand: "" // optional, z.B. "pm2 restart MagicMirror" fuer config.js-Aenderungen
	},

	start () {
		Log.info("Starting module: " + this.name);
		this.sendSocketNotification("MM_WATCHER_INIT", {
			files: this.config.files,
			debounce: this.config.debounce,
			restartCommand: this.config.restartCommand
		});
	},

	getDom () {
		const el = document.createElement("div");
		el.style.display = "none";
		return el;
	},

	socketNotificationReceived (notification, payload) {
		if (notification === "MM_WATCHER_RELOAD") {
			if (payload.css && this.config.cssHotReload && this.reloadStylesheet(payload.file)) return;
			window.location.reload();
		}
		if (notification === "MM_WATCHER_RESTARTING") {
			this.waitForServer();
		}
	},

	// Haengt ein Cache-Buster-Query an das passende <link> und laedt so nur das CSS neu.
	reloadStylesheet (file) {
		const links = Array.from(document.querySelectorAll("link[rel='stylesheet']"))
			.filter((l) => l.href && l.href.split("?")[0].endsWith("/" + file));
		if (!links.length) return false;
		links.forEach((l) => {
			l.href = l.href.split("?")[0] + "?mmw=" + Date.now();
		});
		return true;
	},

	// Wartet bis der Server kurz weg war und wieder antwortet, dann Reload.
	waitForServer () {
		let wentDown = false;
		const started = Date.now();
		const poll = () => {
			fetch(window.location.href, { cache: "no-store" })
				.then(() => {
					if (wentDown || Date.now() - started > 60000) window.location.reload();
					else setTimeout(poll, 1000);
				})
				.catch(() => {
					wentDown = true;
					setTimeout(poll, 1000);
				});
		};
		setTimeout(poll, 1000);
	}
});
