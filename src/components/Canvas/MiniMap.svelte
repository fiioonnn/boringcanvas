<script>
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

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

		view.style.transform = `translate(${(-transform[X] / width) * size}px, ${
			(-transform[Y] / height) * size
		}px)`;

		requestAnimationFrame(render);
	}
</script>

<svelte:window on:resize={resize} />

<div class="minimap">
	<canvas bind:this={canvas} transition:fade={{ duration: 100 }}></canvas>
	<div bind:this={view} class="minimap__view"></div>
</div>

<style lang="scss">
	.minimap {
		pointer-events: none;
		opacity: 0.75;
		position: fixed;
		right: 20px;
		top: 20px;
		canvas {
			border-radius: var(--radius-inner);
			box-shadow: var(--shadow);
			border: var(--contour);
		}
		&__view {
			position: absolute;
			border: 1px solid var(--red);
			border-radius: var(--radius-inner);
			top: 0;
			left: 0;
		}
	}
</style>
