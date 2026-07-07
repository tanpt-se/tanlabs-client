import { Hono } from "hono";
import { proxyApiRequest } from "./api-proxy";
import { proxyMediaRequest } from "./media-proxy";

const app = new Hono<{ Bindings: Env }>();

app.all("/api/*", (c) => proxyApiRequest(c));
app.all("/media/*", (c) => proxyMediaRequest(c));

export default app;
