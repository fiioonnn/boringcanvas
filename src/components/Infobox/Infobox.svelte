<script>
	import OnlineCount from "./OnlineCount.svelte";
	import ServerPing from "./ServerPing.svelte";
	import { app } from "#store/stores";
	import { fly } from "svelte/transition";
</script>

<div class="infobox" transition:fly={{ duration: 300, y: -100 }}>
	<OnlineCount bind:count={$app.onlineCount} />
	<ServerPing bind:ping={$app.ping} />
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
		z-index: 200;
	}
</style>
