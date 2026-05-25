import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);
const templatesDir = path.join(repoRoot, "templates");
const docsDir = path.join(repoRoot, "docs");

const mockFields = {
	Audio: mockAudioButton(),
	"Audio em ingles": mockAudioButton(),
	Frente: "She gave me a <b>ride</b> home.",
	"Frase em ingles": "She gave me a <b>ride</b> home.",
	Tags: "mario::n1",
	"Traducao da frase": "Ela me deu uma carona para casa.",
	"Traducao do trecho": "carona",
	"Transcricao JSON": JSON.stringify([
		{ s: 0.1, e: 0.3, w: "She" },
		{ s: 0.31, e: 0.5, w: "gave" },
		{ s: 0.51, e: 0.7, w: "me" },
		{ s: 0.71, e: 0.9, w: "a" },
		{ s: 0.91, e: 1.2, w: "ride" },
		{ s: 1.21, e: 1.45, w: "home" },
	]),
	Verso: "carona",
};

async function main() {
	const templates = await readTemplateCatalog();
	await writeFile(
		path.join(docsDir, "templates.md"),
		renderMarkdown(templates),
	);
	await writeFile(
		path.join(docsDir, "index.html"),
		renderPreviewHtml(templates),
	);
	await writeFile(
		path.join(docsDir, "como-instalar.md"),
		renderInstallGuide(templates),
	);
}

async function readTemplateCatalog() {
	const folders = await readdir(templatesDir, { withFileTypes: true });
	const templateFolders = folders.filter((folder) => folder.isDirectory());
	const templates = await Promise.all(templateFolders.map(readTemplateInfo));

	return templates.sort((left, right) => left.name.localeCompare(right.name));
}

async function readTemplateInfo(folder) {
	const templateRoot = path.join(templatesDir, folder.name);
	const model = JSON.parse(
		await readFile(path.join(templateRoot, "anki.model.json"), "utf8"),
	);
	const front = await readFile(
		path.join(templateRoot, "front.template.html"),
		"utf8",
	);
	const back = await readFile(
		path.join(templateRoot, "back.template.html"),
		"utf8",
	);
	const css = await readFile(path.join(templateRoot, "styling.css"), "utf8");

	return { back, css, fields: model.fields, front, model, name: folder.name };
}

function renderMarkdown(templates) {
	const rows = templates.map(renderTemplateRow).join("\n");
	const sections = templates.map(renderTemplateSection).join("\n\n");

	return `# Templates\n\nEsta documentacao referencia os templates Anki mantidos neste repositorio.\n\nPara uma pagina visual completa, abra [index.html](index.html).\n\n## Templates disponiveis\n\n| Template | Frente | Verso | Campos aceitos |\n| --- | --- | --- | --- |\n${rows}\n\n${sections}\n\n## Instalar\n\nVeja [como-instalar.md](como-instalar.md) para instalar manualmente no Anki.\n`;
}

function renderTemplateRow(template) {
	const fields = template.fields.map((field) => `- \`${field}\``).join("<br>");
	const front = `![Frente do ${template.name}](assets/templates/${template.name}-front.png)`;
	const back = `![Verso do ${template.name}](assets/templates/${template.name}-back.png)`;

	return `| [\`${template.name}\`](#${template.name}) | ${front} | ${back} | ${fields} |`;
}

function renderTemplateSection(template) {
	const fields = template.fields.map((field) => `- \`${field}\``).join("\n");

	return `## \`${template.name}\`\n\nTipo de nota: \`${template.model.modelName}\`\n\nPreview: [frente e verso](index.html#${template.name})\n\n### Campos aceitos\n\n${fields}\n\n### Arquivos\n\n- \`templates/${template.name}/front.template.html\`\n- \`templates/${template.name}/back.template.html\`\n- \`templates/${template.name}/styling.css\`\n- \`templates/${template.name}/anki.model.json\``;
}

function renderPreviewHtml(templates) {
	const cards = templates.map(renderTemplatePreview).join("\n");

	return `<!doctype html>\n<html lang="pt-BR">\n<head>\n${renderPreviewHead()}\n</head>\n<body>\n<main class="template-catalog">\n<h1>Templates Anki</h1>\n<p class="lead">Frente e verso com textos mock para conferencia visual rapida.</p>\n${cards}\n</main>\n</body>\n</html>\n`;
}

function renderPreviewHead() {
	return `<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Templates Anki</title>\n<style>\n${renderCatalogCss()}\n</style>`;
}

