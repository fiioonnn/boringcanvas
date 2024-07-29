<script>
	import CommandHistory from "./CommandHistory.svelte";
	import { username, socket, app } from "#store/stores";
	import { onMount } from "svelte";
	import Users from "./Users.svelte";
	import Actions from "./Actions.svelte";
	import Reports from "./Reports.svelte";
	import UserHistory from "./UserHistory.svelte";

	let data;
	let active = "users";

	onMount(() => {
		//
		// Send a request to the server to get the admin data
		//

		loadData();

		let interval = setInterval(() => {
			loadData();
		}, 1000);

		//
		// Listen for the admin data
		//

		$socket.on("admindata", (admindata) => {
			data = admindata;
		});

		return () => {
			clearInterval(interval);
			$socket.off("admindata");
		};
	});

	//
	// Load data from the server
	//

	function loadData() {
		$socket.emit("get:admindata");
	}

	function toReadableTime(ms) {
		const days = Math.floor(ms / (1000 * 60 * 60 * 24));
		const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((ms % (1000 * 60)) / 1000);

		return `${days}d ${hours}h ${minutes}m ${seconds}s`;
	}
</script>

<div class="admin-panel">
	<p>Welcome {$username} to the AdminPanel</p>
	<div class="admin-panel__tags">
		<p class="admin-panel__tag">
			Players online: <span>{$app.onlineCount}</span>
		</p>
		<p class="admin-panel__tag">Server: <span>{$app.serverURL}</span></p>
		<p class="admin-panel__tag">
			Server uptime: <span>{toReadableTime($app.serverUptime)}</span>
		</p>
		<p class="admin-panel__tag">
			Draw points: <span>{data?.drawings}</span>
		</p>
		<p class="admin-panel__tag">
			Drawings in KB: <span
				>{Math.floor((data?.drawingsSize / 1000) * 100) / 100} KB</span
			>
		</p>
	</div>
	<div class="admin-panel__navigation">
		<button
			on:click={() => (active = "users")}
			class:active={active === "users"}
		>
			Users
		</button>
		<button
			on:click={() => (active = "reports")}
			class:active={active === "reports"}
		>
			Reports
		</button>
		<button
			on:click={() => (active = "actions")}
			class:active={active === "actions"}
		>
			Actions
		</button>
		<button
			on:click={() => (active = "cmdhistory")}
			class:active={active === "cmdhistory"}
		>
			Command history
		</button>
		<button
			on:click={() => (active = "userhistory")}
			class:active={active === "userhistory"}
		>
			User history
		</button>
	</div>
	{#if active === "users"}
		<h3>Users</h3>
		<Users users={data?.users} />
	{:else if active === "reports"}
		<h3>Reports</h3>
		<Reports reports={data?.reports} />
	{:else if active === "actions"}
		<h3>Actions</h3>
		<Actions />
	{:else if active === "cmdhistory"}
		<h3>Command history</h3>
		<CommandHistory history={data?.commandHistory} />
	{:else if active === "userhistory"}
		<UserHistory history={data?.userHistory} />
	{/if}
</div>

<style lang="scss">
	.admin-panel {
		display: grid;
		gap: 15px;
		&__tags {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 15px;
		}
		&__tag {
			padding: 15px;
			background: var(--controls);
			flex: 1;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 14px;
			border-radius: var(--radius-inner);
			span {
				font-weight: bold;
			}
		}
		&__navigation {
			display: flex;
			overflow: hidden;
			border-radius: var(--radius-inner);

			button {
				border-radius: 0;
				border: 0;
				&:hover,
				&.active {
					background-color: var(--buttons-hover);
				}
			}
		}
	}
</style>
