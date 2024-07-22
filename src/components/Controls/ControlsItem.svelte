<script>
	export let text;
	export let keys = [];
</script>

<div class="controls-item">
	<div class="controls-item__text">{text}</div>
	<div class="controls-item__keys">
		{#each keys as key, i}
			<kbd>{key}</kbd>
			{#if i < keys.length - 1}
				<span>+</span>
			{/if}
		{/each}
	</div>
</div>

<style lang="scss">
	.controls-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 30px;
		background: var(--controls);
		padding: 10px;
		border-radius: var(--radius-inner);
		&__text {
			word-break: break-all;
			hyphens: auto;
		}
		&__keys {
			display: flex;
			align-items: center;
			gap: 5px;
			span {
				color: var(--text-alt);
			}
		}
	}
</style>
