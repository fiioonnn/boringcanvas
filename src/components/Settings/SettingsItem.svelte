<script>
	import SettingsToggle from "./SettingsToggle.svelte";

	export let text;
	export let value = null;
	export let type = "button";
	export let fn = () => {};
</script>

<button class="setting-item {type}" on:click={fn}>
	<span class="setting-item__text">{text}</span>
	{#if type === "data"}
		<span class="setting-item__value">{value}</span>
	{:else if type === "toggle"}
		<SettingsToggle {value} />
	{:else if type === "toggle"}
		<SettingsToggle {value} />
	{/if}
</button>

<style lang="scss">
	.setting-item {
		&.data {
			cursor: default;
		}
		&.button {
			background: var(--buttons);
		}
		&.data,
		&.toggle {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		&.toggle,
		&.button {
			&:hover {
				cursor: pointer;
				border-color: var(--contour-hover);
			}
			&:active {
				border-color: var(--contour-active);
			}
		}
	}
</style>
