<script>
	import Report from "./Report.svelte";

	export let reports = [];
</script>

<div class="reports">
	{#if reports.length}
		{#each reports as report (report.id)}
			<Report {report} />
		{/each}
	{:else}
		<p>No reports found.</p>
	{/if}
</div>

<style lang="scss">
	.reports {
		display: grid;
		gap: 15px;
		max-height: 300px;
		overflow-y: auto;
		// hide scrollbar
		-ms-overflow-style: none;
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}
	}
</style>
