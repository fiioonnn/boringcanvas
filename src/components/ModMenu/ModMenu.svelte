<script>
	import { tools } from "#store/stores";

	let active = "godmode";

	function sizeChanger() {
		setInterval(() => {
			$tools.size = Math.random() * 100;
		}, 100);
	}
</script>

<div class="modmenu">
	<h1>Revolution <span>by Enstone</span></h1>
	<h3>Main Menu</h3>
	<ul>
		<li>Godmode</li>
		<li>Infinite Ammo</li>
		<li
			on:click={() => {
				$tools.size = 400;
			}}
		>
			Bigger size
		</li>
		<li
			on:click={() => {
				$tools.size = 0.1;
			}}
		>
			Smaller size
		</li>
		<li
			on:click={() => {
				$tools.color = "red";
			}}
		>
			Fancy color
		</li>
		<li on:click={sizeChanger}>Size Changer</li>
	</ul>
</div>

<style lang="scss">
	.modmenu {
		position: fixed;
		right: 100px;
		bottom: 0px;
		width: 350px;
		border-left: 3px solid var(--green);
		border-right: 3px solid var(--green);
		height: 100vh;
		background: rgba(#000, 0.4);
		h3 {
			text-align: center;
			margin-bottom: 20px;
			font-size: 25px;
		}
		h1 {
			padding: 10px;
			text-align: center;
			margin-bottom: 10px;
			// blue text shadow
			text-shadow: 0 0 5px var(--blue);
			span {
				display: block;
				font-size: 16px;
				color: yellow;
			}
		}
		ul {
			padding: 0;
			gap: 0;
			li {
				font-size: 23px;
				font-weight: 650;
				color: #fff;
				text-shadow: 0 0 5px #000;
				padding-left: 20px;
				line-height: 1.7;

				&::before {
					display: none;
				}

				&:hover {
					background: var(--green);
				}
			}
		}
	}
</style>
