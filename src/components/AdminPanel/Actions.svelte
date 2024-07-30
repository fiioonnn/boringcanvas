<script>
	import { prompt } from "#store/prompt";
	import { socket, app, username, settings } from "#store/stores";
	import { toasts } from "#store/toasts";

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

	function clearArea() {
		$app.activeModal = "";
		prompt.show({
			text: "Enter the location",
			placeholder: "e.g. 960:480 100x100",
			cancel: true,
			fn: (message) => {
				$socket.emit("command", `/cleararea ${message}`);
			},
		});
	}

	function logout() {
		$socket.emit("command", "/logout");
	}

	function teleport() {
		$app.activeModal = "";
		prompt.show({
			text: "Enter the location",
			placeholder: "e.g. 960:480",
			cancel: true,
			fn: (message) => {
				$socket.emit("command", `/tp ${message}`);
			},
		});
	}

	function saveCanvas() {
		run("canvas save");
	}

	function loadCanvas() {
		run("canvas load");
	}

	function loadCanvasByIndex() {
		$app.activeModal = "";
		prompt.show({
			text: "Enter the index",
			placeholder: "e.g. 0",
			cancel: true,
			fn: (message) => {
				$socket.emit("command", `/canvas load ${message}`);
			},
		});
	}

	function startVote() {
		run("vote start");
	}

	function cancelVote() {
		run("vote cancel");
	}

	function voteCustom() {
		$app.activeModal = "";
		prompt.show({
			text: "Enter the needed vote amount",
			placeholder: "e.g. 10",
			cancel: true,
			fn: (message) => {
				run(`vote start ${message}`);
			},
		});
	}
</script>

<div class="actions">
	<button on:click={() => run("clear")}>Clear the canvas</button>
	<button on:click={clearArea}>Clear an area</button>
	<button on:click={broadcast}>Broadcast</button>
	<button on:click={logout}>Logout</button>
	<button on:click={teleport}>Teleport</button>
	<button on:click={saveCanvas}>Create backup</button>
	<button on:click={loadCanvas}>Load backup</button>
	<button on:click={loadCanvasByIndex}>Load backup (by index)</button>
	<button on:click={startVote}>Start vote (online users)</button>
	<button on:click={voteCustom}>Start vote (custom)</button>
	<button on:click={cancelVote}>Cancel vote (clearing)</button>
</div>

<style lang="scss">
	.actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 15px;
	}
</style>
