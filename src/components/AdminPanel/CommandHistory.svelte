<script>
	export let history = [];

	$: history = history.reverse();
</script>

<div class="command-history">
	{#if history.length}
		{#each history as item}
			<p class="command-history__item">
				<strong>{item.username}</strong> executed <span>{item.command}</span>
				<span class="date">{new Date(item.timestamp).toLocaleString()}</span>
			</p>
		{/each}
	{:else}
		<p class="command-history__item">No command history</p>
	{/if}
</div>

<style lang="scss">
	.command-history {
		display: grid;
		gap: 15px;
		max-height: 300px;
		overflow-y: auto;
		// hide scrollbar
		-ms-overflow-style: none;
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}

		&__item {
			border-radius: var(--radius-inner);
			background: var(--controls);
			padding: 15px;
			display: flex;
			align-items: center;
			gap: 5px;

			strong {
				color: var(--red);
			}
			span {
				font-weight: 700;
				color: var(--red);
				&.date {
					color: var(--text-alt);
					font-weight: 400;
					margin-left: auto;
					font-size: 14px;
				}
			}
		}
	}
</style>
