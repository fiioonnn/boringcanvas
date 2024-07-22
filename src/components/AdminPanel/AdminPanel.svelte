<script>
	import { username } from "#store/stores.js";
	import { toasts } from "#store/toasts.js";

	function handleSubmit(event) {
		console.log("ok");
	}
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
</div>

<style lang="scss">
	.admin-panel {
		display: grid;
		gap: 15px;
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
