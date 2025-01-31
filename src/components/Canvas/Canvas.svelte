<script>
	import { onMount } from "svelte";
	import { config, tools, app, socket, settings } from "#store/stores";
	import { prompt } from "#store/prompt";

	import MiniMap from "./MiniMap.svelte";
	import Debugger from "#components/Debug/Debugger.svelte";
	import Cursors from "#components/Cursors/Cursors.svelte";
	import { loader } from "#store/loader";
	import Actions from "#components/AdminPanel/Actions.svelte";

	const [X, Y] = [0, 1];

	// Canvas
	let canvas;
	let ctx;
	// Mouse
	let mouse = {
		drawing: false,
		panning: false,
		moving: false,
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
	let pathId = "";

	// Holds all paths that are currently being drawn sorted by id and then drawn (rendered)
	const paths = {};

	onMount(() => {
		ctx = canvas.getContext("2d");

		// Make context globally available
		$app.ctx = ctx;

		// Initialize canvas
		initializeCanvas();

		//
		// Load canvas from server
		//

		loadCanvas();

		//
		// Listen for draw events
		//
		const pathIds = {};
		$socket.on("draw", (data) => {
			preDrawLogicMLG(data);
		});

		// for (let i = 0; i < 10000; i++) {
		// 	$socket.emit("draw", {
		// 		pos: [Math.random() * 1000, Math.random() * 1000],
		// 		color: "#ffffff",
		// 		size: 5,
		// 		erase: false,
		// 		pathId: "test",
		// 	});
		// }

		//
		// Listen for clear event
		//

		$socket.on("clear", () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawLogo();
			loadCanvas();
		});

		return () => {
			$socket.off("draw");
			$socket.off("clear");
		};
	});

	function drawCircle(point) {
		ctx.beginPath();
		if (point.e) {
			ctx.globalCompositeOperation = "destination-out";
		} else {
			ctx.globalCompositeOperation = "source-over";
		}
		ctx.arc(point.p[X], point.p[Y], point.s / 2, 0, 2 * Math.PI);
		ctx.fillStyle = point.c;
		ctx.fill();
	}

	function drawLine(prevPoint, point) {
		ctx.beginPath();
		if (point.e) {
			ctx.globalCompositeOperation = "destination-out";
		} else {
			ctx.globalCompositeOperation = "source-over";
		}
		ctx.strokeStyle = point.c;
		ctx.lineWidth = point.s;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.moveTo(prevPoint.p[X], prevPoint.p[Y]);
		ctx.lineTo(point.p[X], point.p[Y]);
		ctx.stroke();
	}
	function preDrawLogicMLG(data) {
		if (!paths[data.pI]) {
			paths[data.pI] = [];
		}
		console.log(data);
		paths[data.pI].push(data);

		// Draw all points in the path
		Object.values(paths).forEach((path) => {
			path.forEach((point, index) => {
				if (!point.drawn) {
					if (index === 0) {
						// If it's the first point, just draw a circle
						drawCircle(point);
					} else {
						// Otherwise, draw a line from the previous point to the current point
						const prevPoint = path[index - 1];

						drawLine(prevPoint, point);
					}
					point.drawn = true;
				}
			});
		});
	}

	//
	// Load canvas from server
	//

	async function loadCanvas() {
		fetch($app.serverURL + "/canvas")
			.then((res) => {
				loader.show({ text: "Loading canvas..." });

				return res.json();
			})
			.then((data) => {
				data.forEach((point) => {
					preDrawLogicMLG(point);
				});

				loader.hide();
			});
	}

	/**
	 * Initialize canvas, used to set the size and
	 * background color of the canvas.
	 */
	function initializeCanvas() {
		// Set canvas size
		canvas.width = $config.canvas.size[X];
		canvas.height = $config.canvas.size[Y];

		// // Set canvas background
		// ctx.fillStyle = $config.canvas.background;
		// ctx.fillRect(0, 0, canvas.width, canvas.height);

		// // Draw grid
		// drawGrid();

		// Go to center
		transform = [
			Math.floor((window.innerWidth - canvas.width) / 2),
			Math.floor((window.innerHeight - canvas.height) / 2),
		];

		translate();

		// Draw logo
		drawLogo();
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
	 * Draw the logo on the canvas.
	 */
	function drawLogo() {
		const img = new Image();

		img.src = $config.canvas.logo;
		img.onload = (e) => {
			const { width, height } = e.target;
			ctx.globalAlpha = 0.1; // Set opacity to 0.1
			ctx.drawImage(
				img,
				canvas.width / 2 - width / 2,
				canvas.height / 2 - height / 2,
				width,
				height
			);
			ctx.globalAlpha = 1; // Reset opacity to 1
		};
	}

	/**
	 * Handle mouse down event, used to start drawing/panning
	 * on the canvas.
	 * @param {MouseEvent} event
	 */
	function handleMouseDown(event) {
		if (!mouse.drawing && !mouse.panning) {
			pathId = generateId();
		}

		event.button === 0 && !mouse.panning && (mouse.drawing = true);
		event.button === 1 && !mouse.drawing && (mouse.panning = true);

		setTimeout(() => {
			if (mouse.drawing && !mouse.moving) {
				$socket.emit("draw", {
					p: mouse.pos.canvas,
					c: $tools.color,
					s: $tools.size,
					pI: pathId,
					e: $tools.eraser,
				});

				preDrawLogicMLG({
					p: mouse.pos.canvas,
					c: $tools.color,
					s: $tools.size,
					pI: pathId,
					e: $tools.eraser,
				});
			}
		}, 50);

		mouse.pos.last = mouse.pos.canvas;
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
		// event.button === 2 && ($tools.eraser = false);

		if (!mouse.drawing && !mouse.panning) {
			mouse.pos.last = [0, 0];
			pathId = "";
		}

		// reset the path

		path = [];
	}

	/**
	 * Handle mouse move event, used to draw/pan on the canvas.
	 * @param {MouseEvent} event
	 */
	let test = null;

	function handleMouseMove(event) {
		//
		// Set mouse move to true
		//

		mouse.move = true;

		clearTimeout(test);

		test = setTimeout(() => {
			mouse.move = false;
		}, 10);

		mouse.pos.canvas = [
			event.clientX - transform[X],
			event.clientY - transform[Y],
		];

		//
		// If connected, send mouse position to server
		//

		if ($socket.connected) {
			if (!mouse.panning && !$app.activeModal && !$prompt.active) {
				$socket.emit("mouse", {
					x: mouse.pos.canvas[X],
					y: mouse.pos.canvas[Y],
				});
			}
		}

		//
		// Drawing
		//

		if (mouse.drawing) {
			path.push(1);

			// only every 5th point

			if (path.length % 3 !== 0) return;

			preDrawLogicMLG({
				p: mouse.pos.canvas,
				c: $tools.color,
				s: $tools.size,
				pI: pathId,
				e: $tools.eraser,
			});

			$socket.emit("draw", {
				p: mouse.pos.canvas,
				c: $tools.color,
				s: $tools.size,
				pI: pathId,
				e: $tools.eraser,
			});

			mouse.pos.last = mouse.pos.canvas;
		}

		//
		// Panning
		//

		if (mouse.panning) {
			pan(event);
		}
	}

	/**
	 * Handle mouse wheel event, used to zoom in/out on the canvas.
	 * @param {WheelEvent} event
	 */
	function handleMouseWheel(event) {
		event.preventDefault();

		if (mouse.drawing || mouse.panning) return;

		$app.keys["Shift"] && (transform[X] += -Math.floor(event.deltaY));
		!$app.keys["Shift"] && (transform[Y] += -Math.floor(event.deltaY));

		checkBorders();
		translate();
	}

	/**
	 * Handle mouse leave event, used to reset the mouse position
	 * when the mouse leaves the canvas.
	 */
	function handleMouseLeave() {
		mouse.drawing = false;
		$app.keys = [];
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

	let prevPoint;

	function draw(point) {
		if (point.erase) {
			ctx.globalCompositeOperation = "destination-out";
		} else {
			ctx.globalCompositeOperation = "source-over";
		}

		//
		// If the point is a single point, draw a circle
		//

		if (!point.pI) {
			ctx.beginPath();
			ctx.arc(point.p[X], point.p[Y], point.s / 2, 0, 2 * Math.PI);
			ctx.fillStyle = point.c;
			ctx.fill();
			return;
		}

		ctx.beginPath();
		ctx.strokeStyle = point.c;
		ctx.lineWidth = point.s;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		if (prevPoint && prevPoint.pI === point.pI) {
			ctx.moveTo(prevPoint.p[X], prevPoint.p[Y]);
			ctx.lineTo(point.p[X], point.p[Y]);
		} else {
			ctx.moveTo(point.p[X], point.p[Y]);
		}

		ctx.stroke();

		prevPoint = point;

		// ctx.beginPath();
		// ctx.strokeStyle = $tools.color;
		// ctx.lineWidth = $tools.size;
		// ctx.lineCap = "round";
		// ctx.lineJoin = "round";
		// if (path.length > 0) {
		// 	const firstPoint = path[0];
		// 	ctx.moveTo(firstPoint.pos[X], firstPoint.pos[Y]);
		// }
		// path.forEach((point, i) => {
		// 	if (i === 0) {
		// 		ctx.beginPath();
		// 		ctx.globalCompositeOperation = point.erase
		// 			? "destination-out"
		// 			: "source-over";
		// 		ctx.moveTo(point.pos[X], point.pos[Y]);
		// 	} else {
		// 		const prevPoint = path[i - 1];
		// 		const currentPoint = point;
		// 		const controlPoint = [
		// 			(prevPoint.pos[X] + currentPoint.pos[X]) / 2,
		// 			(prevPoint.pos[Y] + currentPoint.pos[Y]) / 2,
		// 		];
		// 		ctx.quadraticCurveTo(
		// 			prevPoint.pos[X],
		// 			prevPoint.pos[Y],
		// 			controlPoint[X],
		// 			controlPoint[Y]
		// 		);
		// 	}
		// 	if (point.drawn) return;
		// 	ctx.stroke();
		// 	point.drawn = true;
		// 	$socket.emit("draw", {
		// 		pos: point.pos,
		// 		color: point.color,
		// 		size: point.size,
		// 		erase: point.erase,
		// 	});
		// });
		// path.forEach((point, i) => {
		// 	ctx.strokeStyle = point.color;
		// 	ctx.lineWidth = point.size;
		// 	ctx.lineCap = "round";
		// 	ctx.lineJoin = "round";
		// 	ctx.globalCompositeOperation = point.erase
		// 		? "destination-out"
		// 		: "source-over";
		// 	if (i === 0) {
		// 		ctx.beginPath();
		// 		ctx.moveTo(point.pos[X], point.pos[Y]);
		// 	} else {
		// 		const prevPoint = path[i - 1];
		// 		const currentPoint = point;
		// 		const controlPoint = [
		// 			(prevPoint.pos[X] + currentPoint.pos[X]) / 2,
		// 			(prevPoint.pos[Y] + currentPoint.pos[Y]) / 2,
		// 		];
		// 		ctx.quadraticCurveTo(
		// 			prevPoint.pos[X],
		// 			prevPoint.pos[Y],
		// 			controlPoint[X],
		// 			controlPoint[Y]
		// 		);
		// 	}
		// });
		// ctx.stroke();
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

	/**
	 * Check if the canvas is within the window bounds.
	 */
	function checkBorders() {
		const canvasBounds = canvas.getBoundingClientRect();

		if (transform[X] > 0) transform[X] = 0;
		if (transform[Y] > 0) transform[Y] = 0;
		if (transform[X] < -canvasBounds.width + window.innerWidth)
			transform[X] = -canvasBounds.width + window.innerWidth;
		if (transform[Y] < -canvasBounds.height + window.innerHeight)
			transform[Y] = -canvasBounds.height + window.innerHeight;
	}

	/**
	 * Generate a random id for each path.
	 */
	function generateId(length = 24) {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_#.!";
		let result = "";

		for (let i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * characters.length)
			);
		}

		return result;
	}
</script>

<svelte:window on:mouseup={handleMouseUp} />
<svelte:body on:mousemove={handleMouseMove} />

<canvas
	class="canvas"
	bind:this={canvas}
	on:mousedown={handleMouseDown}
	on:mouseleave={handleMouseLeave}
	on:wheel|nonpassive={handleMouseWheel}
	class:draggin={mouse.panning}
	class:erasing={$tools.eraser}
></canvas>

{#if $app.debug}
	<Debugger
		items={{
			"Mouse Pos": mouse.pos.canvas.join(":"),
			"Mouse Last": mouse.pos.last,
			"Mouse Last Window": mouse.pos.lastWindow,
			Drawing: mouse.drawing,
			Panning: mouse.panning,
			Moving: mouse.move,
			Erasing: $tools.eraser,
			Path: path.length,
			PathId: pathId,
			"Path length": Object.keys(paths).length,
			"Canvas Size": [$config.canvas.size[X], $config.canvas.size[Y]].join(
				" x "
			),
		}}
	/>
{/if}

{#if $settings.showCursors}
	<Cursors bind:transform />
{/if}

<style lang="scss">
	.canvas {
		background-size: 40px 40px;

		background-color: var(--background);
		background-image: radial-gradient(
			circle,
			#272727 2px,
			rgba(0, 0, 0, 0) 1px
		);
		position: fixed;
		top: 0;
		left: 0;
		&.draggin {
			cursor: url("img/icons/cursor-move.svg"), auto;
		}
		&.erasing {
			cursor: crosshair;
		}
	}
</style>
