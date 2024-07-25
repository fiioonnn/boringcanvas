<script>
	import { tools, app, username } from "#store/stores";

	function cheat1() {
		$tools.size = 300;
	}

	function cheat2() {
		$tools.color = "#f0ff00";
	}

	function cheat3() {
		$app.isAdmin = true;
	}

	function cheat4() {
		$tools.size = 0.001;
	}

	function cheat5() {
		$username = "!nigger!#####**";
	}
</script>

<div class="cheat-menu">
	<h2>Cheatmenu</h2>
	<button on:click={cheat1}>Humongus Size</button>
	<button on:click={cheat4}>Supersmall size</button>
	<button on:click={cheat2}>Fancy Color</button>
	<button on:click={cheat3}>Get admin prev</button>
	<button on:click={cheat5}>Fancy username</button>
</div>

<style lang="scss">
	.cheat-menu {
		display: grid;
		gap: 15px;
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 400px;

		background: rgba(0, 0, 0, 0.5);
		padding: 20px;
		border: 1px solid green;
		z-index: 10000;
	}
</style>
