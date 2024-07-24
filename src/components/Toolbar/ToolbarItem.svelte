<script>
	import ToolbarSubmenu from "./ToolbarSubmenu.svelte";
	import { tools } from "#store/stores.js";

	export let icon;
	export let active = false;
	export let toggle = false;
	export let color = "#f0f0f0";
	export let size = 0;
	export let type = null;
	export let fn = () => {};

	let item;

	function handleClick() {
		fn();

		active = !active;

		if (type === "color") {
			$tools.eraser = false;
		}
	}

	function handleWindowClick(event) {
		if (active && item && !item.contains(event.target) && !toggle) {
			active = false;
		}
	}

	$: {
		if (type === "color") {
			$tools.color === color ? (active = true) : (active = false);
		}
		if (type === "size") {
			$tools.size === size ? (active = true) : (active = false);
		}
		if (type === "eraser") {
			$tools.eraser ? (active = true) : (active = false);
		}
	}
</script>

<svelte:window on:mousedown={handleWindowClick} />

<button
	class="toolbar-item"
	class:active
	class:toggle
	bind:this={item}
	on:click|self={handleClick}
>
	{#if $$slots.default}
		<ToolbarSubmenu {active}>
			<slot />
		</ToolbarSubmenu>
	{/if}
	<svelte:component this={icon} {color} {size} />
</button>

<style lang="scss">
	.toolbar-item {
		width: 50px;
		height: 50px;
		border-radius: var(--radius-inner);
		background: var(--controls);
		border: var(--contour);
		transition: var(--transition-base);
		display: grid;
		place-content: center;
		position: relative;
		&:hover:not(:has(:hover)) {
			cursor: pointer;
			border-color: var(--contour-hover);
		}
		&:active:not(:has(:active)) {
			border-color: var(--contour-active);
		}
		&.active {
			&.toggle {
				&::before {
					background: var(--green);
				}
			}
		}
		&.toggle {
			&::before {
				content: "";
				position: absolute;
				top: 5px;
				right: 5px;
				width: 5px;
				height: 5px;
				border-radius: 50%;
				background: var(--background);
			}
		}
	}
</style>
