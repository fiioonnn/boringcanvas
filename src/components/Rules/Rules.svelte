<script>
	import { app, config } from "#store/stores.js";
</script>

<div class="rules">
	<p>
		When playing on boringcanvas.io, you <u>must</u> adhere to the following rules.
	</p>
	{#if !$config.rules.list.length}
		<p>
			No rules found. Please reload or contact support (<a
				href="mailto:support@boringcanvas.io">support@boringcanvas.io</a
			>)
		</p>
	{:else}
		<ol>
			{#each $config.rules.list as rule}
				<li>{@html rule.title}</li>
				<ul>
					{#each rule.subRules as subRule}
						<li>{@html subRule}</li>
					{/each}
				</ul>
			{/each}
		</ol>
	{/if}
	<p class="rules__info">Breaching these rules can lead to a permanent ban.</p>
</div>

<style lang="scss">
	.rules {
		color: var(--text-normal);
		p {
			& + * {
				margin-top: 20px;
			}
			a {
				cursor: url("img/icons/cursor-pointer.svg"), auto;
			}
		}
		ol {
			padding-left: 0;
			> li {
				font-weight: 700;
			}
		}
		&__info {
			margin-top: 20px;
			font-size: 14px;
			text-align: center;
			color: var(--text-alt);
		}
	}
</style>
