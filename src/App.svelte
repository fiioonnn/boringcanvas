<script>
	import Screen from "./components/Screen/Screen.svelte";
	import Canvas from "#components/Canvas/Canvas.svelte";
	import Infobox from "#components/Infobox/Infobox.svelte";
	import Toolbar from "#components/Toolbar/Toolbar.svelte";
	import Toasts from "#components/Toasts.svelte";
	import Loader from "#components/Loader/Loader.svelte";
	import Modal from "#components/Modal/Modal.svelte";
	import Settings from "#components/Settings/Settings.svelte";
	import Prompt from "#components/Prompt/Prompt.svelte";
	import Controls from "#components/Controls/Controls.svelte";
	import Rules from "#components/Rules/Rules.svelte";
	import Donate from "#components/Donate/Donate.svelte";
	import Report from "#components/Report/Report.svelte";
	import AdminPanel from "#components/AdminPanel/AdminPanel.svelte";
	import Note from "#components/Note/Note.svelte";

	import { loader } from "#store/loader";
	import { screen } from "#store/screen";
	import { app, note, username, socket, config } from "#store/stores";
	import { toasts } from "#store/toasts";
	import { prompt } from "#store/prompt";
	import { onMount } from "svelte";
	import { io } from "socket.io-client";
	import Cursors from "#components/Cursors/Cursors.svelte";

	//
	// Create the socket client
	//

	const client = io($app.serverURL, {
		autoConnect: false,
		transports: ["websocket"],
		auth: (cb) => {
			cb({
				username: $username,
				version: $app.version,
			});
		},
	});

	//
	// Set the socket in the store
	//

	socket.set(client);

	//
	// Shows a loader while the app is loading
	//

	loader.show({
		text: "Loading...",
	});

	//
	// Create a variable that holds the ping interval
	//

	let pingInterval = null;

	//
	// onMount lifecycle
	//

	onMount(() => {
		//
		// If not already shown, show the note modal
		//

		if (!$note) $app.activeModal = "note";

		//
		// Load the config from the server
		//

		fetch($app.serverURL + "/config", {
			signal: AbortSignal.timeout(5000),
		})
			.then((response) => {
				if (!response.ok) {
					screen.show({
						title: "Failed to fetch config",
						text: "The client failed to load the config file from the server. Please try again later.",
					});
				} else {
					return response.json();
				}
			})
			.then((data) => {
				$config = data;

				toasts.create(
					"Config loaded",
					"The config file was successfully loaded",
					"success",
					3000
				);
			})
			.catch((error) => {
				if (error.message.includes("Failed to fetch")) {
					screen.show({
						title: "Server offline",
						text: "The server is currently offline. We are working on it.",
						keys: ["CTRL", "Shift", "R"],
					});
				} else {
					screen.show({
						title: "Failed to fetch config",
						text: "The client failed to load the config file from the server. Please try again later.",
					});
				}
			});

		//
		// If no username is set, show the prompt
		// otherwise directly connect to the server
		//

		let timeout = setTimeout(() => {
			//
			// Hide the loader after 1 second
			//

			loader.hide();

			//
			// Connect to the server or show the
			// prompt after 1 second
			//

			$username ? $socket.connect() : setUsername();
		});

		//
		// On destroy, disconnect the socket and clear the timeout
		//

		return () => {
			$socket.disconnect();
			clearInterval(pingInterval);
		};
	});

	//
	// On socket connect
	//

	$socket.on("connect", () => {
		//
		// Hide loader
		//

		loader.hide();

		//
		// Show infobox after 1 second
		//

		setTimeout(() => ($app.infobox = true), 1000);

		//
		// Ping the server every second
		//

		pingInterval = setInterval(() => {
			const start = Date.now();

			$socket.emit("ping", (data) => {
				const duration = Date.now() - start;
				const { version, online } = data;

				//
				// Update the app store with the ping and online count
				//

				$app.ping = duration;
				$app.onlineCount = online;
			});
		}, 1000);
	});

	//
	// On socket disconnect
	//

	$socket.on("disconnect", () => {
		//
		// Clear the ping interval
		//

		clearInterval(pingInterval);

		//
		// Show disconnected loader
		//

		loader.show({
			text: "Disconnected. Trying to reconnect..",
		});
	});

	//
	// On socket error
	//

	$socket.on("connect_error", (error) => {
		//
		// Clear the ping interval
		//

		clearInterval(pingInterval);

		//
		// Error: Banned
		//

		if (error.message === "banned") {
			banned();
		}

		//
		// Error: Invalid username
		//

		if (error.message === "invalid-username") {
			resetUsername("Invalid username");
		}

		//
		// Error: Username taken
		//

		if (error.message === "username-taken") {
			resetUsername("Username is already taken");
		}

		//
		// Error: Version mismatch
		//

		if (error.message === "version-mismatch") {
			screen.show({
				title: "Update available",
				text: `A new version of Boring Canvas is available. Please clear the cache and refresh the page to apply the update.`,
				keys: ["CTRL", "Shift", "R"],
			});

			$socket.disconnect();
		}

		//
		// Error: Other
		//

		if (error.message === "websocket error") {
			loader.show({
				text: `Connection failed. Retrying..`,
				error: error.message,
			});
		}
	});

	//
	// Notifications from the server
	//

	$socket.on(
		"notification",
		({ title, message = "", type = "default", duration = 3000 }) => {
			toasts.create(title, message, type, duration);
		}
	);

	//
	// Actions from the server
	//

	$socket.on("action", (action) => {
		if (action === "unlock") {
			$app.isAdmin = true;
		}

		if (action === "lock") {
			$app.isAdmin = false;
		}

		if (action === "ban") {
			banned();
			$socket.disconnect();
		}

		if (action === "kick") {
			$socket.disconnect();
			screen.show({
				title: "You were kicked from the server",
				text: "This is a warning, you can now reconnect by reloading this page.",
			});
		}
	});

	//
	// Reset username input
	//

	function resetUsername(reason) {
		loader.hide();
		toasts.create("Error", reason, "error", 3000);
		$username = "";

		setTimeout(() => {
			$socket.disconnect();
			setUsername();
		}, 1000);
	}

	//
	// Disconnects and shows the banned screen
	//

	function banned() {
		$socket.disconnect();
		screen.show({
			title: "You have been banned",
			text: `Because you broke the rules, you were permanently banned. If you think this is a mistake or you would like to make a request to be unbanned, please contact <a href="mailto:support@boringcanvas.io">support@boringcanvas.io</a>.`,
		});
	}

	//
	// App wide keydown event handler
	//

	function handleKeyDown(event) {
		if (!$screen.active && !$app.activeModal && !$prompt.active)
			event.preventDefault();

		$app.keys[event.key] = true;

		if (
			$app.keys["Control"] &&
			($app.keys["+"] || $app.keys["-"] || $app.keys["s"])
		)
			event.preventDefault();

		if (
			$app.keys["m"] &&
			!$app.activeModal &&
			$socket.connected &&
			!$prompt.active
		) {
			toggleMiniMap();
		}

		if ($app.keys["Escape"]) toggleSettings();
		if ($app.keys["Control"] && $app.keys["s"]) screenshot();

		if ($prompt.active) return;

		if ($app.keys["s"] && $app.keys["b"] && $app.keys["o"] && !$app.activeModal)
			commandPrompt();
	}

	//
	// App wide keyup event handler
	//

	function handleKeyUp(event) {
		$app.keys[event.key] = false;
	}

	//
	// Toggle the minimap
	//

	function toggleMiniMap() {
		$app.showMiniMap = !$app.showMiniMap;
	}

	//
	// Toggle the settings modal
	//

	function toggleSettings() {
		if ($prompt.active) return;

		$app.activeModal = $app.activeModal === "settings" ? "" : "settings";
	}

	//
	// Take a screenshot of the canvas
	//

	function screenshot() {
		const offCanvas = document.createElement("canvas");
		const offCtx = offCanvas.getContext("2d");

		offCanvas.width = $app.ctx.canvas.width;
		offCanvas.height = $app.ctx.canvas.height;

		offCtx.fillStyle = "#202020";
		offCtx.fillRect(0, 0, $app.ctx.canvas.width, $app.ctx.canvas.height);
		offCtx.drawImage($app.ctx.canvas, 0, 0);

		const data = offCtx.canvas.toDataURL("image/png");
		const filename = `boringcanvas.io.png`;
		const download = document.createElement("a");

		download.className = "download";
		document.body.appendChild(download);
		download.href = data;
		download.download = filename;
		download.click();

		document.body.removeChild(download);

		toasts.create("Download", `Canvas saved as ${filename}`, "success", 3000);
	}

	//
	// Opens a prompt to set the username
	//

	function setUsername() {
		if (!$username) {
			prompt.show({
				text: "Please enter your username",
				placeholder: "e.g. Drawing Dolphin",
				fn: (value) => {
					$username = value;
					$socket.connect({ username: value });
					loader.show({
						text: "Connecting..",
					});
				},
			});
		}
	}

	//
	// Prompt for admins
	//

	function commandPrompt() {
		prompt.show({
			text: "Run a command",
			placeholder: "Enter a command..",
			cancel: true,
			fn: (value) => {
				$socket.emit("command", value);
			},
		});
	}
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />

