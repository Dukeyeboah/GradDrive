(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__2cef9047._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/lib/config/domains.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Domain configuration for multi-domain routing.
 * Fotomatic (fotomatic.app, fotmatic.app) serves the photographer-admin app as its own site (same codebase, same Firebase).
 */ __turbopack_context__.s([
    "FOTMATIC_HOSTS",
    ()=>FOTMATIC_HOSTS,
    "isFotmaticHost",
    ()=>isFotmaticHost
]);
const FOTMATIC_HOSTS = [
    'fotmatic.app',
    'www.fotmatic.app',
    'fotomatic.app',
    'www.fotomatic.app'
];
function isFotmaticHost(host) {
    if (!host) return false;
    const hostname = host.split(':')[0].toLowerCase();
    return FOTMATIC_HOSTS.some((h)=>hostname === h || hostname.endsWith('.' + h));
}
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Next.js Middleware — runs on the edge before every request.
 *
 * WHAT IS MIDDLEWARE? (simple terms)
 * Think of it like a receptionist at the front door of your app. Every time someone
 * requests a page (e.g. fotmatic.app/bookings), the request hits the receptionist first.
 * The receptionist can:
 *   - Let them through unchanged (request goes to the normal page).
 *   - Send them to a different room without changing the address on their badge (rewrite:
 *     internally serve another URL but the browser still shows fotmatic.app/bookings).
 *   - Tell them "please go to this other address" (redirect: browser URL changes).
 *
 * We use it so that fotmatic.app and fotmatic.app/bookings actually serve the
 * photographer-admin app (which lives at /photographer-admin and /photographer-admin/bookings
 * in the codebase) while the URL bar still shows fotmatic.app and fotmatic.app/bookings.
 *
 * Same for fotomatic.app: e.g. fotomatic.app/photographers rewrites internally to
 * /photographer-admin/photographers (browser URL stays /photographers).
 */ __turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$domains$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config/domains.ts [middleware-edge] (ecmascript)");
;
;
const PHOTOGRAPHER_PREFIX = '/photographer-admin';
function middleware(request) {
    const host = request.headers.get('host') ?? '';
    const url = request.nextUrl.clone();
    const pathname = url.pathname;
    // Only apply fotmatic logic when the request is for fotmatic.app (or www.fotmatic.app)
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$domains$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isFotmaticHost"])(host)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // --- On fotmatic.app ---
    // If user requested the "long" URL (e.g. fotmatic.app/photographer-admin/dashboard),
    // redirect to the clean URL (fotmatic.app/dashboard) so the bar shows the short path.
    if (pathname.startsWith(PHOTOGRAPHER_PREFIX)) {
        const rest = pathname.slice(PHOTOGRAPHER_PREFIX.length) || '/';
        const cleanPath = rest === '/' ? '' : rest;
        url.pathname = cleanPath || '/';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
    }
    // Rewrite: fotmatic.app/... → serve /photographer-admin/... internally.
    // The browser URL stays fotmatic.app/... (no redirect).
    if (pathname === '/') {
        url.pathname = PHOTOGRAPHER_PREFIX;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].rewrite(url);
    }
    // e.g. /dashboard → /photographer-admin/dashboard, /bookings → /photographer-admin/bookings
    url.pathname = PHOTOGRAPHER_PREFIX + pathname;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].rewrite(url);
}
const config = {
    // Run middleware on all page requests (excluding static files and API).
    // We only rewrite when host is fotmatic/fotomatic; other hosts pass through.
    matcher: [
        /*
     * Match all pathnames except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, etc.
     */ '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__2cef9047._.js.map