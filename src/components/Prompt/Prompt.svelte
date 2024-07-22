<script>
	import { slide } from "svelte/transition";
	import { prompt } from "#store/prompt";

	export let value = "";
	let input;
	let error;

	function handleSubmit() {
		if (!value) return input.classList.add("error");

		let err = $prompt.fn(value);

		if (err) {
			error = err;
		} else {
			prompt.hide();
		}
	}
</script>

<div class="prompt">
	{#if $prompt.text}
		<p class="prompt__text">{$prompt.text}</p>
	{/if}
	{#if error}
		<p class="prompt__error" transition:slide={{ duration: 300 }}>{error}</p>
	{/if}
	<form on:submit|preventDefault={handleSubmit}>
		<input
			type="text"
			bind:value
			bind:this={input}
			placeholder={$prompt.placeholder}
		/>
	</form>
	<div class="prompt__buttons">
		<button on:click={handleSubmit}>{$prompt.buttonText || "OK"}</button>
		{#if $prompt.cancel}
			<button on:click={() => prompt.hide()}>Cancel</button>
		{/if}
	</div>
</div>

<style lang="scss">
	.prompt {
		display: grid;
		gap: 15px;
		input {
			text-align: center;
		}
		&__text {
			font-weight: 700;
			color: var(--text) !important;
			text-align: center;
			user-select: none;
		}
		&__error {
			border-radius: var(--radius-inner);
			padding: 10px;
			color: var(--text);
			font-size: 14px;
			background: var(--red) !important;
			text-align: center;
		}
		&__buttons {
			display: flex;
			gap: 15px;
		}
		p {
			color: var(--text-normal);
		}
	}
</style>
