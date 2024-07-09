import type { Context } from "hono";
import type { Variables } from "./common.ts";
import { loggerInside } from "./log.ts";

const generate = (
    ctx: Context<{
        Variables: Variables;
    }>,
): number => {
    const n = Math.round(Math.random() * 1e6);
    const s = `generate ${n}`;
    loggerInside(ctx, s);
    return n;
};

export { generate };
