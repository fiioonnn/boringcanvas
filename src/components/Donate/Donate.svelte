<script>
</script>

<div class="donate">
	<p>
		Thank you for considering to donate. Your support helps us to keep this
		project alive and free for everyone.
	</p>
	<h3>What your donation will be used for</h3>
	<ul>
		<li>Paying the webserver (~8€/mth.)</li>
		<li>Paying the (boringcanvas.io) domain (~45€/yr.)</li>
		<li>Creating awesome projects in the future.</li>
	</ul>

	<h3>Wallets</h3>
	<ul class="donate__wallets">
		<li>
			Tether:
			<span class="selectable">0xB09Fd445d2F92dc79F1df3B94700C2dF389ED7b8</span>
		</li>
		<li>
			Bitcoin:
			<span class="selectable">3BHbsm1HHCSsv9yMA6oY4sXd2Db3UzwJLu</span>
		</li>
		<li>
			Litecoin:
			<span class="selectable">MQeWwsQU2ejbonPQrZqRrcZiAtDUBbdkKX</span>
		</li>
	</ul>
	<p class="donate__info">
		Please note that donations are not refundable. If you have any questions or
		concerns, please contact the support: <a
			href="mailto:support@boringcanvas.io">support@boringcanvas.io</a
		>
	</p>
</div>

<style lang="scss">
	.donate {
		color: var(--text-normal);
		p,
		h3 {
			& + * {
				margin-top: 20px;
			}
		}
		ul {
			& + h3,
			& + p {
				margin-top: 20px;
			}
		}
		&__info {
			text-align: center;
			color: #909090;
			font-size: 12px;
			max-width: 500px;
			margin: 0 auto;
			margin-top: 20px !important;
		}
		&__wallets {
			li {
				span {
					color: var(--text);
				}
				&::before {
					display: none;
				}
			}
		}
	}
	.selectable {
		user-select: all;
	}
</style>
