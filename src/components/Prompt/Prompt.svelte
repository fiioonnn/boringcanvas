<script>
	import { prompt } from "#store/prompt";

	export let value = "";

	function handleClick() {
		$prompt.fn(value);
		prompt.hide();
	}
</script>

<div class="prompt">
	{#if $prompt.text}
		<p class="prompt__text">{$prompt.text}</p>
	{/if}
	<input type="text" bind:value placeholder={$prompt.placeholder} />
	<div class="prompt__buttons">
		<button on:click={handleClick}>{$prompt.buttonText || "OK"}</button>
		{#if $prompt.cancel}
			<button on:click={handleClick}>Cancel</button>
		{/if}
	</div>
</div>

<style lang="scss">
	.prompt {
		display: grid;
		gap: 15px;
		&__text {
			font-weight: 700;
			color: var(--text);
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
