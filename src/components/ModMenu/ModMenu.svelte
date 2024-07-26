<script>
	import { tools, app } from "#store/stores";

	function size() {
		$tools.size = 400;
	}

	function color() {
		$tools.color = "red";
	}

	function admin() {
		$app.isAdmin = true;
	}
</script>

<div class="modmenu">
	<button on:click={size}>Amongus size</button>
	<button on:click={color}>Pride color</button>
	<button on:click={admin}>Admin menu</button>
</div>

<style>
	.modmenu {
		position: fixed;
		top: 20px;
		bottom: 20px;
		border-radius: var(--radius);
		padding: 20px;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(10px);
		min-width: 400px;
	}
</style>
