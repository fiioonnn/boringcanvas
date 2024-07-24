<script>
	export let username;
	export let admin;
	export let banned;
	export let socketId;
	export let address;
	export let fn = (action, username) => {};

	const handleClick = (action) => {
		fn(action, username);
	};
</script>

<div class="user" class:banned class:admin>
	<div class="user__info">
		<p class="user__name">{username}</p>
		<p class="user__ip">{address}</p>
		{#if socketId}
			<p class="user__id">{socketId}</p>
		{/if}
	</div>
	<div class="user__options">
		{#if admin}
			<button on:click={() => handleClick("removeadmin")}
				>Remove as admin</button
			>
		{:else if banned === true}
			<button on:click={() => handleClick("unban")}>Unban</button>
		{:else}
			<button on:click={() => handleClick("ban")}>Ban</button>
			<button on:click={() => handleClick("kick")}>Kick</button>
			<button on:click={() => handleClick("admin")}>Give admin</button>
		{/if}
	</div>
</div>

<style lang="scss">
	.user {
		background: var(--controls);
		padding: 15px;
		border-radius: var(--radius-inner);
		display: grid;
		gap: 15px;
		&.banned {
			.user__name {
				color: var(--red);
				&::after {
					content: " (Banned)";
				}
			}
		}

		&.admin {
			.user__ip,
			.user__id {
				display: none;
			}

			.user__name {
				display: flex;
				align-items: center;
				gap: 5px;
				&::after {
					content: "";
					width: 20px;
					height: 20px;
					background: var(--red);
					mask: url("img/icons/admin.svg") no-repeat center / contain;
				}
			}
		}
		&__name {
			color: var(--text);
			font-weight: 700;
		}

		&__info {
			display: flex;
			align-items: center;
			gap: 5px;
		}
		&__ip,
		&__id {
			color: var(--text-alt);
			font-size: 14px;
			padding: 2px 5px;
			background: var(--background);
			border-radius: var(--radius-small);
		}
		&__ip {
			margin-left: auto;
			background: var(--blue);
			color: var(--text);
		}
		&__options {
			display: flex;
			gap: 15px;
			button {
				padding: 5px;
				background: #505050;
			}
		}
	}
</style>
