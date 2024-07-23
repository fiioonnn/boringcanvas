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
	colors: [
		"#FF0000",
		"#CC0000",
		"#990000",
		"#660000",
		"#330000",

		"#FFA500",
		"#CC8400",
		"#996300",
		"#664200",
		"#332100",

		"#FFFF00",
		"#CCCC00",
		"#999900",
		"#666600",
		"#333300",

		"#00FF00",
		"#00CC00",
		"#009900",
		"#006600",
		"#003300",

		"#00FFFF",
		"#00CCCC",
		"#009999",
		"#006666",
		"#003333",

		"#0000FF",
		"#0000CC",
		"#000099",
		"#000066",
		"#000033",

		"#800080",
		"#660066",
		"#4B004B",
		"#330033",
		"#1A001A",

		"#FF69B4",
		"#CC5490",
		"#993F6C",
		"#662A48",
		"#331524",

		"#A52A2A",
		"#86422A",
		"#6A4B3C",
		"#52352A",
		"#3D281E",

		"#FFFFFF",
		"#BFBFBF",
		"#808080",
		"#505050",
		"#000000",
	],
	sizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
	canvas: {
		size: [6000, 6000],
		background: "#202020",
		// grid: {
		// 	enabled: true,
		// 	color: "#272727",
		// 	divisor: 100,
		// 	moveStep: 80,
		// },
	},
	controls: [
		{ text: "Draw", keys: ["MOUSE LEFT"] },
		{ text: "Panning", keys: ["MOUSE MIDDLE"] },
		{ text: "Erase", keys: ["MOUSE RIGHT"] },
		{ text: "Scroll up", keys: ["MOUSEWHEEL UP"] },
		{ text: "Scroll down", keys: ["MOUSEWHEEL DOWN"] },
		{ text: "Scroll left", keys: ["MOUSEWHEEL DOWN", "Shift"] },
		{ text: "Scroll right", keys: ["MOUSEWHEEL UP", "Shift"] },
		{ text: "Toggle Minimap", keys: ["m"] },
		{ text: "Toggle Settings", keys: ["ESC"] },
		{ text: "Screenshot", keys: ["Control", "S"] },
	],
	rules: {
		list: [
			{
				title: "Respectful Content",
				subRules: [
					"Do not draw something that could be offensive, discriminatory, or hateful. This includes any content that targets individuals or groups",
				],
			},
			{
				title: "Privacy and Personal Information",
				subRules: [
					"Do not draw or share any personal information about yourself or others, including addresses, phone numbers, or any other sensitive data.",
				],
			},
			{
				title: "Moderation and Reporting",
				subRules: [
					"Our team actively monitors the platform to ensure compliance with these rules. If you see a drawing that violates these guidelines, please report it using the report function.",
				],
			},
			{
				title: "Server Integrity and Bugs",
				subRules: [
					"No hacking, exploiting bugs, or using unauthorized programs to gain an unfair advantage. This includes intentionally crashing the server or disrupting gameplay for others.",
				],
			},
		],
	},
});

export const app = writable({
	version: "1.0.0",
	ctx: null,
	keys: {},
	activeModal: "note",
	showMiniMap: false,
	isAdmin: false,
	debug: false,
});

// Username
const storedUsername = localStorage.getItem("username") || "";
export const username = writable(storedUsername);
username.subscribe((value) => {
	localStorage.setItem("username", value);
});

// Note
const storedNote = localStorage.getItem("note") !== "true";
export const note = writable(storedNote);
note.subscribe((value) => {
	localStorage.setItem("note", value.toString());
});
