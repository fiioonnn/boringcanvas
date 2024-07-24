<script>
	import SettingsItem from "#components/Settings/SettingsItem.svelte";
	import { app, username } from "#store/stores";
</script>

<div class="settings">
	<SettingsItem text="Username" type="data" value={$username} />
	<SettingsItem text="Version" type="data" value={$app.version} />
	<SettingsItem
		text="Debug"
		type="toggle"
		value={$app.debug}
		fn={() => ($app.debug = !$app.debug)}
	/>
	<SettingsItem
		text="Show serverinfo"
		type="toggle"
		value={$app.infobox}
		fn={() => ($app.infobox = !$app.infobox)}
	/>
	<SettingsItem text="Controls" fn={() => ($app.activeModal = "controls")} />
	<SettingsItem text="Rules" fn={() => ($app.activeModal = "rules")} />
	<SettingsItem text="Donate" fn={() => ($app.activeModal = "donate")} />
	<SettingsItem text="Report" fn={() => ($app.activeModal = "report")} />
	{#if $app.isAdmin}
		<SettingsItem
			text="Admin Panel"
			fn={() => ($app.activeModal = "admin-panel")}
		/>
	{/if}
</div>

<style lang="scss">
	.settings {
		display: flex;
		flex-direction: column;
		gap: 15px;
		user-select: none;
	}
</style>
