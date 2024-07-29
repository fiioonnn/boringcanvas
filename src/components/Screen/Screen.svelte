<script>
	import { fade } from "svelte/transition";
	import { screen } from "#store/screen";
</script>

<div class="screen" transition:fade={{ duration: 100 }}>
	<h1 class="screen__title">{$screen.title}</h1>
	<p class="screen__text">{@html $screen.text}</p>
	{#if $screen.keys}
		<p class="screen__keys">
			{#each $screen.keys as key, i}
				<kbd>{key}</kbd>
				{#if i < $screen.keys.length - 1}
					<span>+</span>
				{/if}
			{/each}
		</p>
	{/if}
</div>

<style lang="scss">
	.screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--background);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		text-align: center;
		z-index: 9999;
		user-select: none;
		padding: 20px;
		&__title {
			font-size: 32px;
			font-weight: 700;
		}
		&__text {
			max-width: 500px;
			color: var(--text-alt);
		}
		&__keys {
			display: flex;
			align-items: center;
			gap: 10px;
			color: var(--text-alt);
			margin-top: 10px;
		}
	}
</style>
