import type { Context } from "hono";

const FORWARD_REQUEST_HEADERS = new Set([
	"accept",
	"accept-language",
	"authorization",
	"content-type",
	"cookie",
	"x-auth-client",
	"x-csrf-token",
	"x-auth-refresh-mode",
]);

const FORWARD_RESPONSE_HEADERS = new Set([
	"content-type",
	"cache-control",
	"set-cookie",
	"location",
]);

function buildUpstreamUrl(c: Context<{ Bindings: Env }>): string {
	const apiOrigin = c.env.API_ORIGIN.replace(/\/$/, "");
	const path = c.req.path.replace(/^\/api/, "");
	const search = new URL(c.req.url).search;
	return `${apiOrigin}${path}${search}`;
}

function forwardRequestHeaders(request: Request): Headers {
	const headers = new Headers();
	for (const [key, value] of request.headers.entries()) {
		if (FORWARD_REQUEST_HEADERS.has(key.toLowerCase())) {
			headers.set(key, value);
		}
	}

	if (!headers.has("x-auth-client")) {
		headers.set("X-Auth-Client", "web");
	}

	return headers;
}

function forwardResponseHeaders(upstream: Response): Headers {
	const headers = new Headers();
	for (const [key, value] of upstream.headers.entries()) {
		if (FORWARD_RESPONSE_HEADERS.has(key.toLowerCase())) {
			headers.append(key, value);
		}
	}
	return headers;
}

function needsRequestBody(method: string): boolean {
	return !["GET", "HEAD"].includes(method.toUpperCase());
}

export async function proxyApiRequest(c: Context<{ Bindings: Env }>): Promise<Response> {
	const upstreamUrl = buildUpstreamUrl(c);
	const method = c.req.method;
	const upstream = await fetch(upstreamUrl, {
		method,
		headers: forwardRequestHeaders(c.req.raw),
		body: needsRequestBody(method) ? await c.req.arrayBuffer() : undefined,
		redirect: "manual",
	});

	return new Response(upstream.body, {
		status: upstream.status,
		statusText: upstream.statusText,
		headers: forwardResponseHeaders(upstream),
	});
}
