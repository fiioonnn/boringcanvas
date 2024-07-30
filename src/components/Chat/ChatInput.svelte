<script>
	import { onMount } from "svelte";
	import { socket } from "#store/stores";

	let input;

	onMount(() => {
		input.focus();

		return () => {};
	});

	function handleKeyDown(event) {
		if (event.key === "Enter") {
			console.log(input.value);

			$socket.emit("message", input.value);
		}
	}
</script>

<div class="input-container">
	<i class="fa-solid fa-paper-plane"></i>
	<input
		type="text"
		placeholder="Enter your message.."
		bind:this={input}
		on:keydown={handleKeyDown}
	/>
</div>

<style>
	.input-container {
		display: flex;
		align-items: center;
		gap: 10px;
		border-bottom: 1px solid #fff;
		pointer-events: all;
	}
	input {
		border: 0;
		border-radius: 0;
		background: transparent;
		padding: 10px 0;
		font-weight: 400;
	}
</style>
