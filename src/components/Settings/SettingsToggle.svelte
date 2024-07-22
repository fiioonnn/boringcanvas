<script>
	export let value;
</script>

<div class="settings-toggle" class:active={value}>{value ? "ON" : "OFF"}</div>

<style lang="scss">
	.settings-toggle {
		font-weight: 700;
		color: var(--red);
		text-align: right;
		&.active {
			color: var(--green) !important;
		}
	}
</style>
