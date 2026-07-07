import type { Context } from "hono";

const FORWARD_RESPONSE_HEADERS = new Set([
	"content-type",
	"cache-control",
	"etag",
	"last-modified",
]);

export async function proxyMediaRequest(c: Context<{ Bindings: Env }>): Promise<Response> {
	const apiOrigin = c.env.API_ORIGIN.replace(/\/$/, "");
	const path = c.req.path;
	const search = new URL(c.req.url).search;
	const upstream = await fetch(`${apiOrigin}${path}${search}`, {
		method: c.req.method,
		redirect: "manual",
	});

	const headers = new Headers();
	for (const [key, value] of upstream.headers.entries()) {
		if (FORWARD_RESPONSE_HEADERS.has(key.toLowerCase())) {
			headers.append(key, value);
		}
	}

	return new Response(upstream.body, {
		status: upstream.status,
		statusText: upstream.statusText,
		headers,
	});
}
