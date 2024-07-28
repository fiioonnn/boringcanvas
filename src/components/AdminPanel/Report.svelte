<script>
	import { socket } from "#store/stores";
	import { slide } from "svelte/transition";
	export let report = {};

	let active = false;

	function run(command) {
		$socket.emit("command", `/${command} ${report.id}`);
	}

	function deleteReport() {
		run("deletereport");
	}

	function closeReport() {
		run("closereport");
	}

	function reopenReport() {
		run("reopenreport");
	}
</script>

<div class="report" class:report--closed={report?.closed}>
	<div class="report__head">
		{#if report?.username}
			<p class="report__text">
				<span>{report?.author}</span> reported <span>{report?.username}</span>
			</p>
		{:else if report?.position}
			<p class="report__text">
				<span>{report?.author}</span> reported a position (<span>
					{report?.position}</span
				>)
			</p>
		{:else}
			<p class="report__text">
				<span>{report?.author}</span> reported a bug
			</p>
		{/if}
		<div class="report__actions">
			{#if active}
				<button title="Show details" on:click={() => (active = !active)}>
					<i class="fa-solid fa-eye-slash"></i>
				</button>
			{:else}
				<button title="Hide details" on:click={() => (active = !active)}>
					<i class="fa-solid fa-eye"></i>
				</button>
			{/if}
			{#if report?.closed}
				<button title="Reopen report" on:click={reopenReport}>
					<i class="fa-solid fa-rotate"></i>
				</button>
			{:else}
				<button title="Close report" on:click={closeReport}>
					<i class="fa-solid fa-circle-check"></i>
				</button>
			{/if}
			<button title="aaa" on:click={deleteReport}>
				<i class="fa-solid fa-trash"></i>
			</button>
		</div>
	</div>

	{#if active}
		<div class="report__body" transition:slide={{ duration: 300 }}>
			{report?.message}
		</div>
	{/if}
</div>

<style lang="scss">
	.report {
		border-radius: var(--radius-inner);
		background: var(--controls);
		padding-left: 15px;
		overflow: hidden;
		gap: 5px;
		&__text {
			span {
				user-select: all;
				font-weight: 700;
				&:first-child {
					color: var(--text);
				}
				&:last-child {
					color: var(--red);
				}
			}
		}
		&__head {
			display: flex;
			align-items: center;
		}
		&__body {
			padding-bottom: 15px;
			font-size: 14px;
			color: var(--text-alt);
		}
		&__actions {
			display: flex;
			margin-left: auto;
			button {
				border-radius: 0;
				border: 0;
				&:hover {
					background: var(--buttons-hover);
				}
			}
		}
		&--closed {
			opacity: 0.5;
		}
	}
</style>
