<script>
	import { onMount } from "svelte";
	import { Application, Graphics, Container } from "pixi.js";
	import { tools, app, config, socket } from "#store/stores";
	import Debugger from "#components/Debug/Debugger.svelte";

	// Helper constants

	const [X, Y] = [0, 1];

	// The canvas element

	let canvas;

	// Pixi application

	let pixi;

	// Pixi container

	let container;

	// Transform of the canvas

	let transform = [0, 0];

	// Scale of the canvas

	let scale = 1;

	// The current drawing path

	let path = null;

	// Mouse data

	let mouse = {
		drawing: false,
		panning: false,
		pos: [0, 0],
		posLast: [0, 0],
		posLastWindow: [0, 0],
	};

	// Player paths, used for drawing simultaneously

	let paths = {};

	// Mount component

	onMount(() => {
		// Create pixi app

		pixi = new Application();

		// Initialize pixi app

		pixi.init({
			canvas,
			resizeTo: window,
			backgroundAlpha: 0,
			antialias: true,
		});

		// Create container

		container = new Container();

		// Draw a background 1000x1000
		const bg = new Graphics();
		bg.rect(0, 0, 1000, 1000);
		bg.fill(toPixiHex($config.canvas.background));

		container.addChild(bg);

		// Add container to stage

		pixi.stage.addChild(container);

		// Socket on path start

		$socket.on("path:start", (data) => {
			const { id, x, y, c: color, s: size } = data;

			paths[id] = new Graphics();
			paths[id].setStrokeStyle({
				width: size,
				color: toPixiHex(color),
				alpha: 1,
				join: "round",
				cap: "round",
			});
			paths[id].moveTo(x, y);

			container.addChild(paths[id]);
		});

		// Socket on path draw

		$socket.on("path:draw", (data) => {
			const { id, x, y } = data;

			if (!paths[id]) return;

			paths[id].lineTo(x, y);
			paths[id].stroke();
		});

		// Socket on path end

		$socket.on("path:end", () => {
			delete paths[$socket.id];
		});

		// Unmount component

		return () => {
			// Destroy pixi app

			pixi.destroy();
		};
	});

	// Pointer down

	function pointerDown(e) {
		e.button === 0 && !mouse.panning && (mouse.drawing = true);
		e.button === 1 && !mouse.drawing && (mouse.panning = true);

		mouse.posLast = [mouse.pos[X], mouse.pos[Y]];
		mouse.posLastWindow = [e.clientX, e.clientY];

		if (mouse.drawing) {
			path = new Graphics();
			path.setStrokeStyle({
				width: $tools.size,
				color: toPixiHex($tools.color),
				alpha: 1,
				join: "round",
				cap: "round",
			});
			path.moveTo(mouse.posLast[X], mouse.posLast[Y]);

			//  Add path to container

			container.addChild(path);

			// Send current "settings" to server

			$socket.emit("path:start", {
				x: mouse.posLast[X],
				y: mouse.posLast[Y],
				c: $tools.color,
				s: $tools.size,
			});
		}
	}

	// Pointer up

	function pointerUp(e) {
		e.button === 0 && (mouse.drawing = false);
		e.button === 1 && (mouse.panning = false);

		if (mouse.panning) return;

		mouse.posLast = [0, 0];

		if (e.button === 0) {
			$socket.emit("path:end");
		}
	}

	// Pointer move

	function pointerMove(e) {
		mouse.pos = [
			(e.clientX - transform[X]) / scale,
			(e.clientY - transform[Y]) / scale,
		];

		// Drawing logic

		if (mouse.drawing) {
			path.lineTo(mouse.pos[X], mouse.pos[Y]);
			path.stroke();

			$socket.emit("path:draw", {
				x: mouse.pos[X],
				y: mouse.pos[Y],
			});
		}

		// Panning logic

		if (mouse.panning) {
			const DX = e.clientX - mouse.posLastWindow[X];
			const DY = e.clientY - mouse.posLastWindow[Y];

			transform[X] += DX;
			transform[Y] += DY;

			mouse.posLastWindow = [e.clientX, e.clientY];

			translate();
		}
	}

	// Pointer leave

	function pointerLeave() {
		mouse.drawing = false;
		$app.keys = [];
	}

	// Wheel

	function wheel(e) {
		if (mouse.panning) return;

		if ($app.keys["Control"]) {
			zoom(e.deltaY, 0.1, e);
		} else if ($app.keys["Shift"]) {
			transform[X] -= e.deltaY;
		} else {
			transform[Y] -= e.deltaY;
		}

		translate();
	}

	// Zoom

	function zoom(direction, step, e) {
		direction = Math.sign(direction);

		if (scale > 1) step = 0.5;
		else if (scale < 1) step = 0.05;
		step = Math.sign(direction) > 0 ? step : -step;

		const newScale = Math.min(Math.max(scale - step, 0.1), 10);

		const newX = e.clientX - (e.clientX - transform[X]) * (newScale / scale);
		const newY = e.clientY - (e.clientY - transform[Y]) * (newScale / scale);

		transform[X] = newX;
		transform[Y] = newY;

		scale = newScale;

		translate();
	}

	// Apply the transform

	function translate() {
		container.position.set(transform[X], transform[Y]);
		container.scale.set(scale);
	}

	// Converts a normal hex to a PIXI hex

	function toPixiHex(hex) {
		return parseInt(hex.replace("#", "0x"));
	}
</script>

<svelte:window on:pointerup={pointerUp} />

<svelte:body on:mousemove={pointerMove} />

<canvas
	bind:this={canvas}
	on:pointerdown={pointerDown}
	on:pointermove={pointerMove}
	on:pointercancel={pointerUp}
	on:pointerleave={pointerLeave}
	on:wheel|preventDefault={wheel}
></canvas>

{#if $app.debug}
	<Debugger
		items={{
			Mouse: mouse.pos.join(" : "),
			MouseLast: mouse.posLast.join(" : "),
			MouseAction: mouse.drawing
				? "Drawing"
				: mouse.panning
					? "Panning"
					: "Idle",
			Paths: Object.keys(paths).length,
			Transform: transform.join(" : "),
			Scale: scale,
			Connected: $socket.connected,
		}}
	/>
{/if}

<style></style>
