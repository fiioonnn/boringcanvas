<script>
	import IconSignal from "#components/Icons/IconSignal.svelte";

	export let ping;

	let color;

	const [GREEN, ORANGE, RED, GREY] = [
		"#7ae854",
		"#e89254",
		"#e85454",
		"#404040",
	];
	$: {
		if (ping < 50) {
			color = GREEN;
		} else if (ping < 100) {
			color = ORANGE;
		} else if (ping < 200) {
			color = RED;
		} else {
			color = GREY;
		}
	}
</script>

<div class="server-ping">
	<IconSignal {color} />
	<p>{ping}ms</p>
</div>

<style>
	.server-ping {
		display: flex;
		align-items: center;
		gap: 10px;
	}
</style>
