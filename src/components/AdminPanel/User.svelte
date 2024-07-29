<script>
	import { socket, app } from "#store/stores";
	import { prompt } from "#store/prompt";
	export let user = {};

	function run(command) {
		$socket.emit("command", `/${command}`);
	}

	function ban() {
		$app.activeModal = "";
		prompt.show({
			text: `Ban reason for ${user.username}`,
			cancel: true,
			fn: (reason) => {
				run(`ban ${user.username} ${reason}`);
			},
		});
	}

	function unban() {
		run(`unban ${user.username}`);
	}

	function giveAdmin() {
		$app.activeModal = "";
		prompt.show({
			text: `Are you sure you want to give admin to ${user.username}?`,
			cancel: true,
			input: false,
			fn: (reason) => {
				run(`admin ${user.username}`);
			},
		});
	}

	function removeAdmin() {
		run(`removeadmin ${user.username}`);
	}

	function kick() {
		$app.activeModal = "";
		prompt.show({
			text: `Are you sure you want to kick ${user.username}?`,
			cancel: true,
			placeholder: "Enter the reason..",
			fn: (reason) => {
				run(`kick ${user.username} ${reason}`);
			},
		});
	}

	function forceNameChange() {
		// run(`clear ${user.username}`);
		run(`fnc ${user.username}`);
	}

	function clear() {
		run(`clear ${user.username}`);
	}
</script>

<div
	class="user"
	class:user--admin={user?.admin}
	class:user--banned={user?.banned}
>
	<p class="user__name">
		<strong>{user?.username}</strong>
		<span class="user__address">({user?.address})</span>
		{#if user?.banned}
			<span class="user__reason">{user?.reason}</span>
		{/if}
	</p>
	<div class="user__actions">
		{#if user?.banned}
			<button title="Unan" on:click={unban}>
				<i class="fa-solid fa-unlock"></i>
			</button>
		{:else}
			<button title="Ban" on:click={ban}>
				<i class="fa-solid fa-ban"></i>
			</button>
			<button title="Kick" on:click={kick}>
				<i class="fa-solid fa-sign-out"></i>
			</button>
			<button title="Force change name" on:click={forceNameChange}>
				<i class="fa-solid fa-refresh"></i>
			</button>
			{#if user?.admin}
				<button title="Remove admin" on:click={removeAdmin}>
					<i class="fa-solid fa-user-minus"></i>
				</button>
			{:else}
				<button title="Give admin" on:click={giveAdmin}>
					<i class="fa-solid fa-user-shield"></i>
				</button>
			{/if}
		{/if}

		<button title="Clear drawings" on:click={clear}>
			<i class="fa-solid fa-brush"></i>
		</button>
	</div>
</div>

<style lang="scss">
	.user {
		border-radius: var(--radius-inner);
		background: var(--controls);
		display: flex;
		align-items: center;
		padding-left: 15px;
		gap: 5px;
		overflow: hidden;
		&__name {
			font-weight: 700;
			color: var(--text);
			display: flex;
			align-items: center;
			gap: 5px;
		}
		&__address,
		&__reason {
			color: var(--text-alt);
			font-weight: 400;
			font-size: 12px;
		}
		&__actions {
			margin-left: auto;
			display: flex;
			button {
				border-radius: 0;
				border: 0;
				&:hover {
					background: var(--buttons-hover);
				}
			}
		}
		&--admin {
			.user__name {
				color: var(--red);
			}
		}
		&--banned {
			.user__name {
				strong {
					text-decoration: line-through;
				}
			}
		}
	}
</style>
