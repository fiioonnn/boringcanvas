<script>
	import OnlineCount from "./OnlineCount.svelte";
	import ServerPing from "./ServerPing.svelte";
</script>

<div class="infobox">
	<OnlineCount count={78} />
	<ServerPing ping={20} />
</div>

<style lang="scss">
	.infobox {
		position: fixed;
		left: 20px;
		top: 20px;
		border-radius: var(--radius-inner);
		background: var(--foreground);
		box-shadow: var(--shadow);
		height: 50px;
		border: var(--contour);
		user-select: none;

		padding: 0 20px;
		display: flex;
		align-items: center;
		gap: 20px;
	}
</style>
