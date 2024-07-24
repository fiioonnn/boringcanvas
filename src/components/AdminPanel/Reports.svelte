<script>
	import { slide } from "svelte/transition";
	import Report from "./Report.svelte";
	import { socket } from "#store/stores";

	export let list = [];

	function handleClose(id) {
		$socket.emit("command", `/closereport ${id}`);
	}

	function handleDelete(id) {
		$socket.emit("command", `/deletereport ${id}`);
		list = list.filter((report) => report.id !== id);
	}
</script>

<div class="reports" transition:slide={{ duration: 300 }}>
	<p>There are {list.length} reports available.</p>
	{#if list.length === 0}
		<p>No reports available.</p>
	{:else}
		<div class="reports__list">
			{#each list as report (report.id)}
				<Report {...report} fnClose={handleClose} fnDelete={handleDelete} />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.reports {
		display: grid;
		gap: 15px;
		&__list {
			display: grid;
			gap: 15px;
		}
	}
</style>
