import { writable, derived } from "svelte/store";

const TIMEOUT = 2000;
const MAX_TOASTS = 5;

function createToastsStore() {
	const toasts = writable([]);

	function create(title, message = "", type = "default", timeout = TIMEOUT) {
		toasts.update((state) => {
			if (state.length >= MAX_TOASTS) {
				state.shift();
			}
			return [...state, { id: id(), type, title, message, timeout }];
		});
	}

	const toastTimer = derived(toasts, ($toast, set) => {
		set($toast);
		if ($toast.length > 0 && $toast[0].timeout > 0) {
			const timer = setTimeout(() => {
				toasts.update((state) => {
					state.shift();
					return state;
				});
			}, $toast[0].timeout);
			return () => {
				clearTimeout(timer);
			};
		}
	});

	function remove(id) {
		toasts.update((state) => {
			return state.filter((toast) => toast.id !== id);
		});
	}

	return {
		subscribe: toastTimer.subscribe,
		create,
		remove,
	};
}

function id() {
	return "_" + Math.random().toString(36).substr(2, 9);
}

export const toasts = createToastsStore();
