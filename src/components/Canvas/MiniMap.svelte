<script>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { toasts } from "#store/toasts";

	export let source;
	export let size = 300;
	export let transform;

	const [X, Y] = [0, 1];

	let canvas;
	let ctx;
	let view;

	onMount(() => {
		ctx = canvas.getContext("2d");

		canvas.width = size;
		canvas.height = size;

		ctx.fillStyle = "#000000";

		resize();
		render();
	});

	function resize() {
		const { width, height } = source.canvas;

		view.style.width = `${(window.innerWidth / width) * size}px`;
		view.style.height = `${(window.innerHeight / height) * size}px`;
	}

	function render() {
		ctx.drawImage(source.canvas, 0, 0, size, size);

		const { width, height } = source.canvas;

		if (view) {
			view.style.transform = `translate(${(-transform[X] / width) * size}px, ${
				(-transform[Y] / height) * size
			}px)`;
		}

		requestAnimationFrame(render);
	}

	function handlePosClick(event) {
		navigator.clipboard.writeText(`${-transform[X]}:${-transform[Y]}`);
		toasts.create(
			"Copied to clipboard",
			"Coordinates copied to clipboard",
			"success",
			3000
		);
	}
</script>

<svelte:window on:resize={resize} />

<div class="minimap">
	<canvas bind:this={canvas} transition:fade={{ duration: 100 }}></canvas>
	<div bind:this={view} class="minimap__view"></div>
	<p class="minimap__pos" on:click={handlePosClick}>
		{-transform[X]} : {-transform[Y]}
	</p>
</div>

<style lang="scss">
	.minimap {
		pointer-events: none;
		position: fixed;
		right: 20px;
		bottom: 20px;
		overflow: hidden;
		box-shadow: var(--shadow);
		border: var(--contour);
		border-radius: var(--radius-small);
		user-select: none;
		&__view {
			position: absolute;
			border-radius: var(--radius-small);
			border: 1px solid var(--red);
			top: 0;
			left: 0;
		}
		&__pos {
			padding: 10px;
			background: var(--foreground);
			text-align: center;
			color: var(--text-alt);
			cursor: pointer;
			pointer-events: all;
			user-select: all;
		}
	}
</style>
