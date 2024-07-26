<script>
	export let value;
</script>

<div class="settings-toggle" class:active={value}>
	<div class="settings-toggle__thumb"></div>
</div>

<style lang="scss">
	.settings-toggle {
		font-weight: 700;
		color: var(--red);
		text-align: right;
		position: relative;
		width: 40px;
		height: 20px;
		background-color: var(--buttons);
		border-radius: var(--radius-small);

		&__thumb {
			position: absolute;
			height: 100%;
			left: 0;
			top: 0;
			width: 20px;
			border-radius: var(--radius-small);
			background: var(--text-alt);
			transition: var(--transition-fast);
		}
		&.active {
			color: var(--green) !important;
			.settings-toggle__thumb {
				left: 20px;
				background: var(--green);
			}
		}
	}
</style>
