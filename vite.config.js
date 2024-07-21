import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
	resolve: {
		alias: [
			{
				find: "#components",
				replacement: path.resolve(__dirname, "./src/components"),
			},
			{
				find: "#store",
				replacement: path.resolve(__dirname, "./src/store"),
			},
		],
	},
});
