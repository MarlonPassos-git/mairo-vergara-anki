import { readFile } from "node:fs/promises";

const templateRoot = new URL("../templates/", import.meta.url);

/**
 * Renders one Anki card side as a standalone review webview document.
 *
 * @example
 * const html = await renderAnkiCardDocument("basic-editorial-v2", "front", fields);
 */
export async function renderAnkiCardDocument(
	templateName,
	side,
	fields,
	options = {},
) {
	const template = await readTemplateFile(
		templateName,
		`${side}.template.html`,
	);
	const styling = await readTemplateFile(templateName, "styling.css");
	const frontHtml =
		side === "back"
			? await renderTemplateSide(templateName, "front", fields)
			: "";
	const cardHtml = renderAnkiTemplate(template, fields, frontHtml);
	return wrapAnkiWebview(cardHtml, styling, options);
}

async function renderTemplateSide(templateName, side, fields) {
	const template = await readTemplateFile(
		templateName,
		`${side}.template.html`,
	);
	return renderAnkiTemplate(template, fields, "");
}

async function readTemplateFile(templateName, fileName) {
	const fileUrl = new URL(`${templateName}/${fileName}`, templateRoot);
	return readFile(fileUrl, "utf8");
}

function renderAnkiTemplate(template, fields, frontHtml) {
	let rendered = replaceConditionalBlocks(template, fields);
	rendered = rendered.replaceAll("{{FrontSide}}", frontHtml);
	return replaceFieldTokens(rendered, fields);
}

function replaceConditionalBlocks(template, fields) {
	return template
		.replaceAll(/\{\{#([^}]+)}}([\s\S]*?)\{\{\/\1}}/g, (_, name, content) => {
			return hasFieldValue(fields, name) ? content : "";
		})
		.replaceAll(/\{\{\^([^}]+)}}([\s\S]*?)\{\{\/\1}}/g, (_, name, content) => {
			return hasFieldValue(fields, name) ? "" : content;
		});
}

function hasFieldValue(fields, name) {
	const value = fields[normalizeFieldName(name)];
	return value !== undefined && String(value).trim() !== "";
}

function replaceFieldTokens(template, fields) {
	return template.replaceAll(/\{\{([^#/^][^}]*)}}/g, (_, name) => {
		return fields[normalizeFieldName(name)] ?? "";
	});
}

function normalizeFieldName(name) {
	return String(name).trim();
}

function wrapAnkiWebview(cardHtml, styling, options) {
	const htmlClasses = readHtmlClasses(options);
	const bodyClasses = readBodyClasses(options);
	return `<!doctype html>
<html class="${htmlClasses}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${styling}</style>
</head>
<body class="${bodyClasses}">
${cardHtml}
</body>
</html>`;
}

function readHtmlClasses(options) {
	if (options.platform === "mobile") return "mobile android linux";
	return "win chrome";
}

function readBodyClasses(options) {
	const classes = ["card", "card1"];
	if (options.nightMode) classes.push("nightMode");
	return classes.join(" ");
}
