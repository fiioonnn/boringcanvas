<div class="crosshair"></div>

<style lang="scss">
	.crosshair {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 20px;
		height: 20px;
		pointer-events: none;
		filter: drop-shadow(0 0 1px #000);

		&::before,
		&::after {
			content: "";
			width: 1px;
			height: 100%;
			background: #fff;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		&::after {
			width: 100%;
			height: 1px;
		}
	}
</style>
