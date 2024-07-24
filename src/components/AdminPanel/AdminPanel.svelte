<script>
	import { username } from "#store/stores.js";
	import { toasts } from "#store/toasts.js";
	import { socket } from "#store/stores.js";
	import { onMount } from "svelte";
	import User from "./User.svelte";

	let users = [];

	onMount(() => {
		loadUsers();
	});

	function loadUsers() {
		$socket.emit("get:users");
		$socket.once("users", (data) => {
			console.log(data);
			users = data.users;
		});
	}

	function handleSubmit(event) {}
</script>

<div class="admin-panel">
	<p>Welcome {$username} have a wonderful day!</p>
	<form on:submit|preventDefault={handleSubmit}>
		<div class="group">
			<label for="">
				<span>Run a command:</span>
				<input type="text" placeholder="/.." />
			</label>
			<button>Send</button>
		</div>
	</form>

	<div class="admin-panel__users">
		{#each users as user}
			<User {...user} />
		{/each}
	</div>
</div>

<style lang="scss">
	.admin-panel {
		display: grid;
		gap: 15px;

		&__users {
			display: grid;
			gap: 15px;
		}
		p,
		li {
			color: var(--text-normal);
		}
		form {
			display: grid;
			gap: 15px;
			.group {
				display: grid;
				grid-template-columns: 3fr 1fr;
				align-items: flex-end;
				gap: 15px;
				label,
				input {
					flex: 3;
				}
			}
		}
	}
</style>
