import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

const reactApp = path.resolve(__dirname, "src/react-app");

export default defineConfig({
	plugins: [cloudflare(), react(), tailwindcss()],
	resolve: {
		alias: {
			"@/auth-config": path.resolve(reactApp, "shared/auth-config.ts"),
			"@/auth-config.client": path.resolve(reactApp, "shared/auth-config.client.ts"),
			"@": reactApp,
			"@tanlabs/assets": path.resolve(reactApp, "lib/assets/index.ts"),
			"@tanlabs/astryx": path.resolve(reactApp, "lib/astryx/index.ts"),
			"@tanlabs/ui/login-card": path.resolve(reactApp, "ui/login-card/index.ts"),
			"@tanlabs/ui/settings": path.resolve(reactApp, "ui/settings/index.ts"),
			"@tanlabs/ui/shell-side-nav": path.resolve(reactApp, "ui/shell-side-nav/index.ts"),
			"@tanlabs/ui/shell-top-nav": path.resolve(reactApp, "ui/shell-top-nav/index.ts"),
			"@tanlabs/config": path.resolve(reactApp, "lib/config/index.ts"),
			"@tanlabs/contracts": path.resolve(reactApp, "lib/contracts/index.ts"),
			"@tanlabs/platform": path.resolve(reactApp, "lib/platform/index.ts"),
			"@tanlabs/providers": path.resolve(reactApp, "lib/providers/index.ts"),
			"@tanlabs/types": path.resolve(reactApp, "lib/types/index.ts"),
		},
	},
	server: {
		port: 5101,
	},
});
