<script>
	export let username;
	export let admin;
	export let banned;
	export let socketId;
	export let address;
</script>

<div class="user" class:banned>
	<p class="user__name">{username}</p>
</div>

<style lang="scss">
	.user {
		background: var(--controls);
		padding: 15px;
		border-radius: var(--radius-inner);
		&__name {
			color: var(--text);
			font-weight: 700;
		}
		&__buttons {
		}
		&__info {
		}
		&__details {
		}
	}
</style>
