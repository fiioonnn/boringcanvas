<script>
	import { settings, app } from "#store/stores";
	import { toasts } from "#store/toasts";
	import { onMount } from "svelte";

	export let canvas;

	let start = [0, 0];
	let end = [0, 0];
	let eraseSelector;

	onMount(() => {
		return () => {
			start = [0, 0];
			end = [0, 0];
		};
	});

	function pointerDown(e) {
		if (e.target !== canvas) return;
		if (e.button !== 0) return interrupt();

		start = [e.clientX, e.clientY];
	}

	function pointerUp(e) {
		if (e.target !== canvas) return;
		if (e.button !== 0) return interrupt();

		end = [e.clientX, e.clientY];

		$settings.showEraseSelector = false;
	}

	function pointerMove(e) {
		const x = Math.min(start[0], e.clientX);
		const y = Math.min(start[1], e.clientY);
		const width = Math.abs(start[0] - e.clientX);
		const height = Math.abs(start[1] - e.clientY);

		eraseSelector.style.left = `${x}px`;
		eraseSelector.style.top = `${y}px`;
		eraseSelector.style.width = `${width}px`;
		eraseSelector.style.height = `${height}px`;
	}

	function interrupt() {
		$settings.showEraseSelector = false;
		toasts.create(
			"Erase selector interrupted",
			"Erase selector has been interrupted",
			"error"
		);
	}
</script>

<svelte:window
	on:pointerdown={pointerDown}
	on:pointerup={pointerUp}
	on:pointermove={pointerMove}
/>

<div class="erase-selector" bind:this={eraseSelector}></div>

<style lang="scss">
	.erase-selector {
		position: fixed;
		top: 0;
		left: 0;
		width: 0;
		height: 0;
		border: 1px solid #fff;
		pointer-events: none;
		background: rgba(#fff, 0.3);
		box-shadow: 0 0 0 1px #000;
	}
</style>
