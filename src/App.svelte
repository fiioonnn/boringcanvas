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

	import { loader } from "#store/loader";
	import { screen } from "#store/screen";
	import { app, username } from "#store/stores";
	import { toasts } from "#store/toasts";
	import { prompt } from "#store/prompt";
	import Controls from "#components/Controls/Controls.svelte";
	import Rules from "#components/Rules/Rules.svelte";
	import Donate from "#components/Donate/Donate.svelte";
	import Report from "#components/Report/Report.svelte";
	import AdminPanel from "#components/AdminPanel/AdminPanel.svelte";
	import { onMount } from "svelte";

	$app.isAdmin = true;
	/*
	TODO:
	1. move sowMiniMap to store
	2. move s-window eventhandlers to app.svelte if possible
	3. Propmpt
	4. Changelog (maybe)
	5. ESC to toggle settings

	*/

	onMount(() => {
		setUsername();
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

	loader.show({
		text: "Loading...",
	});

	loader.hide();

	/**
	 * App-wide keydown event handler
	 * @param event
	 */
	function handleKeyDown(event) {
		if (!$screen.active && !$app.activeModal && !$prompt.active)
			event.preventDefault();

		$app.keys[event.key] = true;

		if ($app.keys["Control"] && ($app.keys["+"] || $app.keys["-"]))
			event.preventDefault();

		if ($app.keys["m"] && !$app.activeModal) toggleMiniMap();
		if ($app.keys["Escape"]) toggleSettings();
		if ($app.keys["Control"] && $app.keys["s"]) screenshot();
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
		const data = $app.ctx.canvas.toDataURL("image/png");
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
	/**
	 * Sets the username if it is not already set
	 */
	function setUsername() {
		if (!$username) {
			prompt.show({
				text: "Please enter your username",
				fn: (value) => {
					if (value.length < 3 || value.length > 20)
						return "Username to short or to long";
				},
			});
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />

<Canvas />
<Toolbar />
<Infobox />
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
{:else if $app.activeModal === "admin-panel"}
	<Modal title="Admin Panel" width={1000}>
		<AdminPanel />
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
