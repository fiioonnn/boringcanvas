<script>
	import { prompt } from "#store/prompt";
	import { socket, app } from "#store/stores";
	import { onMount } from "svelte";

	onMount(() => {
		return () => {};
	});

	function handleClick() {
		prompt.show({
			text: "You want to vote for clearing the canvas?",
			input: false,
			cancel: true,
			fn: () => {
				$socket.emit("command", "/vote");
			},
		});
	}
</script>

<p
	class="votes"
	title="Votes for clearing the canvas"
	on:click={handleClick}
	aria-hidden="true"
>
	<i class="fa-solid fa-brush"></i>
	{$app.vote.votes} / {$app.vote.needed}
</p>

<style>
	.votes {
		display: flex;
		align-items: center;
		gap: 10px;
		color: var(--blue);
		font-weight: 700;
		cursor: url("img/icons/cursor-pointer.svg"), auto;
	}
</style>
