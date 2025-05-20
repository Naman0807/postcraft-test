import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	server: {
		port: 8080,
		proxy: {
			"/v1": {
				target: "https://api.openai.com/v1",
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/v1/, ""),
			},
		},
	},
});