{#if $socket.connected}
	<Canvas />
	<Cursors />
{/if}

{#if $app.infobox}
	<Infobox />
{/if}

<Toolbar />
<Toasts />

{#if $prompt.active}
	<Modal button={false}>
		<Prompt />
	</Modal>
{/if}

{#if $app.activeModal === "settings"}
	<Modal title="Settings">
		<Settings />
	</Modal>
{:else if $app.activeModal === "controls"}
	<Modal title="Controls" width={900}>
		<Controls />
	</Modal>
{:else if $app.activeModal === "rules"}
	<Modal title="Rules" width={700}>
		<Rules />
	</Modal>
{:else if $app.activeModal === "donate"}
	<Modal title="Donate" width={600}>
		<Donate />
	</Modal>
{:else if $app.activeModal === "report"}
	<Modal title="Report" width={600}>
		<Report />
	</Modal>
{:else if $app.activeModal === "admin-panel" && $app.isAdmin}
	<Modal width={800}>
		<AdminPanel />
	</Modal>
{:else if $app.activeModal === "note"}
	<Modal width={600} buttonTo="" buttonFn={() => ($note = true)}>
		<Note />
	</Modal>
{/if}

{#if $loader.active}
	<Loader />
{/if}

{#if $screen.active}
	<Screen />
{/if}

<style lang="scss">
	.download {
		visibility: hidden;
		pointer-events: none;
		width: 0;
		height: 0;
		overflow: hidden;
	}
</style>
