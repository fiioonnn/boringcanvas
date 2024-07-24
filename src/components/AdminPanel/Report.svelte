<script>
	import { slide } from "svelte/transition";
	import { socket } from "#store/stores";

	export let id = -1;
	export let type;
	export let username;
	export let position;
	export let message;
	export let author_address;
	export let author;
	export let closed;
	export let created_at;
	export let fnClose = (id) => {};
	export let fnDelete = (id) => {};

	let isOpen = false;

	created_at = new Date(created_at).toLocaleString("en-GB", {
		day: "numeric",
		month: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
	});
</script>

<div
	class="report"
	class:report--closed={closed}
	on:click|self={() => (isOpen = !isOpen)}
	aria-hidden="true"
	class:report--open={isOpen}
>
	<div class="report__head">
		<p class="report__title">
			{#if type === "player"}
				<span class="report__author">{author}</span> reported
				<span class="report__target">{username}</span>
			{:else if type === "drawing"}
				<span class="report__author">{author}</span> reported a drawing at
				<span class="report__target">{position}</span>
			{:else}
				<span class="report__author">{author}</span> reported a
				<span class="report__target">{type}</span>
			{/if}
			{(closed && " (Closed)") || ""}
		</p>
		<div class="report__time">{created_at}</div>
	</div>
	{#if isOpen}
		<div class="report__body" transition:slide={{ duration: 300 }}>
			<p class="report__message"><span>Message:</span>{message}</p>
			<div class="report__actions">
				<button on:click={() => (closed = true) && fnClose(id)}>Close</button>
				<button on:click={() => fnDelete(id)}>Delete</button>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.report {
		border: var(--contour);
		padding: 15px;
		border-radius: var(--radius-inner);
		background: var(--controls);
		display: grid;
		gap: 0;
		transition: var(--transition-base);

		&__target {
			font-weight: 700;
			color: var(--orange);
		}
		&__head {
			display: flex;
			justify-content: space-between;
			gap: 15px;
			align-items: center;
			pointer-events: none;
		}

		&__author {
			font-weight: 700;
			color: var(--text);
		}

		&__time {
			display: flex;
			align-items: center;
			gap: 5px;
			font-size: 14px;
			color: var(--text-alt);
			&::before {
				content: "";
				width: 15px;
				height: 15px;
				background: url("img/icons/clock.svg") no-repeat center / contain;
				opacity: 0.5;
			}
		}
		&__message {
			span {
				display: block;
				color: var(--text-alt);
				font-size: 14px;
			}
		}
		&__actions {
			display: flex;
			gap: 15px;
			button {
				border: 0;
				padding: 0;
				&:hover {
					opacity: 0.5;
				}
			}
		}
		&__body {
			display: grid;
			gap: 15px;
		}
		&--open {
			gap: 15px;
		}
		&--closed {
			opacity: 0.4;
		}
	}
</style>
