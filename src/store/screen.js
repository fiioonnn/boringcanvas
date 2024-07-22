import { writable } from "svelte/store";

function createLoaderStore() {
	const { update, set, subscribe } = writable({
		active: false,
		title: "",
		text: "",
		keys: [],
	});

	function show(props) {
		const { title, text, keys } = props;

		update((state) => {
			state = { active: true, title, text, keys };
			return state;
		});
	}

	function hide() {
		update((state) => {
			state.active = false;
			state.title = "";
			state.text = "";
			state.keys = [];
			return state;
		});
	}

	return {
		show,
		hide,
		update,
		set,
		subscribe,
	};
}

export const screen = createLoaderStore();
