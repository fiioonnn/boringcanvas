<script>
	import SettingsToggle from "./SettingsToggle.svelte";

	export let text;
	export let value = null;
	export let type = "button";
	export let fn = () => {};
	export let disabled = false;
</script>

<button class="setting-item {type}" class:disabled on:click={fn}>
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
		&.disabled {
			pointer-events: none;
			opacity: 0.5;
		}
		&.data {
			cursor: default;
			color: var(--text-alt);
			.setting-item__value {
				font-weight: 600;
				color: var(--text);
			}
		}
		&.button {
			background: var(--buttons);
			border: var(--contour);
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
				cursor: url("img/icons/cursor-pointer.svg"), auto;
				border-color: var(--contour-hover);
			}
			&:active {
				border-color: var(--contour-active);
			}
		}
	}
</style>
