import { Hono } from "hono";
import { loggerInOut } from "./log.ts";
import { generate } from "./process.ts";

import type { Variables } from "./common.ts";

const app = new Hono<{ Variables: Variables }>();

app.use(loggerInOut());

app.get("/ping", (ctx) => {
    const n = generate(ctx);
    return ctx.text("pong" + n);
});

Deno.serve(app.fetch);
