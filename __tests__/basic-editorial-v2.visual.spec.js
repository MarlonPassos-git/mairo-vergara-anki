import { expect, test } from "@playwright/test";
import { renderAnkiCardDocument } from "../tools/anki-renderer.mjs";

const templateName = "basic-editorial-v2";
const sampleFields = {
	"Audio em ingles": readReplayButtonHtml(),
	"Frase em ingles": "I need to <b>figure out</b> what happened.",
	"Traducao da frase": "Eu preciso descobrir o que aconteceu.",
	"Traducao do trecho": "descobrir / entender",
	"Transcricao JSON": JSON.stringify([
		{ e: 0.15, s: 0, w: "I" },
		{ e: 0.35, s: 0.16, w: "need" },
		{ e: 0.55, s: 0.36, w: "to" },
		{ e: 0.75, s: 0.56, w: "figure" },
		{ e: 1.05, s: 0.76, w: "out" },
		{ e: 1.25, s: 1.06, w: "what" },
		{ e: 1.5, s: 1.26, w: "happened" },
	]),
};

test("front renders Anki review card in desktop and mobile projects", async ({
	page,
}, testInfo) => {
	await renderSide(page, "front", testInfo.project.name);

	await expect(page.locator(".mp-card-front")).toBeVisible();
	await expect(page.locator(".mp-timed-word")).toHaveCount(7);
	await expect(page.locator(".mp-timed-word.is-target")).toHaveText([
		"figure",
		"out",
	]);
	await expect(page.locator(".mp-audio .replay-button")).toBeVisible();
	await expect(page).toHaveScreenshot(`front-${testInfo.project.name}.png`);
});

test("back keeps answer anchor and toggles full translation", async ({
	page,
}, testInfo) => {
	await renderSide(page, "back", testInfo.project.name);

	await expect(page.locator("#answer")).toBeVisible();
	await expect(page.locator(".mp-target-run")).toHaveText("figure out");
	await expect(page.locator(".mp-n1-answer")).toContainText("descobrir");
	await expect(page.locator("#mp-full-translation")).toBeHidden();

	await page.getByRole("button", { name: "Ver traducao completa" }).click();

	await expect(page.locator("#mp-full-translation")).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Ocultar traducao completa" }),
	).toBeVisible();
	await expect(page).toHaveScreenshot(`back-${testInfo.project.name}.png`);
});

async function renderSide(page, side, projectName) {
	const html = await renderAnkiCardDocument(templateName, side, sampleFields, {
		platform: readPlatform(projectName),
	});
	await page.setContent(html);
}

function readPlatform(projectName) {
	return projectName.includes("mobile") ? "mobile" : "desktop";
}

function readReplayButtonHtml() {
	return `<a class="replay-button soundLink" href="#" aria-label="Ouvir pronuncia">
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M4 9v6h4l5 4V5L8 9H4Z"></path>
			<path d="M16 8c1.5 1.8 1.5 6.2 0 8"></path>
		</svg>
	</a>`;
}
