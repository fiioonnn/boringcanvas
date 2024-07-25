<script>
	import ToolbarItem from "./ToolbarItem.svelte";
	import IconSize from "./../Icons/IconSize.svelte";
	import IconColor from "#components/Icons/IconColor.svelte";
	import IconEraser from "#components/Icons/IconEraser.svelte";
	import IconMenu from "#components/Icons/IconMenu.svelte";
	import { tools, config, app } from "#store/stores.js";
</script>

<div class="toolbar">
	<ToolbarItem icon={IconColor} color={$tools.color}>
		{#each $config.colors as color}
			<ToolbarItem
				icon={IconColor}
				fn={() => ($tools.color = color)}
				{color}
				toggle
				type="color"
			/>
		{/each}
	</ToolbarItem>
	<ToolbarItem icon={IconSize} color={$tools.color} size={$tools.size}>
		{#each $config.sizes as size (size)}
			<ToolbarItem
				icon={IconSize}
				fn={() => ($tools.size = size)}
				color={$tools.color}
				{size}
				toggle
				type="size"
			/>
		{/each}
	</ToolbarItem>
	<ToolbarItem
		icon={IconEraser}
		fn={() => ($tools.eraser = !$tools.eraser)}
		type="eraser"
		toggle
	/>
	<ToolbarItem icon={IconMenu} fn={() => ($app.activeModal = "settings")} />
</div>

<style lang="scss">
	.toolbar {
		position: fixed;
		left: 20px;
		top: 50%;
		transform: translateY(-50%);
		padding: 10px;
		border-radius: var(--radius);
		background: var(--foreground);
		box-shadow: var(--shadow);
		display: grid;
		gap: 10px;
		border: var(--contour);
		z-index: 200;
	}
</style>
