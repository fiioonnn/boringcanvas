<script>
	import ControlsItem from "./ControlsItem.svelte";
	import { config } from "#store/stores.js";
</script>

<div class="controls">
	{#each $config.controls as { text, keys }}
		<ControlsItem {text} {keys} />
	{/each}
</div>

<style lang="scss">
	.controls {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 15px;
		user-select: none;
	}
</style>
