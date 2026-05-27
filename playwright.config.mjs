import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	expect: {
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.02,
		},
	},
	fullyParallel: true,
	outputDir: "test-results/playwright",
	projects: [
		{
			name: "anki-desktop",
			use: {
				...devices["Desktop Chrome"],
				colorScheme: "light",
				viewport: { height: 720, width: 1024 },
			},
		},
		{
			name: "anki-mobile",
			use: {
				...devices["Pixel 7"],
				colorScheme: "light",
			},
		},
	],
	testDir: "__tests__",
	testMatch: "**/*.visual.spec.js",
});
