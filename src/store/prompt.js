import { writable, derived } from "svelte/store";

function createPromptStore() {
	const { update, set, subscribe } = writable({
		text: "",
		placeholder: "",
		cancel: false,
		input: true,
		buttonText: "OK",
		prefilled: "",
		fn: (value) => {
			return false;
		},

		active: false,
	});

	function show(props) {
		const {
			text,
			placeholder,
			cancel,
			input = true,
			buttonText,
			prefilled,
			fn = () => {},
		} = props;

		update((state) => {
			state = {
				text,
				placeholder,
				cancel,
				input,
				buttonText,
				prefilled,
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
					input: true,
					buttonText: "OK",
					prefilled: "",
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
