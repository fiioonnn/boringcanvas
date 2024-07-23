<script>
	export let items = null;
</script>

<div class="debugger">
	<ul>
		{#if items}
			{#each Object.entries(items) as [key, value]}
				{#if value === "seperator"}
					<hr />
				{:else}
					<li>
						{key}:
						<span
							class:green={value === true}
							class:red={value === false}
							class:orange={parseInt(value)}>{value}</span
						>
					</li>
				{/if}
			{/each}
		{:else}
			<li>No items provided</li>
		{/if}
	</ul>
</div>

<style lang="scss">
	.debugger {
		position: fixed;
		top: 20px;
		right: 20px;
		border-radius: var(--radius);
		padding: 20px;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(10px);
		min-width: 400px;
		user-select: none;
		ul {
			display: grid;
			gap: 10px;
			padding: 0;
			hr {
				border: 0;
				height: 1px;
				background: linear-gradient(
					90deg,
					transparent,
					rgba(#fff, 0.3),
					transparent
				);
				margin: 10px 0;
			}
			li {
				display: flex;
				align-self: start;
				justify-content: space-between;
				gap: 50px;
				&::before {
					display: none;
				}
				span {
					font-weight: 700;
					&.green {
						color: var(--green);
					}
					&.red {
						color: var(--red);
					}
					&.orange {
						color: var(--orange);
					}
				}
			}
		}
	}
</style>
