import type { Context } from "hono";
import type { MiddlewareHandler } from "hono/types";
import { getPath } from "hono/utils/url";
import type { Variables } from "./common.ts";

// customized from https://github.com/honojs/hono/blob/main/src/middleware/logger/index.ts

enum LogPrefix {
    Outgoing = "-->",
    Incoming = "<--",
}

const humanize = (times: string[]) => {
    const [delimiter, separator] = [",", "."];

    const orderTimes = times.map((v) =>
        v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter)
    );

    return orderTimes.join(separator);
};

const time = (start: number) => {
    const delta = Date.now() - start;
    return humanize([
        delta < 1000 ? delta + "ms" : Math.round(delta / 1000) + "s",
    ]);
};

const loggerInOut = (): MiddlewareHandler => {
    return async function logger(ctx, next) {
        const tag = Math.round(Math.random() * 1000);
        const ts = new Date().toISOString();
        const uid = `${tag}-${ts}`;
        ctx.set("uid", uid);

        const { method } = ctx.req;
        const path = getPath(ctx.req.raw);

        const objIn = {
            way: LogPrefix.Incoming,
            method,
            path,
            uid,
        };
        console.log(JSON.stringify(objIn));

        const start = Date.now();

        await next();

        const status = ctx.res.status;
        const elapsed = time(start);
        const objOut = {
            way: LogPrefix.Outgoing,
            method,
            path,
            status,
            elapsed,
            uid,
        };
        console.log(JSON.stringify(objOut));
    };
};

const loggerInside = (
    ctx: Context<{
        Variables: Variables;
    }>,
    s: string,
) => {
    const uid = ctx.get("uid");
    const obj = {
        msg: s,
        uid,
    };
    console.log(JSON.stringify(obj));
};

export { loggerInOut, loggerInside };
