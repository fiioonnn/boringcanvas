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
			const newToast = { id: id(), type, title, message, timeout };
			startToastTimer(newToast);
			return [...state, newToast];
		});
	}

	function startToastTimer(toast) {
		if (toast.timeout > 0) {
			const timer = setTimeout(() => {
				toasts.update((state) => {
					return state.filter((t) => t.id !== toast.id);
				});
			}, toast.timeout);
			toast.timer = timer;
		}
	}

	function remove(id) {
		toasts.update((state) => {
			const toast = state.find((t) => t.id === id);
			if (toast) {
				clearTimeout(toast.timer);
			}
			return state.filter((toast) => toast.id !== id);
		});
	}

	return {
		subscribe: toasts.subscribe,
		create,
		remove,
	};
}

function id() {
	return "_" + Math.random().toString(36).substr(2, 9);
}

export const toasts = createToastsStore();
