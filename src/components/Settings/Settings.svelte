<script>
	import SettingsItem from "#components/Settings/SettingsItem.svelte";
	import { app, username, settings } from "#store/stores";
	import { prompt } from "#store/prompt";

	function resetEverything() {
		$app.activeModal = "";
		prompt.show({
			text: "Are you sure you want to delete all user settings?",
			cancel: true,
			input: false,
			fn: () => {
				localStorage.clear();
				window.location.reload();
			},
		});
	}
</script>

<div class="settings">
	<SettingsItem text="Username" type="data" value={$username} />
	<SettingsItem text="Version" type="data" value={$app.version} />
	<div class="settings__group">
		<SettingsItem
			text="Cursors"
			type="toggle"
			value={$settings.showCursors}
			fn={() => ($settings.showCursors = !$settings.showCursors)}
		/>
		<SettingsItem
			text="Serverinfo"
			type="toggle"
			value={$app.infobox}
			fn={() => ($app.infobox = !$app.infobox)}
		/>
		<SettingsItem
			text="Debug"
			type="toggle"
			value={$app.debug}
			fn={() => ($app.debug = !$app.debug)}
		/>
	</div>
	<div class="settings__group">
		<SettingsItem text="Controls" fn={() => ($app.activeModal = "controls")} />
		<SettingsItem text="Rules" fn={() => ($app.activeModal = "rules")} />
		<SettingsItem text="Donate" fn={() => ($app.activeModal = "donate")} />
		<SettingsItem text="Report" fn={() => ($app.activeModal = "report")} />
	</div>
	{#if $app.isAdmin}
		<SettingsItem
			text="Admin Panel"
			fn={() => ($app.activeModal = "admin-panel")}
		/>
	{/if}
	<SettingsItem text="Reset everything" fn={resetEverything} />
</div>

<style lang="scss">
	.settings {
		display: flex;
		flex-direction: column;
		gap: 15px;
		user-select: none;
		&__group {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: 15px;
		}
	}
</style>
