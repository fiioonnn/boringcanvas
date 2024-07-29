<script>
	import OnlineCount from "./OnlineCount.svelte";
	import ServerPing from "./ServerPing.svelte";
	import Location from "./Location.svelte";
	import Zoom from "./Zoom.svelte";
	import AdminIcon from "./AdminIcon.svelte";

	import { app } from "#store/stores";
	import { fly } from "svelte/transition";
</script>

<ul class="infobox" transition:fly={{ duration: 300, y: -100 }}>
	{#if $app.isAdmin}
		<li><AdminIcon /></li>
	{/if}
	<li><OnlineCount bind:count={$app.onlineCount} /></li>
	<li><ServerPing bind:ping={$app.ping} /></li>
	<li><Zoom /></li>
	<li><Location /></li>
</ul>

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
		gap: 0;
		// gap: 20px;
		z-index: 200;

		li {
			&::before {
				display: none;
			}
			&:not(:first-child) {
				border-left: 1px solid var(--buttons);
				padding-left: 10px;
				margin-left: 10px;
			}
		}
	}
</style>
