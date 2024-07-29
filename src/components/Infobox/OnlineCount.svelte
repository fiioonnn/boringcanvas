<script>
	export let count;
</script>

<div class="online-count">
	<div class="online-count__indicator"></div>
	<p>{count}</p>
</div>

<style lang="scss">
	.online-count {
		display: flex;
		align-items: center;
		gap: 10px;
		&__indicator {
			width: 10px;
			height: 10px;
			border-radius: 50%;
			background: var(--green);
			display: grid;
			&::before {
				transform-origin: center;
				content: "";
				width: inherit;
				height: inherit;
				border-radius: inherit;
				background: var(--green);
				animation: breathe 1.5s infinite cubic-bezier(0.19, 1, 0.22, 1);
			}
		}
	}
	@keyframes breathe {
		to {
			transform: scale(2);
			opacity: 0;
		}
	}
</style>
