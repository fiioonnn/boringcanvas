<div class="mobile-warning">
	<img src="img/logo.svg" alt="" />
	<div class="mobile-warning__text">
		<h1>Unsupported device</h1>
		<p class="mobile-warning__info">
			Sorry, for now this app is only available on desktop (<strong
				>min. 768px</strong
			>)
		</p>
		<p>We are working on a mobile version, stay tuned!</p>
		<p><a href="mailto:support@boringcanvas.io">support@boringcanvas.io</a></p>
	</div>
</div>

<style lang="scss">
	.mobile-warning {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--background);
		display: grid;
		place-content: center;
		z-index: 99999;
		padding: 20px;
		&__info {
		}

		&__text {
			text-align: center;
			display: grid;
			gap: 10px;
			strong {
				color: var(--red);
			}
		}
		img {
			margin: 0 auto;
			margin-bottom: 20px;
		}
	}
</style>
