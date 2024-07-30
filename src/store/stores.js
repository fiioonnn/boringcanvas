import { writable } from "svelte/store";

// Tools
const storedTools = JSON.parse(localStorage.getItem("tools")) || {
	color: "#ffffff",
	size: 1,
	eraser: false,
};
export const tools = writable(storedTools);
tools.subscribe((value) => {
	localStorage.setItem("tools", JSON.stringify(value));
});

// Tools - end

export const config = writable({
	colors: ["#FFFFFF", "#BFBFBF", "#808080", "#505050", "#000000"],
	sizes: [2, 5, 7, 10, 14],
	canvas: {
		size: [6000, 6000],
		background: "#202020",
		logo: "img/logo.svg",
	},
	controls: [],
	rules: {
		list: [],
	},
});

export const app = writable({
	version: "1.0.0",
	ctx: null,
	keys: {},
	activeModal: "",

	isAdmin: false,
	ping: 0,
	onlineCount: 0,
	serverURL: "https://s1.boringcanvas.io",
	// serverURL: "http://localhost:4000",
	serverUptime: 0,
	serverVersion: "0.0.0",
	isMobile: false,
	connected: false,
	// Canvas
	canvasZoom: 1,
	canvasLocation: [0, 0],
	vote: {},
});

// Username
const storedUsername = localStorage.getItem("username") || "";
export const username = writable(storedUsername);
username.subscribe((value) => {
	localStorage.setItem("username", value);
});

// Note
const storedNote = localStorage.getItem("note") === "true";
export const note = writable(storedNote);
note.subscribe((value) => {
	localStorage.setItem("note", value.toString());
});

// Socket
export const socket = writable(null);

// Settings
const storedSettings = JSON.parse(localStorage.getItem("settings")) || {
	showCursors: true,
	showDebug: false,
	showMinimap: false,
	showInfobox: true,
	showCrosshair: false,
};
export const settings = writable(storedSettings);
settings.subscribe((value) => {
	localStorage.setItem("settings", JSON.stringify(value));
});
