<script>
	import User from "./User.svelte";

	export let history;

	history = history.reverse();
</script>

<div class="user-history">
	{#if history.length}
		{#each history as user (user.username)}
			<User {user} />
		{/each}
	{:else}
		<p>No users found.</p>
	{/if}
</div>

<style lang="scss">
	.user-history {
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
