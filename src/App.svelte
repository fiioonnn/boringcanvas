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
	import { app, note, username, socket } from "#store/stores";
	import { toasts } from "#store/toasts";
	import { prompt } from "#store/prompt";
	import { onMount } from "svelte";
	import { io } from "socket.io-client";

	let server = "http://localhost:3000";

	const client = io(server, {
		autoConnect: false,
		transports: ["websocket"],
		auth: (cb) => {
			cb({
				username: $username,
				version: $app.version,
			});
		},
	});
	socket.set(client);

	fetch(server)
		.then((res) => res.json())
		.then((data) => {
			$app.onlineCount = data.online;
		})
		.catch((error) => {
			console.log(error);
		});

	/*
	TODO:

	ADminPanel
	- Userlist with ban button
	- server integration
	- blacklist (for usernames)
	- userlist
	- when draw high ping. maybe draw() interval (limit it)
	*/

	loader.show({
		text: "Loading...",
	});
	let pingInterval = null;

	onMount(() => {
		if (!$note) {
			$app.activeModal = "note";
		}

		// Username prompt if not set, otherwise connect to the server
		let timeout = setTimeout(() => {
			loader.hide();

			if ($username) {
				$socket.connect();
			} else {
				setUsername();
			}
		}, 1000);

		return () => {
			$socket.disconnect();
			clearInterval(pingInterval);
		};
	});

	// screen.show({
	// 	title: "You have been banned",
	// 	text: `Because you broke the rules, you were permanently banned.
	// 	If you think this is a mistake or you would like to make a request to be unbanned,
	// 	please contact <a href="mailto:support@boringcanvas.io">support@boringcanvas.io</a>.`,
	// });

	// screen.show({
	// 	title: "Update available",
	// 	text: `A new version of Boring Canvas is available. Please clear the cache and refresh the page to apply the update.`,
	// 	keys: ["CTRL", "Shift", "R"],
	// });

	// loader.hide();

	$socket.on("error:banned", (message) => {
		screen.show({
			title: "You have been banned",
			text: message,
		});
	});

	$socket.on("connect", () => {
		loader.hide();

		setTimeout(() => {
			$app.infobox = true;
		}, 1000);

		pingInterval = setInterval(() => {
			const start = Date.now();

			$socket.emit("ping", (data) => {
				const duration = Date.now() - start;
				const { version, online } = data;

				$app.ping = duration;
				$app.onlineCount = online;
			});
		}, 1000);
	});

	$socket.on("disconnect", () => {
		clearInterval(pingInterval);
		loader.show({
			text: "Disconnected. Trying to reconnect..",
		});
	});

	$socket.on(
		"notification",
		({ title, message = "", type = "default", duration = 3000 }) => {
			toasts.create(title, message, type, duration);
		}
	);

	$socket.on("action", (action) => {
		if (action === "unlock") {
			$app.isAdmin = true;
		}

		if (action === "lock") {
			$app.isAdmin = false;
		}

		if (action === "ban") {
			banned();
		}
	});

	function banned() {
		$socket.disconnect();
		screen.show({
			title: "You have been banned",
			text: `Because you broke the rules, you were permanently banned. If you think this is a mistake or you would like to make a request to be unbanned, please contact <a href="mailto:support@boringcanvas.io">support@boringcanvas.io</a>.`,
		});
	}

	$socket.on("connect_error", (error) => {
		clearInterval(pingInterval);

		console.log(error);
		if (error.screen) {
			screen.show(error.screen);
			$socket.disconnect();
		}

		if (error.message === "banned") {
			banned();
		}

		if (error.message === "invalid-username") {
			loader.hide();
			toasts.create("Error", "Invalid username", "error", 3000);
			$username = "";
			setTimeout(() => {
				$socket.disconnect();
				setUsername();
			}, 1000);
		}

		if (error.message === "websocket error") {
			loader.show({
				text: `Connection failed. Retrying..`,
				error: error.message,
			});
		}
	});

	/**
	 * App-wide keydown event handler
	 * @param event
	 */
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

	/**
	 * App-wide keyup event handler
	 * @param event
	 */
	function handleKeyUp(event) {
		$app.keys[event.key] = false;
	}

	/**
	 * Toggles the mini map
	 */
	function toggleMiniMap() {
		$app.showMiniMap = !$app.showMiniMap;
	}

	/**
	 * Toggles the settings modal
	 */
	function toggleSettings() {
		if ($prompt.active) return;

		$app.activeModal = $app.activeModal === "settings" ? "" : "settings";
	}

	/**
	 * Takes a screenshot of the canvas and downloads it
	 */
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
	} /**
	 * Sets the username if it is not already set
	 */
	function setUsername() {
		if (!$username) {
			prompt.show({
				text: "Please enter your username",
				placeholder: "e.g. Drawing Dolphin",
				fn: (value) => {
					$username = value;
					$socket.connect({ username: value });
				},
			});
		}
	}

	/**
	 * Login prompt for the admins
	 */
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
	<Modal title="Admin Panel" width={800}>
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