function renderTemplatePreview(template) {
	const front = renderCard(template.front);
	const back = renderCard(template.back);
	const fields = template.fields
		.map((field) => `<code>${escapeHtml(field)}</code>`)
		.join("");

	return `<section id="${template.name}" class="template-section">\n<style>${template.css}\n${renderAnkiCssOverrides()}</style>\n<header><h2>${template.name}</h2><p>${template.model.modelName}</p></header>\n<div class="field-list">${fields}</div>\n<div class="preview-grid">\n<article><h3>Frente</h3><div class="card">${front}</div></article>\n<article><h3>Verso</h3><div class="card">${back}</div></article>\n</div>\n</section>`;
}

function renderCard(templateHtml) {
	const withoutScripts = templateHtml.replace(
		/<script[\s\S]*?<\/script>/gi,
		"",
	);
	const withSections = renderMustacheSections(withoutScripts);

	return replaceFields(withSections);
}

function renderMustacheSections(html) {
	let rendered = html;

	for (const [field, value] of Object.entries(mockFields)) {
		rendered = renderPositiveSection(rendered, field, value);
		rendered = renderNegativeSection(rendered, field, value);
	}

	return rendered.replace(/{{[#/^][^}]+}}/g, "");
}

function renderPositiveSection(html, field, value) {
	const pattern = new RegExp(
		`{{#${escapeRegExp(field)}}}([\\s\\S]*?){{/${escapeRegExp(field)}}}`,
		"g",
	);

	return html.replace(pattern, value ? "$1" : "");
}

function renderNegativeSection(html, field, value) {
	const pattern = new RegExp(
		`{{\\^${escapeRegExp(field)}}}([\\s\\S]*?){{/${escapeRegExp(field)}}}`,
		"g",
	);

	return html.replace(pattern, value ? "" : "$1");
}

function replaceFields(html) {
	let rendered = html;

	for (const [field, value] of Object.entries(mockFields)) {
		rendered = rendered.replaceAll(`{{${field}}}`, value);
	}

	return rendered.replace(/{{[^}]+}}/g, "");
}

function renderInstallGuide(templates) {
	const options = templates.map(renderInstallOption).join("\n");

	return `# Como instalar um template no Anki\n\nGuia manual para quem nao quer mexer em codigo.\n\n## Escolha o template\n\n${options}\n\n## Passo a passo\n\n1. Abra o Anki.\n2. Clique em \`Tools\` e depois em \`Manage Note Types\`.\n3. Clique em \`Add\` ou duplique um tipo de nota existente.\n4. Crie os campos com os mesmos nomes listados em [templates.md](templates.md).\n5. Abra a pasta do template dentro de \`templates/\`.\n6. Copie \`front.template.html\` para \`Front Template\`.\n7. Copie \`back.template.html\` para \`Back Template\`.\n8. Copie \`styling.css\` para \`Styling\`.\n9. Salve e crie um card de teste.\n\n## Dica\n\nUse [index.html](index.html) para conferir a aparencia esperada de frente e verso antes de colar no Anki.\n`;
}

function renderInstallOption(template) {
	return `- \`${template.name}\`: tipo de nota \`${template.model.modelName}\`.`;
}

function renderCatalogCss() {
	return `body{margin:0;background:#f4f1ea;color:#181614;font-family:Inter,Segoe UI,Arial,sans-serif}.template-catalog{max-width:1180px;margin:0 auto;padding:32px 18px 56px}.lead{color:#5f5a52}.template-section{margin-top:28px;padding:22px;border:1px solid #d8d1c3;border-radius:10px;background:#fffdf8}.template-section header{display:flex;align-items:baseline;justify-content:space-between;gap:16px}.template-section h2,.template-section h3{margin:0}.template-section header p{margin:0;color:#6f675f}.field-list{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}.field-list code{padding:5px 8px;border:1px solid #ddd4c5;border-radius:999px;background:#f8f2e8}.preview-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.preview-grid article{min-width:0}.preview-grid h3{margin-bottom:8px;color:#4f493f;font-size:14px}@media(max-width:760px){.preview-grid{grid-template-columns:1fr}.template-section header{display:block}}`;
}

function renderAnkiCssOverrides() {
	return `.template-catalog .card{min-height:auto;padding:18px;border-radius:8px}.template-catalog .mp-scene{min-height:360px}.template-catalog .mp-card{box-sizing:border-box}.template-catalog textarea[hidden]{display:none!important}`;
}

function mockAudioButton() {
	return '<button class="replay-button" type="button" aria-label="Ouvir">▶</button>';
}

function escapeHtml(value) {
	return String(value).replace(/[&<>"']/g, (char) => {
		const entities = {
			"&": "&amp;",
			'"': "&quot;",
			"'": "&#39;",
			"<": "&lt;",
			">": "&gt;",
		};
		return entities[char];
	});
}

function escapeRegExp(value) {
	return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

await main();
