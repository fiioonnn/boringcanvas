<script>
	import IconCursor from "#components/Icons/IconCursor.svelte";
	import { socket } from "#store/stores";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	export let transform;
	export let scale;

	const [X, Y] = [0, 1];

	let cursors = {};

	onMount(() => {
		$socket.on("mouse", (data) => {
			cursors[data.username] = data;
			cursors[data.username].lastmove = Date.now();
			cursors[data.username].isInView = () => isInView(data.username);
		});

		// This could be a big performance problem
		let checkInterval = setInterval(() => {
			const now = Date.now();
			Object.keys(cursors).forEach((username) => {
				if (now - cursors[username].lastmove > 100000) {
					cursors = Object.fromEntries(
						Object.entries(cursors).filter(([key]) => key !== username)
					);
				} else {
				}
			});
		}, 5000);

		return () => {
			$socket.off("mouse");
			clearInterval(checkInterval);
		};
	});

	function isInView(username) {
		const x = cursors[username].x * scale + transform[X];
		const y = cursors[username].y * scale + transform[Y];
		return (
			x >= 0 && x <= window.innerWidth && y >= 0 && y <= window.innerHeight
		);
	}

	function handleMouseMove() {
		// check if all mouses are in view if not add a class to the cursor
		Object.keys(cursors).forEach((username) => {
			cursors[username].isInView = () => isInView(username);
		});
	}
</script>

<svelte:window on:mousemove={handleMouseMove} />
<div class="cursors">
	{#each Object.values(cursors) as cursor (cursor.username)}
		<div
			class="cursor"
			style="
			 --x: {Math.min(
				Math.max(cursor.x * scale + transform[X], 0),
				window.innerWidth - 20
			)}px;
            --y: {Math.min(
				Math.max(cursor.y * scale + transform[Y], 0),
				window.innerHeight - 20
			)}px;
			--color: {cursor.color};
		"
			data-name={cursor.username}
			class:outside={!cursor.isInView()}
			class:admin={cursor.admin}
			transition:fade={{ duration: 300 }}
		>
			<IconCursor color={cursor.color} />
		</div>
	{/each}
</div>

<style lang="scss">
	.cursors {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: hidden;
	}
	.cursor {
		position: absolute;
		top: var(--y);
		left: var(--x);
		width: 20px;
		height: 20px;
		pointer-events: none;
		transition: opacity 0.3s ease;
		&.outside {
			opacity: 0.75;
			&::before {
				opacity: 0;
			}
		}
		&::before {
			content: attr(data-name);
			position: absolute;
			top: calc(100% + 5px);
			left: 70%;
			font-size: 12px;
			line-height: 1;
			font-weight: 700;
			color: var(--text);
			white-space: nowrap;
			background: #404040;
			padding: 5px;
			border-radius: 5px;
			border: var(--contour);
			transition: var(--transition-base);
		}
		&.admin {
			&::before {
				content: "🛡 " attr(data-name);
				color: var(--red);
				border-color: var(--red);
			}
		}
	}
</style>
