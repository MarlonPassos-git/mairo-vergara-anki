import assert from "node:assert/strict";
import { test } from "node:test";
import { readCliOptions } from "../scripts/Sync-AnkiTemplate.mjs";

test("readCliOptions returns sync defaults", () => {
	const options = readCliOptions([]);

	assert.deepEqual(options, {
		baseUrl: "http://127.0.0.1:8765",
		createIfMissing: false,
		template: "./templates/basic-editorial-v2",
	});
});

test("readCliOptions parses native Node argument forms", () => {
	const options = readCliOptions([
		"--template=./templates/custom-v1",
		"--base-url",
		"http://127.0.0.1:9999",
		"--create-if-missing",
	]);

	assert.deepEqual(options, {
		baseUrl: "http://127.0.0.1:9999",
		createIfMissing: true,
		template: "./templates/custom-v1",
	});
});

test("readCliOptions reports invalid sync arguments", () => {
	assert.throws(
		() => readCliOptions(["--template"]),
		/Invalid sync arguments '--template'. Expected --template <path>, --base-url <url>, and optional --create-if-missing./,
	);
});
