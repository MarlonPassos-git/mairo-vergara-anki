import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			all: true,
			exclude: [
				"dist/**",
				"coverage/**",
				"node_modules/**",
				"**/*.config.ts",
				"**/*.e2e.spec.ts",
			],
			include: ["src/**/*.ts"],
			provider: "v8",
			reporter: ["text", "lcov", "json-summary"],
			thresholds: {
				branches: 70,
				functions: 80,
				lines: 80,
				statements: 80,
			},
		},
		environment: "node",
		globals: true,
		include: ["**/*.unit.spec.ts", "**/*.integration.spec.ts"],
	},
});
