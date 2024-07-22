import { writable, derived } from "svelte/store";

function createPromptStore() {
	const { update, set, subscribe } = writable({
		text: "",
		placeholder: "",
		cancel: false,
		buttonText: "OK",
		fn: (value) => {
			return false;
		},

		active: false,
	});

	function show(props) {
		const { text, placeholder, cancel, buttonText, fn = () => {} } = props;

		update((state) => {
			state = {
				text,
				placeholder,
				cancel,
				buttonText,
				fn,

				active: true,
			};
			return state;
		});
	}

	const hide = () => {
		update((state) => ({ ...state, active: false }));
		setTimeout(() => {
			update((state) => {
				state = {
					text: "",
					placeholder: "",
					cancel: false,
					buttonText: "OK",
					fn: (value) => {
						return false;
					},

					active: false,
				};
				return state;
			});
		}, 300);
	};

	return {
		show,
		update,
		set,
		subscribe,
		hide,
	};
}

export const prompt = createPromptStore();
