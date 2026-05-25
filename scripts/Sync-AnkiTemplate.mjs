import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { invokeAnkiConnect } from "./Invoke-AnkiConnect.mjs";

const repoRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);

/**
 * Syncs one local Anki template folder to AnkiConnect.
 *
 * Example:
 * ```powershell
 * node ./scripts/Sync-AnkiTemplate.mjs --template ./templates/basic-editorial-v2 --create-if-missing
 * ```
 */
async function main() {
	const options = readCliOptions(process.argv.slice(2));
	const template = await readTemplateFiles(options.template);
	await assertAnkiConnectVersion(options.baseUrl);
	await syncTemplate(template, options);
}

export function readCliOptions(args) {
	const defaults = {
		baseUrl: "http://127.0.0.1:8765",
		createIfMissing: false,
		template: "./templates/basic-editorial-v2",
	};
	const values = parseCliArgs(args);

	return {
		baseUrl: values["base-url"] ?? defaults.baseUrl,
		createIfMissing: values["create-if-missing"] ?? defaults.createIfMissing,
		template: values.template ?? defaults.template,
	};
}

function parseCliArgs(args) {
	try {
		return parseArgs({
			allowPositionals: false,
			args,
			options: {
				"base-url": { type: "string" },
				"create-if-missing": { type: "boolean" },
				template: { type: "string" },
			},
			strict: true,
		}).values;
	} catch (error) {
		throw new Error(
			`Invalid sync arguments '${args.join(" ")}'. Expected --template <path>, --base-url <url>, and optional --create-if-missing. Cause: ${error.message}`,
		);
	}
}

async function readTemplateFiles(templatePath) {
	const templateRoot = path.resolve(repoRoot, templatePath);
	const model = await readJsonFile(path.join(templateRoot, "anki.model.json"));
	const front = await readTextFile(templateRoot, model.files.front);
	const back = await readTextFile(templateRoot, model.files.back);
	const css = await readTextFile(templateRoot, model.files.css);

	return { back, css, front, model };
}

async function readJsonFile(filePath) {
	const text = await readFile(filePath, "utf8");
	return JSON.parse(text);
}

async function readTextFile(templateRoot, relativePath) {
	const filePath = path.join(templateRoot, relativePath);

	try {
		return await readFile(filePath, "utf8");
	} catch (error) {
		throw new Error(
			`Missing template file '${filePath}'. Expected front, back, and css files declared in anki.model.json. Cause: ${error.message}`,
		);
	}
}

async function assertAnkiConnectVersion(baseUrl) {
	const version = await invokeAnkiConnect({ action: "version", baseUrl });

	if (version < 6) {
		throw new Error(
			`AnkiConnect version '${version}' is unsupported. Expected version 6 or newer.`,
		);
	}
}

async function syncTemplate(template, options) {
	const modelNames = await invokeAnkiConnect({
		action: "modelNames",
		baseUrl: options.baseUrl,
	});

	if (!modelNames.includes(template.model.modelName)) {
		await createModel(template, options);
		return;
	}

	await createMissingFields(template, options.baseUrl);
	await updateModelTemplate(template, options.baseUrl);
	console.log("Template sincronizado com sucesso:");
	console.log(`  Modelo: ${template.model.modelName}`);
	console.log(`  Card:   ${template.model.cardTemplateName}`);
}

async function createModel(template, options) {
	if (!options.createIfMissing) {
		throw new Error(
			`Missing note type '${template.model.modelName}'. Expected an existing Anki note type or --create-if-missing.`,
		);
	}

	await invokeAnkiConnect({
		action: "createModel",
		baseUrl: options.baseUrl,
		params: {
			cardTemplates: [
				{
					Back: template.back,
					Front: template.front,
					Name: template.model.cardTemplateName,
				},
			],
			css: template.css,
			inOrderFields: template.model.fields,
			isCloze: false,
			modelName: template.model.modelName,
		},
	});

	console.log(`Modelo criado no Anki: ${template.model.modelName}`);
}

async function createMissingFields(template, baseUrl) {
	const fieldNames = await invokeAnkiConnect({
		action: "modelFieldNames",
		baseUrl,
		params: { modelName: template.model.modelName },
	});

	for (const fieldName of template.model.fields) {
		if (fieldNames.includes(fieldName)) continue;
		await invokeAnkiConnect({
			action: "modelFieldAdd",
			baseUrl,
			params: { fieldName, modelName: template.model.modelName },
		});
		console.log(
			`Campo criado no modelo '${template.model.modelName}': ${fieldName}`,
		);
	}
}

async function updateModelTemplate(template, baseUrl) {
	await invokeAnkiConnect({
		action: "updateModelTemplates",
		baseUrl,
		params: {
			model: {
				name: template.model.modelName,
				templates: {
					[template.model.cardTemplateName]: {
						Back: template.back,
						Front: template.front,
					},
				},
			},
		},
	});

	await invokeAnkiConnect({
		action: "updateModelStyling",
		baseUrl,
		params: {
			model: {
				css: template.css,
				name: template.model.modelName,
			},
		},
	});
}

function isExecutedScript(moduleUrl, scriptPath) {
	if (!scriptPath) return false;
	return moduleUrl === pathToFileURL(scriptPath).href;
}

if (isExecutedScript(import.meta.url, process.argv[1])) {
	await main();
}
