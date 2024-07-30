<script>
	import { app } from "#store/stores";

	import { fly } from "svelte/transition";
	import ChatInput from "./ChatInput.svelte";
</script>

<div class="chat" transition:fly={{ duration: 100, y: 400 }}>
	<ul class="chat__messages">
		<li>Username: Hello world!</li>
		<li>Username2: Hello world!</li>
		<li>Username3: Hello world!</li>
		<li>Username: Hello world!</li>
		<li>Username: Hello world!</li>
	</ul>
	{#if $app.chatActive}
		<ChatInput />
	{/if}
</div>

<svelte:window />

<style lang="scss">
	.chat {
		pointer-events: none;
		position: fixed;
		bottom: 20px;
		left: 20px;
		width: 400px;
		max-height: 400px;
		opacity: 0.5;

		&__messages {
			padding-left: 0;
			mask-image: linear-gradient(
				to bottom,
				transparent 0%,
				black 50%,
				black 100%
			);
			li {
				border-radius: var(--radius-inner);
				&::before {
					display: none;
				}
			}
		}
		&__input {
			margin-top: 10px;
		}
	}
</style>
