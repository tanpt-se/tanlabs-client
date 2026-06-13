import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

const reactApp = path.resolve(__dirname, "src/react-app");

export default defineConfig({
	plugins: [react(), tailwindcss(), cloudflare()],
	resolve: {
		alias: {
			"@": path.resolve(reactApp, "client"),
			"@/auth-config": path.resolve(reactApp, "client/auth-config.ts"),
			"@/auth-config.client": path.resolve(reactApp, "client/auth-config.client.ts"),
			"@tanlabs/assets": path.resolve(reactApp, "lib/assets/index.ts"),
			"@tanlabs/components/shared-login-form": path.resolve(
				reactApp,
				"lib/components/shared-login-form.tsx",
			),
			"@tanlabs/components": path.resolve(reactApp, "lib/components/index.ts"),
			"@tanlabs/config": path.resolve(reactApp, "lib/config/index.ts"),
			"@tanlabs/contracts": path.resolve(reactApp, "lib/contracts/index.ts"),
			"@tanlabs/platform/runtime-http": path.resolve(
				reactApp,
				"lib/platform/runtime/http-server.ts",
			),
			"@tanlabs/platform/runtime": path.resolve(
				reactApp,
				"lib/platform/runtime/server/index.ts",
			),
			"@tanlabs/platform": path.resolve(reactApp, "lib/platform/index.ts"),
			"@tanlabs/providers": path.resolve(reactApp, "lib/providers/index.ts"),
			"@tanlabs/types": path.resolve(reactApp, "lib/types/index.ts"),
			"@tanlabs/web-common/auth/auth-layout": path.resolve(
				reactApp,
				"lib/common/auth/auth-layout.tsx",
			),
			"@tanlabs/web-common/auth/forgot-password-form": path.resolve(
				reactApp,
				"lib/common/auth/forgot-password-form.tsx",
			),
			"@tanlabs/web-common/auth/password-recovery-errors": path.resolve(
				reactApp,
				"lib/common/auth/password-recovery-errors.ts",
			),
			"@tanlabs/web-common/auth/password-recovery.schema": path.resolve(
				reactApp,
				"lib/common/auth/password-recovery.schema.ts",
			),
			"@tanlabs/web-common/auth/public-auth-screens": path.resolve(
				reactApp,
				"lib/common/auth/public-auth-screens.ts",
			),
			"@tanlabs/web-common/auth/runtime-access": path.resolve(
				reactApp,
				"lib/common/auth/runtime-access.ts",
			),
			"@tanlabs/web-common/auth/social-auth": path.resolve(
				reactApp,
				"lib/common/auth/social-auth.ts",
			),
			"@tanlabs/web-common/i18n/locale-options": path.resolve(
				reactApp,
				"lib/common/i18n/locale-options.ts",
			),
			"@tanlabs/web-common/i18n/shell-base-en": path.resolve(
				reactApp,
				"lib/common/i18n/shell-base-en.ts",
			),
			"@tanlabs/web-common/auth/components/session-watchdog": path.resolve(
				reactApp,
				"lib/common/auth/components/session-watchdog.tsx",
			),
			"@tanlabs/web-common/auth/components/middleware-fallback": path.resolve(
				reactApp,
				"lib/common/auth/components/middleware-fallback.tsx",
			),
			"@tanlabs/web-common/auth/public-auth-runtime": path.resolve(
				reactApp,
				"lib/common/auth/public-auth-runtime.ts",
			),
			"@tanlabs/web-common/auth/public-auth-requests": path.resolve(
				reactApp,
				"lib/common/auth/public-auth-requests.ts",
			),
			"@tanlabs/web-common/auth/auth-app-config": path.resolve(
				reactApp,
				"lib/common/auth/auth-app-config.ts",
			),
			"@tanlabs/web-common/auth/use-forgot-password-form": path.resolve(
				reactApp,
				"lib/common/auth/use-forgot-password-form.ts",
			),
		},
	},
	server: {
		port: 5101,
	},
});
