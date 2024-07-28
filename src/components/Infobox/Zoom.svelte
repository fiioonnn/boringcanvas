<script>
	import { app } from "#store/stores";
</script>

<p class="zoom">
	<i class="fa-solid fa-magnifying-glass"></i>
	{Math.round($app.canvasZoom * 100)}%
</p>

<style lang="scss">
	.zoom {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0;
		background: transparent;
		border: 0;
		p,
		i {
			color: var(--text-normal);
		}
	}
</style>
