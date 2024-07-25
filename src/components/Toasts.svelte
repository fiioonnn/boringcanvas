<script>
	import { flip } from "svelte/animate";
	import { fly } from "svelte/transition";
	import { toasts } from "#store/toasts.js";
</script>

<div class="toasts">
	{#each $toasts as toast (toast.id)}
		<div
			class="toast toast--{toast.type}"
			animate:flip={{ duration: 300 }}
			in:fly={{ x: 300, duration: 100 }}
			out:fly={{ x: 300, duration: 100 }}
			on:mousedown={() => toasts.remove(toast.id)}
			aria-hidden={true}
		>
			<div class="toast__icon"></div>
			<div class="toast__content">
				<p class="toast__title">{toast.title}</p>
				<p class="toast__message">
					{@html toast.message.replace(/\n/g, "<br>")}
				</p>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.toasts {
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 1100;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-end;
		gap: 10px;

		// pointer-events: none;
	}

	.toast {
		background: var(--foreground);
		box-shadow: var(--shadow);
		border-radius: var(--radius-inner);
		border: var(--contour);

		min-width: 300px;
		max-width: 600px;
		overflow: hidden;
		display: grid;
		grid-template-columns: 60px 1fr;
		gap: 10px;
		padding-right: 10px;
		z-index: 1200;
		&__icon {
			display: grid;
			place-content: center;
		}
		&__content {
			flex: 1 1 400px;
			padding: 10px;
		}
		&__title {
			font-weight: 700;
		}
		&__text {
		}
		&--info {
			.toast__icon {
				background: var(--blue) url("img/icons/info.svg") no-repeat center /
					20px 20px;
			}
		}
		&--tipp {
			.toast__icon {
				background: var(--blue) url("img/icons/bulb.svg") no-repeat center /
					20px 20px;
			}
		}
		&--success {
			.toast__icon {
				background: var(--green) url("img/icons/check.svg") no-repeat center /
					20px 20px;
			}
		}
		&--default {
			.toast__icon {
				background: var(--controls) url("img/icons/bell.svg") no-repeat center /
					20px 20px;
			}
		}
		&--error {
			.toast__icon {
				background: var(--red) url("img/icons/cross.svg") no-repeat center /
					20px 30px;
			}
		}
		&--warning {
			.toast__icon {
				background: var(--orange) url("img/icons/warn.svg") no-repeat center /
					20px 20px;
			}
		}
		&--broadcast {
			.toast__icon {
				background: var(--orange) url("img/icons/message.svg") no-repeat center /
					20px 20px;
			}
		}
		&--loading {
			gap: 0;
			.toast__content {
				padding-left: 0;
			}
			.toast__icon {
				position: relative;
				background: var(--foreground);
				&::before {
					content: "";
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 20px;
					height: 20px;
					border-radius: 50%;
					border: 2px solid var(--buttons);
					border-top-color: var(--text);
					animation: spin 1s linear infinite;
				}
			}
		}
	}
	@keyframes spin {
		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
</style>
