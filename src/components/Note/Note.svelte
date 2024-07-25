<script>
	import { onMount } from "svelte";
	import { app } from "#store/stores";

	let note = null;

	onMount(() => {
		note = fetch(`${$app.serverURL}/note`).then((res) => res.text());
	});
</script>

<div class="note">
	{#await note}
		<p>Loading...</p>
	{:then note}
		{@html note}
	{:catch error}
		<p>Failed to load {error}</p>
	{/await}
</div>

<style lang="scss">
	.note {
		display: grid;
		gap: 15px;
	}
</style>
