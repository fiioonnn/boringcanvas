<script>
	import { fade } from "svelte/transition";
	export let active;
</script>

{#if active}
	<div class="toolbar-submenu" class:active transition:fade={{ duration: 150 }}>
		<slot />
	</div>
{/if}

<style lang="scss">
	.toolbar-submenu {
		position: absolute;
		top: 50%;
		left: calc(100% + 20px);
		transform: translateY(-50%);
		padding: 10px;
		border-radius: var(--radius);
		background: var(--foreground);
		box-shadow: var(--shadow);
		display: grid;
		grid-template-columns: repeat(5, auto);
		gap: 10px;
		border: var(--contour);
		max-height: 250px;
		overflow-y: scroll;
		-ms-overflow-style: none;
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}
	}
</style>
