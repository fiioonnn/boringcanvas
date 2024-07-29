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
	<div class="settings__group">
		<SettingsItem text="Username" type="data" value={$username} />
		<SettingsItem text="Version" type="data" value={$app.version} />
	</div>
	<div class="settings__group">
		<SettingsItem
			text="Cursors"
			type="toggle"
			value={$settings.showCursors}
			fn={() => ($settings.showCursors = !$settings.showCursors)}
		/>
		<SettingsItem
			text="Infobox"
			type="toggle"
			value={$settings.showInfobox}
			fn={() => ($settings.showInfobox = !$settings.showInfobox)}
		/>
		<SettingsItem
			text="Debug"
			type="toggle"
			value={$settings.showDebug}
			fn={() => ($settings.showDebug = !$settings.showDebug)}
		/>
		<SettingsItem
			text="Minimap"
			type="toggle"
			value={$settings.ShowMinimap}
			fn={() => ($settings.ShowMinimap = !$settings.ShowMinimap)}
			disabled
		/>
		<SettingsItem
			text="Crosshair"
			type="toggle"
			value={$settings.showCrosshair}
			fn={() => ($settings.showCrosshair = !$settings.showCrosshair)}
		/>
	</div>
	<div class="settings__group settings__group--medium">
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
			grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
			gap: 15px;
			&--medium {
				grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			}
		}
	}
</style>
