import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/shared/infra/http/server.ts"],
	format: ["cjs"],
	dts: true,
	clean: true,
});
