import { Hono } from "hono";
import { proxyApiRequest } from "./api-proxy";

const app = new Hono<{ Bindings: Env }>();

app.all("/api/*", (c) => proxyApiRequest(c));

export default app;
