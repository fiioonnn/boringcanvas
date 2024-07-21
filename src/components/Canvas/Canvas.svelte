<script>
	import { onMount } from "svelte";
	import { config, tools } from "#store/stores";

	import Debugger from "#components/Debug/Debugger.svelte";
	import MiniMap from "./MiniMap.svelte";
	const [X, Y] = [0, 1];

	// Canvas
	let canvas;
	let ctx;
	// Keyboard
	let keys = {};
	// Mouse
	let mouse = {
		drawing: false,
		panning: false,
		pos: {
			canvas: [0, 0],
			last: [0, 0],
			lastWindow: [0, 0],
		},
	};
	// Transform of canvas
	let transform = [0, 0];
	// Current drawing path
	let path = [];
	// Show minimap
	let showMiniMap = false;

	onMount(() => {
		ctx = canvas.getContext("2d");

		// Initialize canvas
		initializeCanvas();
	});

	/**
	 * Initialize canvas, used to set the size and
	 * background color of the canvas.
	 */
	function initializeCanvas() {
		// Set canvas size
		canvas.width = $config.canvas.size[X];
		canvas.height = $config.canvas.size[Y];

		// Set canvas background
		ctx.fillStyle = $config.canvas.background;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Draw grid
		drawGrid();
	}

	/**
	 * Draws a grid on the canvas.
	 */
	function drawGrid() {
		const { enabled, divisor, color } = $config.canvas.grid;
		const [width, height] = $config.canvas.size;
		const [gridWidth, gridHeight] = [width / divisor, height / divisor];

		if (!enabled) return;

		ctx.strokeStyle = color;
		ctx.lineWidth = 1;

		for (let x = 0; x < width; x += gridWidth) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			ctx.stroke();
		}

		for (let y = 0; y < height; y += gridHeight) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
			ctx.stroke();
		}
	}

	/**
	 * Handle mouse down event, used to start drawing/panning
	 * on the canvas.
	 * @param {MouseEvent} event
	 */
	function handleMouseDown(event) {
		event.button === 0 && !mouse.panning && (mouse.drawing = true);
		event.button === 1 && !mouse.drawing && (mouse.panning = true);

		mouse.pos.last = [event.offsetX, event.offsetY]; // need to be calulated with transform !! <--- !!! <------------------
		mouse.pos.lastWindow = [event.clientX, event.clientY];
	}

	/**
	 * Handle mouse up event, used to stop drawing/panning
	 * on the canvas.
	 * @param {MouseEvent} event
	 */
	function handleMouseUp(event) {
		event.button === 0 && (mouse.drawing = false);
		event.button === 1 && (mouse.panning = false);

		mouse.pos.last = [0, 0];

		// reset the path
		path = [];
	}

	/**
	 * Handle mouse move event, used to draw/pan on the canvas.
	 * @param {MouseEvent} event
	 */
	function handleMouseMove(event) {
		mouse.pos.canvas = [
			event.clientX - transform[X],
			event.clientY - transform[Y],
		];

		if (mouse.drawing) {
			path.push(mouse.pos.canvas);
			draw();
			mouse.pos.last = mouse.pos.canvas;
		}
		if (mouse.panning) {
			pan(event);
		}
	}

	/**
	 * Handle key down event, used to track keys that are
	 * currently being pressed.
	 * @param {KeyboardEvent} event
	 */
	function handleKeyDown(event) {
		keys[event.key] = true;

		if (keys["m"]) showMiniMap = !showMiniMap;
	}

	/**
	 * Handle key up event, used to track keys that are
	 * no longer being pressed.
	 * @param {KeyboardEvent} event
	 */
	function handleKeyUp(event) {
		keys[event.key] = false;
	}

	/**
	 * Handle mouse wheel event, used to zoom in/out on the canvas.
	 * @param {WheelEvent} event
	 */
	function handleMouseWheel(event) {
		event.preventDefault();

		if (mouse.drawing || mouse.panning) return;

		keys["Shift"] && (transform[X] += -Math.floor(event.deltaY));
		!keys["Shift"] && (transform[Y] += -Math.floor(event.deltaY));

		checkBorders();
		translate();
	}

	/**
	 * Handle mouse leave event, used to reset the mouse position
	 * when the mouse leaves the canvas.
	 */
	function handleMouseLeave() {
		mouse.drawing = false;
	}

	/**
	 * This applies the current transform to
	 * the canvas via (ughh) CSS.
	 */
	function translate() {
		canvas.style.transform = `translate(${transform[X]}px, ${transform[Y]}px)`;
	}

	/**
	 * Draw the current path on the canvas.
	 */
	function draw() {
		// simple draw logic connect all points with a line

		ctx.strokeStyle = $tools.color;
		ctx.lineWidth = $tools.size;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		console.log(1);
		ctx.beginPath();
		ctx.moveTo(mouse.pos.last[X], mouse.pos.last[Y]);
		ctx.lineTo(mouse.pos.canvas[X], mouse.pos.canvas[Y]);
		ctx.stroke();
	}

	/**
	 * Pan the canvas.
	 * @param {MouseEvent} event
	 */
	function pan(event) {
		const [dx, dy] = [
			event.clientX - mouse.pos.lastWindow[X],
			event.clientY - mouse.pos.lastWindow[Y],
		];

		transform[X] += dx;
		transform[Y] += dy;

		mouse.pos.lastWindow = [event.clientX, event.clientY];

		checkBorders();
		translate();
	}

	function checkBorders() {
		const canvasBounds = canvas.getBoundingClientRect();

		if (transform[X] > 0) transform[X] = 0;
		if (transform[Y] > 0) transform[Y] = 0;
		if (transform[X] < -canvasBounds.width + window.innerWidth)
			transform[X] = -canvasBounds.width + window.innerWidth;
		if (transform[Y] < -canvasBounds.height + window.innerHeight)
			transform[Y] = -canvasBounds.height + window.innerHeight;
	}

	// Watch the path for changes
	$: {
		path.forEach((p, i) => {
			console.log(i, p);
			// draw();
		});
	}
</script>

<svelte:window
	on:mouseup={handleMouseUp}
	on:mousemove={handleMouseMove}
	on:keydown={handleKeyDown}
	on:keyup={handleKeyUp}
/>
<svelte:body />

<canvas
	class="canvas"
	bind:this={canvas}
	on:mouseleave={handleMouseLeave}
	on:mousedown={handleMouseDown}
	on:wheel|nonpassive={handleMouseWheel}
></canvas>

{#if showMiniMap}
	<MiniMap bind:source={ctx} size={500} bind:transform />
{/if}

<!-- <Debugger
	items={{
		"Mouse Pos": mouse.pos.canvas.join(":"),
		"Mouse Last": mouse.pos.last,
		"Mouse Last Window": mouse.pos.lastWindow,
		Drawing: mouse.drawing,
		Panning: mouse.panning,
		Keys: Object.keys(keys)
			.filter((key) => keys[key])
			.join(", "),
		Canvas: canvas,
		Context: ctx,
		Config: $config,
		Tools: $tools,
		Path: path.length,
		"Canvas Size": [$config.canvas.size[X], $config.canvas.size[Y]].join(" x "),
	}}
/> -->

<style>
	.canvas {
		position: fixed;
		top: 0;
		left: 0;
	}
</style>
