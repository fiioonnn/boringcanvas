<script>
	import { loader } from "#store/loader";
	import { fade } from "svelte/transition";
</script>

<div class="loader" transition:fade={{ duration: 100 }}>
	<div class="loader__logo">
		<img src="img/logo.svg" alt="" />
	</div>
	<p class="loader__text">{$loader.text}</p>
	<div class="loader__animation"></div>
	<p class="loader__info">
		This takes longer than usual, you can refresh the page or contact an admin
		if the problem persists.
	</p>
</div>

<style lang="scss">
	.loader {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--background);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 20px;
		z-index: 1000;
		&__animation {
			height: 5px;
			background: var(--foreground);
			border-radius: var(--radius);
			position: relative;
			overflow: hidden;
			width: 150px;
			&::before {
				content: "";
				position: absolute;
				top: 0;
				left: -100%;
				height: 100%;
				width: 100%;
				background: linear-gradient(90deg, #9f4ac8, #e0d043, #79e05f);
				border-radius: var(--radius);
				animation: loader 1s infinite linear;
			}
		}
		&__text {
			// font-size: 20px;
			// color: var(--text-alt);
			letter-spacing: 1px;
			font-weight: 500;
		}
		&__logo {
			max-width: 150px;
		}
		&__info {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 20px;
			background: var(--red);
			text-align: center;
			opacity: 0;
			animation: info 15s forwards;
		}
		@keyframes loader {
			to {
				left: 100%;
				width: 100%;
			}
		}
		@keyframes info {
			0% {
				opacity: 0;
			}
			95% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
	}
</style>
