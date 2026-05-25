import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const templatePath = new URL(
	"../templates/basic-editorial-v2/back.template.html",
	import.meta.url,
);
const stylingPath = new URL(
	"../templates/basic-editorial-v2/styling.css",
	import.meta.url,
);

test("basic-editorial-v2 hides full sentence translation by default", async () => {
	const template = await readFile(templatePath, "utf8");

	assert.match(template, /class="mp-translation-toggle"/);
	assert.match(template, /aria-expanded="false"/);
	assert.match(template, /aria-controls="mp-full-translation"/);
	assert.match(template, /aria-label="Ver traducao completa"/);
	assert.match(template, /<svg viewBox="0 0 24 24" aria-hidden="true">/);
	assert.match(
		template,
		/id="mp-full-translation" class="mp-sentence-translation" hidden/,
	);
	assert.match(
		template,
		/button\.setAttribute\("aria-label", shouldShow \? "Ocultar traducao completa" : "Ver traducao completa"\)/,
	);
	assert.match(template, /setupStaticHighlightedWords\(\);/);
	assert.match(template, /wrapTargetWordRuns\(container\);/);
	assert.match(template, /className = "mp-target-run"/);
	assert.match(template, /readBottomCenterOfGroup\(targets, cardBox\)/);
	assert.match(template, /readLeftCenter\(answer, cardBox\)/);
});

test("basic-editorial-v2 styles translation toggle and hidden state", async () => {
	const styling = await readFile(stylingPath, "utf8");

	assert.match(styling, /\.mp-translation-toggle \{/);
	assert.match(styling, /width: 26px;/);
	assert.match(styling, /height: 26px;/);
	assert.match(styling, /opacity: 0\.58;/);
	assert.match(styling, /\.mp-target-run \{/);
	assert.match(styling, /\.mp-answer-block-primary \{/);
	assert.match(styling, /text-align: left;/);
	assert.match(styling, /width: min\(360px, calc\(100% - 96px\)\);/);
	assert.match(styling, /margin-top: 40px;/);
	assert.match(styling, /top: 14px;/);
	assert.match(styling, /font-size: clamp\(12px, 2vw, 15px\);/);
	assert.match(styling, /\.mp-sentence-translation\[hidden\] \{/);
	assert.match(styling, /display: none;/);
	assert.doesNotMatch(styling, /\.mp-sentence-translation \{[\s\S]*border:/);
});
