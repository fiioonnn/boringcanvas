<script>
	import { app, socket } from "#store/stores.js";

	let selected = "bug";

	let inputs = {
		username: null,
		position: null,
		message: null,
	};

	function handleSubmit(event) {
		const formData = new FormData(event.target);

		if (selected === "player") {
			if (!formData.get("username")) {
				inputs.username.focus();
				inputs.username.classList.add("error");
				return;
			} else {
				inputs.username.classList.remove("error");
			}
		}

		if (selected === "drawing") {
			if (!formData.get("position")) {
				inputs.position.focus();
				inputs.position.classList.add("error");
				return;
			} else {
				inputs.position.classList.remove("error");
			}
		}

		if (!formData.get("message")) {
			inputs.message.focus();
			inputs.message.classList.add("error");
			return;
		} else {
			inputs.message.classList.remove("error");
		}

		$socket.emit("report", {
			type: selected,
			username: formData.get("username"),
			position: formData.get("position"),
			message: formData.get("message"),
		});

		$app.activeModal = null;
	}
</script>

<div class="report">
	<p>
		Please provide a brief description of the issue you are experiencing. This
		will help us to resolve the issue as quickly as possible.
	</p>
	{#if selected === "drawing"}
		<p>
			You can find the position by opening the minimap (press <kbd>m</kbd>)
			while being on the canvas. (You can click on the position on it to copy
			it)
		</p>
	{/if}
	<form on:submit|preventDefault={handleSubmit}>
		<div class="select">
			<select bind:value={selected}>
				<option value="bug">I want to report a bug</option>
				<option value="player">I want to report a player</option>
				<option value="drawing">I want to report a drawing</option>
			</select>
		</div>
		{#if selected === "player"}
			<input
				type="text"
				name="username"
				placeholder="Username.."
				maxlength="32"
				bind:this={inputs.username}
			/>
		{:else if selected === "drawing"}
			<input
				type="text"
				name="position"
				placeholder="0000:0000"
				style="text-align: center"
				bind:this={inputs.position}
			/>
		{/if}
		<textarea
			name="message"
			placeholder="Message.."
			maxlength="500"
			rows="5"
			bind:this={inputs.message}
		></textarea>
		<button>Submit</button>
	</form>
</div>

<style lang="scss">
	.report {
		display: grid;
		gap: 15px;
		form {
			display: grid;
			gap: 15px;
		}
		p,
		li {
			color: var(--text-normal);
		}
		&__group {
			display: flex;
			gap: 15px;
		}
	}
</style>
