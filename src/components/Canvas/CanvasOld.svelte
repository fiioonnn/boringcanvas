<script>
	import { onMount } from "svelte";
	import { config, tools } from "#store/stores";
	import Debugger from "#components/Debug/Debugger.svelte";

	const [X, Y, W, H] = [0, 1, 0, 1];

	let minimap;
	let minimapCtx;
	let minimapViewport;

	let canvas;
	let ctx;

	let keys = {};

	let mouse = {
		drawing: false,
		panning: false,
		pos: {
			canvas: [0, 0],
			canvasLast: [0, 0],
			window: [0, 0],
			windowLast: [0, 0],
		},
	};

	let viewport = [0, 0, 0, 0];

	let transform = [0, 0];

	onMount(() => {
		ctx = canvas.getContext("2d");
		minimapCtx = minimap.getContext("2d");

		// fit canvas to window
		init();

		// set background color
	});

	function init() {
		const [width, height] = $config.canvas.size;

		canvas.width = width;
		canvas.height = height;

		minimap.width = 500;
		minimap.height = 500;

		// set the width and height of the minimapViewport (its a simlation of the users screen on the canvas)
		minimapViewport.style.width = `${(window.innerWidth / width) * 400}px`;
		minimapViewport.style.height = `${(window.innerHeight / height) * 400}px`;

		ctx.fillStyle = $config.canvas.color;
		ctx.fillRect(0, 0, width, height);

		// draw grid
		drawGrid();
		// draw minimap
		minimapCtx.drawImage(canvas, 0, 0, width, height, 0, 0, 500, 500);
	}

	function drawGrid() {
		const [width, height] = $config.canvas.size;
		const [cellWidth, cellHeight] = [50, 50];

		ctx.strokeStyle = "#191919";
		ctx.lineWidth = 1;

		for (let x = 0; x < width; x += cellWidth) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			ctx.stroke();
		}

		for (let y = 0; y < height; y += cellHeight) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(width, y);
			ctx.stroke();
		}
	}

	function handleMouseDown(e) {
		e.button === 0 && (mouse.drawing = true);
		e.button === 1 && (mouse.panning = true);

		mouse.pos.canvasLast = [e.clientX - transform[X], e.clientY - transform[Y]];
		mouse.pos.windowLast = [e.clientX, e.clientY];
	}
	function handleMouseUp(e) {
		e.button === 0 && (mouse.drawing = false);
		e.button === 1 && (mouse.panning = false);

		mouse.pos.canvasLast = [0, 0];
	}

	function handleMouseMove(e) {
		// draw the whole canvas on the minimap
		minimapCtx.drawImage(
			canvas,
			0,
			0,
			canvas.width,
			canvas.height,
			0,
			0,
			500,
			500
		);

		// update the minimap viewport to the current viewport (not the mouse)
		minimapViewport.style.transform = `translate(${(-transform[X] / 5000) * 400}px, ${
			(-transform[Y] / 5000) * 400
		}px)`;

		// UPDATE MOUSE POS
		mouse.pos.canvas = [e.clientX - transform[X], e.clientY - transform[Y]];

		// DRAWING
		if (mouse.drawing) {
			const [x, y] = mouse.pos.canvas;
			const [xLast, yLast] = mouse.pos.canvasLast;

			ctx.strokeStyle = $tools.color;
			ctx.lineWidth = $tools.size;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.beginPath();
			ctx.moveTo(xLast, yLast);
			ctx.lineTo(x, y);
			ctx.stroke();

			mouse.pos.canvasLast = [x, y];
		}
		// PANNING
		if (mouse.panning) {
			const dx = e.clientX - mouse.pos.windowLast[X];
			const dy = e.clientY - mouse.pos.windowLast[Y];

			transform[X] += dx;
			transform[Y] += dy;

			viewport = [
				-transform[X],
				-transform[Y],
				-transform[X] + window.innerWidth,
				-transform[Y] + window.innerHeight,
			];

			mouse.pos.windowLast = [e.clientX, e.clientY];
			// adjust the minimap panning

			// // test cool feature to stop going outside
			const canvasBounds = canvas.getBoundingClientRect();

			if (transform[X] > 0) transform[X] = 0;
			if (transform[Y] > 0) transform[Y] = 0;
			if (transform[X] < -canvasBounds.width + window.innerWidth)
				transform[X] = -canvasBounds.width + window.innerWidth;
			if (transform[Y] < -canvasBounds.height + window.innerHeight)
				transform[Y] = -canvasBounds.height + window.innerHeight;
		}
		canvas.style.transform = `translate(${transform[X]}px, ${transform[Y]}px)`;
	}

	function handleWheel(e) {
		const [x, y] = mouse.pos.canvas;
		const [xLast, yLast] = mouse.pos.canvasLast;

		const delta = e.deltaY > 0 ? 1 : -1;
		const scale = 1 + delta * 0.1;

		// use css scale
		canvas.style.transform = `scale(${scale}) translate(${transform[X]}px, ${transform[Y]}px)`;

		mouse.pos.canvasLast = [x * scale, y * scale];
	}
</script>

<svelte:window
	on:mousedown={handleMouseDown}
	on:mouseup={handleMouseUp}
	on:mousemove={handleMouseMove}
	on:keydown|preventDefault={(e) => (keys[e.key] = true)}
	on:keyup={(e) => (keys[e.key] = false)}
	on:wheel={handleWheel}
/>

<canvas bind:this={canvas} class="canvas" class:panning={mouse.panning}
></canvas>

<div class="minimap">
	<canvas bind:this={minimap} class="minimap__canvas"></canvas>
	<div class="minimap__viewport" bind:this={minimapViewport}></div>
</div>

<Debugger
	items={{
		"POS (Canvas)": mouse.pos.canvas,
		"POS (Canvas Last)": mouse.pos.canvasLast,
		"POS (Window)": mouse.pos.window,
		"POS (Window Last)": mouse.pos.windowLast,
		Viewport: viewport,
		transform: transform,
		seperator1: "seperator",
		Drawing: mouse.drawing,
		Panning: mouse.panning,
		seperator2: "seperator",
		Keys: Object.keys(keys).filter((key) => keys[key]),
	}}
/>

<style lang="scss">
	.canvas {
		position: fixed;
		left: 0;
		top: 0;
		&.panning {
			cursor: grabbing;
		}
	}

	.minimap {
		position: fixed;
		top: 20px;
		left: 20px;
		border: 1px solid #fff;
		&__canvas {
			width: 400px;
			height: 400px;
			background: #000;
		}
		&__viewport {
			position: absolute;
			top: 0;
			left: 0;
			border: 0.1px solid #f00;
		}
	}
</style>
