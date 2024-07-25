<script>
	import { prompt } from "#store/prompt";
	import { socket, app } from "#store/stores";

	function run(command) {
		$socket.emit("command", `/${command}`);
	}

	function broadcast() {
		$app.activeModal = "";
		prompt.show({
			text: "Broadcasted message",
			placeholder: "Enter you message..",
			cancel: true,
			fn: (message) => {
				$socket.emit("command", `/bc ${message}`);
			},
		});
	}
</script>

<div class="actions">
	<button on:click={() => run("clear")}>Clear canvas</button>
	<button on:click={broadcast}>Broadcast</button>
</div>

<style lang="scss">
	.actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 15px;
	}
</style>
