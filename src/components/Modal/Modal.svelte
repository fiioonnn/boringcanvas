<script>
	import { scale, fade } from "svelte/transition";
	import { app } from "#store/stores";

	export let width = 400;
	export let title = "";
	export let button = true;
	export let buttonTo = null;
	export let buttonFn = () => {};

	function handleClick(event) {
		buttonFn();

		if (buttonTo === "") {
			$app.activeModal = "";
			return;
		} else if (buttonTo) {
			$app.activeModal = buttonTo;
			return;
		}
		$app.activeModal === "settings"
			? ($app.activeModal = "")
			: ($app.activeModal = "settings");
	}
</script>

<div
	class="modal"
	style="--width: {width}px;"
	transition:fade={{ duration: 100 }}
>
	<div
		class="modal__inner"
		transition:scale={{ duration: 300, opacity: 0, start: 0.75 }}
	>
		{#if title}
			<h2 class="modal__title">{title}</h2>
		{/if}
		<div class="modal__content">
			<slot />
		</div>
		{#if button}
			<button class="close" on:click={handleClick}>Close</button>
		{/if}
	</div>
</div>

<style lang="scss">
	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		backdrop-filter: blur(2px);
		z-index: 1000;
		border: var(--contour);
		box-shadow: var(--shadow);
		display: grid;
		place-items: center;
		padding: 20px;
		user-select: none;
		&__inner {
			background: var(--foreground);
			padding: 15px;
			border-radius: var(--radius);
			width: 100%;
			max-width: var(--width, 300px);
			border: var(--contour);
		}
		&__content {
			max-height: 600px;
			overflow-y: scroll;
			-ms-overflow-style: none;
			scrollbar-width: none;
			&::-webkit-scrollbar {
				display: none;
			}
		}
		&__title {
			margin-bottom: 10px;
		}
		button.close {
			margin-top: 15px;
		}
	}
</style>
