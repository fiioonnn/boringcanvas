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
		size: [5000, 5000],
		background: "#202020",
		grid: {
			enabled: true,
			color: "#272727",
			divisor: 100,
			moveStep: 90,
		},
	},
});
