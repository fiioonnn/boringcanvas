import { writable, derived } from "svelte/store";

function createLoaderStore() {
	const { update, set, subscribe } = writable({
		active: false,
		text: "Loading.. Please wait.",
	});

	function show(props) {
		const { text } = props;

		update((state) => {
			state = { active: true, text };
			return state;
		});
	}

	function change(text) {
		update((state) => {
			state.text = text;
			return state;
		});
	}

	function hide() {
		update((state) => {
			state.active = false;
			return state;
		});
	}

	return {
		show,
		hide,
		update,
		set,
		subscribe,
		change,
	};
}

export const loader = createLoaderStore();
