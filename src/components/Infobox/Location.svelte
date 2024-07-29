<script>
	import { app } from "#store/stores";
	import { toasts } from "#store/toasts";

	function handleClick() {
		navigator.clipboard.writeText($app.canvasLocation.join(":"));
		toasts.create("Location copied", "Location copied to clipboard", "success");
	}
</script>

<p class="location" on:click={handleClick} aria-hidden="true">
	<i class="fa-solid fa-location"></i>
	{$app.canvasLocation.join(":")}
</p>

<style>
	.location {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: url("img/icons/cursor-pointer.svg"), auto;
	}
</style>
