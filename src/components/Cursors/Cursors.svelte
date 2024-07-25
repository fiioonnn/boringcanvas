<script>
	import IconCursor from "#components/Icons/IconCursor.svelte";
	import { socket } from "#store/stores";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	export let transform;

	let cursors = {};
	const [X, Y] = [0, 1];

	onMount(() => {
		$socket.on("mouse", (data) => {
			cursors[data.username] = data;
			cursors[data.username].lastmove = Date.now();
			cursors[data.username].isInView = () => {
				const x = cursors[data.username].x + transform[X];
				const y = cursors[data.username].y + transform[Y];
				return (
					x >= 0 && x <= window.innerWidth && y >= 0 && y <= window.innerHeight
				);
			};
		});

		// This could be a big performance problem
		let checkInterval = setInterval(() => {
			const now = Date.now();
			Object.keys(cursors).forEach((username) => {
				if (now - cursors[username].lastmove > 1000) {
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
</script>

{#each Object.values(cursors) as cursor}
	<div
		class="cursor"
		style="
			--x: {Math.min(Math.max(cursor.x + transform[X], 0), window.innerWidth - 20)}px;
			--y: {Math.min(
			Math.max(cursor.y + transform[Y], 0),
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

<style lang="scss">
	.cursor {
		position: absolute;
		top: var(--y);
		left: var(--x);
		width: 20px;
		height: 20px;
		pointer-events: none;
		z-index: 100;
		&.outside {
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
