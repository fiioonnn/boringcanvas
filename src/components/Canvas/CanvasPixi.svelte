<script>
	import Debugger from "#components/Debug/Debugger.svelte";
	import Cursors from "#components/Cursors/Cursors.svelte";

	import { onMount } from "svelte";
	import {
		Application,
		Graphics,
		Container,
		Texture,
		Sprite,
		Assets,
		Text,
		TextStyle,
	} from "pixi.js";
	import { tools, app, config, socket, settings } from "#store/stores";
	import { prompt } from "#store/prompt";
	import { toasts } from "#store/toasts";
	import { loader } from "#store/loader";

	// Helper constants

	const [X, Y] = [0, 1];

	// The canvas element

	let canvas;

	// Pixi application

	let pixi;

	// Pixi containers

	let container;
	let bgContainer;

	// Transform of the canvas

	let transform = [0, 0];

	// Scale of the canvas

	let scale = 1;

	// The current drawing path

	let path = null;

	// Path count for performance

	let pathCount = 0;

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

		// Create containers

		container = new Container();
		bgContainer = new Container();

		// Create the background

		createBackground();

		// Add containers to stage

		pixi.stage.addChild(bgContainer);
		pixi.stage.addChild(container);

		// Update the location

		updateLocation();

		// Socket events

		socketEvents();

		//  start at the center

		goToCenter();

		// Load the canvas

		loadCanvas();

		// Unmount component

		return () => {
			// Remove all listeners

			$socket.off("path:start");
			$socket.off("path:draw");
			$socket.off("path:end");
			$socket.off("draw:image");
			$socket.off("canvas:clear");
			$socket.off("canvas:cleararea");
			$socket.off("canvas:teleport");

			// Destroy pixi app

			pixi.destroy();
		};
	});

	// Load the canvas

	function loadCanvas() {
		loader.show({ text: "Loading canvas..." });
		fetch($app.serverURL + "/canvas")
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				// Super unperformant, but working for now
				// fix this later !!!
				const g = new Graphics();
				data.forEach((point) => {
					if (point?.image) {
						drawImage(point.image, point.pos);
						return;
					}

					if (point?.c) {
						// start
						g.setStrokeStyle({
							width: point.s,
							color: point.c,
							alpha: 1,
							join: "round",
							cap: "round",
						});

						g.moveTo(point.x, point.y);

						drawDot(point.x, point.y, point.c, point.s, point.e);
					}

					if (!point.c && point.x) {
						// draw
						g.lineTo(point.x, point.y);
						g.stroke();
					}

					if (!point.x) {
						// end
						container.addChild(g);
					}
				});

				loader.hide();
			});
	}

	// Creates the background

	async function createBackground() {
		const texture = await Assets.load("img/logo.png");

		const sprite = new Sprite(texture);
		sprite.width = 250;
		sprite.height = 250;
		sprite.anchor.set(0.5);
		sprite.alpha = 1;
		sprite.position.set($config.canvas.size[0] / 2, $config.canvas.size[1] / 2);

		const background = new Graphics();

		background.rect(0, 0, $config.canvas.size[0], $config.canvas.size[1]);
		background.fill({
			color: toPixiHex($config.canvas.background),
		});

		//  create a grid

		const grid = new Graphics();

		grid.setStrokeStyle({
			width: 1,
			color: toPixiHex("#303030"),
			alpha: 0.1,
		});

		for (let x = 0; x < $config.canvas.size[0]; x += 50) {
			grid.moveTo(x, 0);
			grid.lineTo(x, $config.canvas.size[1]);
		}

		for (let y = 0; y < $config.canvas.size[1]; y += 50) {
			grid.moveTo(0, y);
			grid.lineTo($config.canvas.size[0], y);
		}

		grid.stroke();

		bgContainer.addChild(background);
		bgContainer.addChild(grid);
		bgContainer.addChild(sprite);
	}

	// Socket events

	function socketEvents() {
		// Socket on path start

		$socket.on("path:start", (data) => {
			const { id, x, y, c: color, s: size, e: erase } = data;

			// Single dot

			drawDot(x, y, color, size, erase);

			paths[id] = new Graphics();
			paths[id].setStrokeStyle({
				width: size,
				color: erase ? toPixiHex($config.canvas.background) : toPixiHex(color),
				alpha: 1,
				join: "round",
				cap: "round",
			});
			paths[id].moveTo(x, y);
			// paths[id].blendMode = erase ? "erase" : "normal";

			container.addChild(paths[id]);
		});

		// Socket on path draw

		$socket.on("path:draw", (data) => {
			const { id, x, y, e } = data;

			if (!paths[id]) return;

			paths[id].lineTo(x, y);
			paths[id].stroke();
		});

		// Socket on path end

		$socket.on("path:end", () => {
			delete paths[$socket.id];
		});

		// Socket on image

		$socket.on("draw:image", ({ image, pos }) => {
			drawImage(image, pos);
		});

		// Socket on clear

		$socket.on("canvas:clear", (data) => {
			clear();

			if (!data) {
				goToCenter();
			}

			loadCanvas();
		});

		// Socket on clear area

		$socket.on("canvas:cleararea", ({ x, y, w, h }) => {
			const area = new Graphics();

			area.rect(x, y, w, h);
			area.fill({
				color: toPixiHex($config.canvas.background),
			});

			container.addChild(area);
		});

		// Socket on teleport

		$socket.on("canvas:teleport", (data) => {
			transform[X] = Math.round(
				window.innerWidth / 2 - parseInt(data.x) * scale
			);
			transform[Y] = Math.round(
				window.innerHeight / 2 - parseInt(data.y) * scale
			);

			translate();
			updateLocation();
		});
	}

	function drawImage(image, pos) {
		const img = new Image();
		console.log(img);
		img.src = image;

		img.onload = () => {
			const texture = Texture.from(img);
			const sprite = new Sprite(texture);

			sprite.anchor.set(0.5);
			sprite.position.set(pos[X], pos[Y]);

			container.addChild(sprite);
		};

		img.onerror = (err) => {
			console.log(err);
			console.error("Failed to load image");
		};
	}

	// Go to center

	function goToCenter() {
		mouse.drawing = false;
		mouse.panning = false;

		$socket.emit("path:end");

		transform[X] = Math.round(
			window.innerWidth / 2 - $config.canvas.size[0] / 2
		);
		transform[Y] = Math.round(
			window.innerHeight / 2 - $config.canvas.size[1] / 2
		);

		scale = 1;

		translate();
	}

	// Pointer down

	function pointerDown(e) {
		if ($app.activeModal || $prompt.active) return;

		e.button === 0 && !mouse.panning && (mouse.drawing = true);
		e.button === 1 && !mouse.drawing && (mouse.panning = true);

		mouse.posLast = [mouse.pos[X], mouse.pos[Y]];
		mouse.posLastWindow = [e.clientX, e.clientY];

		if (mouse.drawing) {
			// Single dot

			drawDot(
				mouse.pos[X],
				mouse.pos[Y],
				$tools.color,
				$tools.size,
				$tools.eraser
			);

			path = new Graphics();
			path.setStrokeStyle({
				width: $tools.size,
				color: $tools.eraser
					? toPixiHex($config.canvas.background)
					: toPixiHex($tools.color),
				alpha: 1,
				join: "round",
				cap: "round",
			});
			path.moveTo(mouse.posLast[X], mouse.posLast[Y]);
			// path.blendMode = $tools.eraser ? "erase" : "normal"; // move to start

			container.addChild(path);

			// Send current "settings" to server

			$socket.emit("path:start", {
				x: mouse.posLast[X],
				y: mouse.posLast[Y],
				c: $tools.color,
				s: $tools.size,
				e: $tools.eraser,
			});
		}
	}

	// Pointer up

	function pointerUp(e) {
		if ($app.activeModal || $prompt.active) return;

		pathCount = 0;

		e.button === 0 && (mouse.drawing = false);
		e.button === 1 && (mouse.panning = false);

		if (mouse.panning) return;

		mouse.posLast = [0, 0];

		e.button === 0 && $socket.emit("path:end");
	}

	// Pointer move

	function pointerMove(e) {
		updateMouse(e);

		// Drawing logic

		if (mouse.drawing) {
			pathCount++;

			if (pathCount % 2 !== 0) return;

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

		// Emit mouse position to show cursors

		if ($app.activeModal || $prompt.active) return;

		$socket.emit("mouse", {
			x: mouse.pos[X],
			y: mouse.pos[Y],
		});
	}

	// Pointer leave

	function pointerLeave() {
		mouse.drawing = false;
		$app.keys = [];
	}

	// Wheel

	function wheel(e) {
		if (mouse.panning || mouse.drawing) return;

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

	function zoom(direction, step, e = {}) {
		scale >= 1 ? (step = 0.5) : (step = 0.1);

		step = Math.sign(direction) > 0 ? step : -step;

		if (!Object.keys(e).length) {
			e = {
				clientX: window.innerWidth / 2,
				clientY: window.innerHeight / 2,
				deltaY: direction,
			};
		}

		const newScale = Math.min(Math.max(scale - step, 0.1), 10);
		const newX = e.clientX - (e.clientX - transform[X]) * (newScale / scale);
		const newY = e.clientY - (e.clientY - transform[Y]) * (newScale / scale);

		// Check if the new scale would exceed the canvas boundaries
		const canvasWidth = $config.canvas.size[0];
		const canvasHeight = $config.canvas.size[1];
		const minX = Math.min(0, window.innerWidth - canvasWidth * newScale);
		const minY = Math.min(0, window.innerHeight - canvasHeight * newScale);
		if (newX < minX || newX > 0 || newY < minY || newY > 0) {
			return;
		}

		transform[X] = Math.round(newX);
		transform[Y] = Math.round(newY);

		scale = Math.round(newScale * 100) / 100;

		translate();
	}

	// Apply the transform

	function translate() {
		const canvasWidth = $config.canvas.size[0];
		const canvasHeight = $config.canvas.size[1];

		const minX = Math.min(0, window.innerWidth - canvasWidth * scale);
		const minY = Math.min(0, window.innerHeight - canvasHeight * scale);

		transform[X] = Math.max(minX, Math.min(transform[X], 0));
		transform[Y] = Math.max(minY, Math.min(transform[Y], 0));

		container.position.set(transform[X], transform[Y]);
		container.scale.set(scale);

		bgContainer.position.set(transform[X], transform[Y]);
		bgContainer.scale.set(scale);

		$app.canvasZoom = scale;

		updateLocation();
	}

	// Converts a normal hex to a PIXI hex

	function toPixiHex(hex) {
		return parseInt(hex.replace("#", "0x"));
	}

	// Draw a single dot

	function drawDot(x, y, color, size, erase) {
		const dot = new Graphics();

		// dot.blendMode = erase ? "erase" : "normal";
		dot.circle(x, y, size / 2);
		dot.fill({
			color: erase ? toPixiHex($config.canvas.background) : toPixiHex(color),
		});

		container.addChild(dot);
	}

	// Clear the canvas

	function clear() {
		// Clear the container
		container.removeChildren();

		// Clear the paths

		paths = {};

		// Load the canvas

		loadCanvas();
	}

	// Drop

	function drop(e) {
		const file = e.dataTransfer.files[0];

		if (!file.type.includes("image")) return;

		const reader = new FileReader();
		const image = new Image();

		image.src = URL.createObjectURL(file);

		reader.onload = (e) => {
			$socket.emit("draw:image", {
				image: e.target.result,
				pos: [mouse.pos[X] + image.width / 2, mouse.pos[Y] + image.height / 2],
			});
		};

		reader.readAsDataURL(file);
	}

	// Drag over

	function dragOver(e) {
		updateMouse(e);
	}

	// Updating the mouse position

	function updateMouse(e) {
		mouse.pos = [
			Math.round(((e.clientX - transform[X]) / scale) * 100) / 100,
			Math.round(((e.clientY - transform[Y]) / scale) * 100) / 100,
		];
	}

	// Update the location of the screen center on canvas

	function updateLocation() {
		$app.canvasLocation = [
			Math.round((window.innerWidth / 2 - transform[X]) / scale),
			Math.round((window.innerHeight / 2 - transform[Y]) / scale),
		];
	}

	// Manual zoom

	$: {
		if ($app.keys["Control"] && $app.keys["+"]) {
			zoom(-1, 1);
		}

		if ($app.keys["Control"] && $app.keys["-"]) {
			zoom(1, 1);
		}
	}

	// Reset zoom and transform

	$: {
		if ($app.keys["c"] && !$app.activeModal && !$prompt.active) {
			scale = 1;
			goToCenter();
			translate();
		}
	}

	// maybe add a /mute command so that a users draws but others cant see it
</script>

<svelte:window
	on:mouseup={pointerUp}
	on:pointermove={pointerMove}
	on:pointercancel={pointerUp}
	on:resize={() => {
		updateLocation();
		translate();
	}}
/>

<svelte:body on:mousemove={pointerMove} />

<canvas
	bind:this={canvas}
	on:pointerdown={pointerDown}
	on:pointerleave={pointerLeave}
	on:wheel|preventDefault={wheel}
	on:drop|preventDefault={drop}
	on:dragover|preventDefault={dragOver}
	class:panning={mouse.panning}
	class:erasing={$tools.eraser}
></canvas>

{#if $settings.showCursors}
	<Cursors bind:transform bind:scale />
{/if}

{#if $settings.showDebug}
	<Debugger
		items={{
			Mouse: mouse.pos.join(" : "),
			MouseLast: mouse.posLast.join(" : "),
			Drawing: mouse.drawing,
			Panning: mouse.panning,
			Paths: Object.keys(paths).length,
			Transform: transform.join(" : "),
			Scale: scale,
			Connected: $socket.connected,
		}}
	/>
{/if}

<style lang="scss">
	canvas {
		&.panning {
			cursor: url("img/icons/cursor-move.svg"), auto !important;
		}
	}
</style>
