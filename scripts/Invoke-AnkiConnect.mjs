const defaultBaseUrl = "http://127.0.0.1:8765";
const defaultVersion = 6;

/**
 * Calls AnkiConnect and returns the action result.
 *
 * Example:
 * ```js
 * const version = await invokeAnkiConnect({ action: "version" });
 * ```
 */
export async function invokeAnkiConnect({
	action,
	baseUrl = defaultBaseUrl,
	params = {},
	version = defaultVersion,
}) {
	const response = await postAnkiConnectPayload(baseUrl, {
		action,
		params,
		version,
	});
	const body = await response.json();

	if (body.error) {
		throw new Error(
			`AnkiConnect action '${action}' failed with '${body.error}'. Expected a successful API response.`,
		);
	}

	return body.result;
}

async function postAnkiConnectPayload(baseUrl, payload) {
	try {
		return await fetch(baseUrl, {
			body: JSON.stringify(payload),
			headers: { "content-type": "application/json" },
			method: "POST",
		});
	} catch (error) {
		throw new Error(
			`Failed to connect to AnkiConnect at '${baseUrl}'. Expected Anki open with AnkiConnect installed and active. Cause: ${error.message}`,
		);
	}
}
