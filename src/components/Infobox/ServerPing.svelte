<script>
	import IconSignal from "#components/Icons/IconSignal.svelte";
	import { app, socket } from "#store/stores";
	import { onMount } from "svelte";

	export let ping;

	let color;

	let interval;

	const [GREEN, ORANGE, RED, GREY] = [
		"#7ae854",
		"#e89254",
		"#e85454",
		"#404040",
	];
	onMount(() => {
		interval = setInterval(() => {
			const start = Date.now();

			$socket.emit("ping", (data) => {
				const duration = Date.now() - start;
				const { version, online, uptime } = data;

				//
				// Update the app store with the ping and online count
				//

				$app.ping = duration;
				$app.onlineCount = online;
				$app.serverUptime = uptime;
				$app.serverVersion = version;
			});
		}, 2000);

		return () => {
			clearInterval(interval);
			$socket.off("pong");
		};
	});

	$: {
		if (ping < 0) {
			color = GREY;
		} else if (ping < 50) {
			color = GREEN;
		} else if (ping < 100) {
			color = ORANGE;
		} else if (ping < 99999) {
			color = RED;
		} else {
			color = GREY;
		}
	}
</script>

<div class="server-ping">
	<IconSignal {color} />
	<p>{Math.min(ping, 1000)}ms</p>
</div>

<style>
	.server-ping {
		display: flex;
		align-items: center;
		gap: 10px;
	}
</style>
