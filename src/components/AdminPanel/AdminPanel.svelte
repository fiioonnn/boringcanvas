<script>
	import { username } from "#store/stores.js";
	import { socket } from "#store/stores.js";
	import { onMount } from "svelte";

	import User from "./User.svelte";

	let users = [];

	onMount(() => {
		loadUsers();

		let interval = setInterval(() => {
			loadUsers();
		}, 5000);

		return () => {
			clearInterval(interval);
		};
	});

	function loadUsers() {
		$socket.emit("get:users");
		$socket.once("users", (data) => {
			users = data;
		});
	}

	function handleClick(action, username) {
		console.log(action, username);
		$socket.emit("command", `/${action} ${username}`);
		setTimeout(() => {
			loadUsers();
		}, 500);
	}
</script>

<div class="admin-panel">
	<p>Welcome {$username} have a wonderful day!</p>
	<!-- <form on:submit|preventDefault={handleSubmit}>
		<div class="group">
			<label for="">
				<span>Run a command:</span>
				<input type="text" placeholder="/.." />
			</label>
			<button>Send</button>
		</div>
	</form> -->
	<h3>Users</h3>
	<div class="admin-panel__users">
		{#each users as user}
			<User {...user} fn={handleClick} />
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
