<script>
	import User from "./User.svelte";

	export let users = [];
</script>

<div class="users">
	{#if users.length}
		{#each users as user (user.username)}
			<User {user} />
		{/each}
	{:else}
		<p>No users found.</p>
	{/if}
</div>

<style lang="scss">
	.users {
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
