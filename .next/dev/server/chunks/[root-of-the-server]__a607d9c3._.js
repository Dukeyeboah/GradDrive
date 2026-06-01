module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("firebase-admin/firestore");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("firebase-admin/app");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/firebase-admin/auth [external] (firebase-admin/auth, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("firebase-admin/auth");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/lib/firebase/admin-server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getAdminApp",
    ()=>getAdminApp,
    "getAdminAuth",
    ()=>getAdminAuth,
    "getAdminDb",
    ()=>getAdminDb
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/auth [external] (firebase-admin/auth, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
let app = null;
function getServiceAccountJson() {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw?.trim()) {
        throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON');
    }
    return JSON.parse(raw);
}
function getAdminApp() {
    if (app) return app;
    const existing = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["getApps"])()[0];
    if (existing) {
        app = existing;
        return app;
    }
    app = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["initializeApp"])({
        credential: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["cert"])(getServiceAccountJson())
    });
    return app;
}
function getAdminDb() {
    getAdminApp();
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["getFirestore"])();
}
function getAdminAuth() {
    getAdminApp();
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__["getAuth"])();
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/server/verify-admin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "verifyAdminBearer",
    ()=>verifyAdminBearer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase/admin-server.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function verifyAdminBearer(req) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return {
            ok: false,
            status: 401,
            message: 'Missing or invalid Authorization header'
        };
    }
    const token = authHeader.slice(7).trim();
    if (!token) {
        return {
            ok: false,
            status: 401,
            message: 'Missing token'
        };
    }
    try {
        const decoded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminAuth"])().verifyIdToken(token);
        const userSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminDb"])().collection('users').doc(decoded.uid).get();
        const role = userSnap.data()?.role;
        if (role !== 'admin' && role !== 'super admin') {
            return {
                ok: false,
                status: 403,
                message: 'Admin access required'
            };
        }
        return {
            ok: true,
            uid: decoded.uid
        };
    } catch  {
        return {
            ok: false,
            status: 401,
            message: 'Invalid or expired token'
        };
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/config/platform-settings-defaults.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Fallback values when `platformSettings/main` has not been saved yet.
 * Override in Firestore via Admin → Settings (recommended) or edit these constants.
 */ __turbopack_context__.s([
    "CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL",
    ()=>CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL,
    "CODE_DEFAULT_PASSKEY_FROM_EMAIL",
    ()=>CODE_DEFAULT_PASSKEY_FROM_EMAIL,
    "PLATFORM_SETTINGS_DOC_ID",
    ()=>PLATFORM_SETTINGS_DOC_ID
]);
const PLATFORM_SETTINGS_DOC_ID = 'main';
const CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL = 'admin@example.com';
const CODE_DEFAULT_PASSKEY_FROM_EMAIL = 'Grad Drive <onboarding@resend.dev>';
}),
"[project]/lib/server/platform-settings-load.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "ensurePlatformSettingsDoc",
    ()=>ensurePlatformSettingsDoc,
    "getResolvedEmailSettings",
    ()=>getResolvedEmailSettings
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase/admin-server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$platform$2d$settings$2d$defaults$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config/platform-settings-defaults.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function getResolvedEmailSettings() {
    const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminDb"])();
    const ref = db.collection('platformSettings').doc(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$platform$2d$settings$2d$defaults$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PLATFORM_SETTINGS_DOC_ID"]);
    const snap = await ref.get();
    const envAdmin = process.env.PASSKEY_ADMIN_NOTIFY_EMAIL?.trim();
    const envFrom = process.env.PASSKEY_FROM_EMAIL?.trim();
    if (!snap.exists) {
        return {
            passkeyAdminNotifyEmail: envAdmin || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$platform$2d$settings$2d$defaults$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL"],
            passkeyFromEmail: envFrom || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$platform$2d$settings$2d$defaults$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CODE_DEFAULT_PASSKEY_FROM_EMAIL"]
        };
    }
    const data = snap.data();
    const admin = typeof data?.passkeyAdminNotifyEmail === 'string' && data.passkeyAdminNotifyEmail.trim() || envAdmin || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$platform$2d$settings$2d$defaults$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL"];
    const from = typeof data?.passkeyFromEmail === 'string' && data.passkeyFromEmail.trim() || envFrom || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$platform$2d$settings$2d$defaults$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CODE_DEFAULT_PASSKEY_FROM_EMAIL"];
    return {
        passkeyAdminNotifyEmail: admin,
        passkeyFromEmail: from
    };
}
async function ensurePlatformSettingsDoc() {
    const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminDb"])();
    const ref = db.collection('platformSettings').doc(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$platform$2d$settings$2d$defaults$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PLATFORM_SETTINGS_DOC_ID"]);
    const snap = await ref.get();
    if (snap.exists) return;
    const envAdmin = process.env.PASSKEY_ADMIN_NOTIFY_EMAIL?.trim();
    const envFrom = process.env.PASSKEY_FROM_EMAIL?.trim();
    await ref.set({
        passkeyAdminNotifyEmail: envAdmin || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$platform$2d$settings$2d$defaults$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL"],
        passkeyFromEmail: envFrom || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$platform$2d$settings$2d$defaults$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CODE_DEFAULT_PASSKEY_FROM_EMAIL"],
        updatedAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["FieldValue"].serverTimestamp()
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/config/user.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Main site (Grad Drive) access passkey (included with eligible orders).
 *
 * For emails sent from API routes, set `GRAD_DRIVE_USER_PASSKEY` in the server
 * environment to override this value without changing client code.
 */ __turbopack_context__.s([
    "GRAD_DRIVE_ACCESS_STORAGE_KEY",
    ()=>GRAD_DRIVE_ACCESS_STORAGE_KEY,
    "SIGNUP_PASSKEY_SESSION_KEY",
    ()=>SIGNUP_PASSKEY_SESSION_KEY,
    "USER_PASSKEY",
    ()=>USER_PASSKEY,
    "readGradDriveAccessUnlocked",
    ()=>readGradDriveAccessUnlocked,
    "setGradDriveAccessUnlocked",
    ()=>setGradDriveAccessUnlocked
]);
const USER_PASSKEY = 'ConGr@d$!';
const GRAD_DRIVE_ACCESS_STORAGE_KEY = 'gradDriveAccess';
const SIGNUP_PASSKEY_SESSION_KEY = 'gradDriveSignupPasskeyOk';
function readGradDriveAccessUnlocked() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
}
function setGradDriveAccessUnlocked() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
}),
"[project]/lib/server/resend-passkey.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPasskeyForEmailBody",
    ()=>getPasskeyForEmailBody,
    "notifyAdminNewPasskeyRequest",
    ()=>notifyAdminNewPasskeyRequest,
    "sendPasskeyApprovalToRequester",
    ()=>sendPasskeyApprovalToRequester,
    "sendPasskeyRejectionToRequester",
    ()=>sendPasskeyRejectionToRequester,
    "sendPasskeyToRequester",
    ()=>sendPasskeyToRequester
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$resend$40$6$2e$12$2e$3$2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/resend@6.12.3/node_modules/resend/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config/user.ts [app-route] (ecmascript)");
;
;
function getResend() {
    const key = process.env.RESEND_API_KEY?.trim();
    if (!key) return null;
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$resend$40$6$2e$12$2e$3$2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Resend"](key);
}
async function sendResendEmail(params) {
    const resend = getResend();
    if (!resend) {
        return {
            sent: false,
            reason: 'no_api_key'
        };
    }
    const { data, error } = await resend.emails.send({
        from: params.from,
        to: params.to,
        subject: params.subject,
        html: params.html
    });
    if (error) {
        console.error(`[resend] ${params.logLabel} failed`, error);
        return {
            sent: false,
            reason: 'send_failed',
            message: error.message
        };
    }
    if (!data?.id) {
        console.error(`[resend] ${params.logLabel} returned no id`, data);
        return {
            sent: false,
            reason: 'send_failed',
            message: 'Resend did not return a message id.'
        };
    }
    console.info(`[resend] ${params.logLabel} sent`, data.id, 'to', params.to);
    return {
        sent: true,
        id: data.id
    };
}
async function notifyAdminNewPasskeyRequest(params) {
    const subject = `Grad Drive: passkey request from ${params.requesterEmail}`;
    const html = `
    <p>A new Grad Drive access passkey request needs your review.</p>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(params.displayName)}</li>
      <li><strong>Email:</strong> ${escapeHtml(params.requesterEmail)}</li>
      <li><strong>College / university:</strong> ${escapeHtml(params.collegeName)}</li>
      <li><strong>Graduation year:</strong> ${escapeHtml(params.graduationYear)}</li>
      <li><strong>Request ID:</strong> ${escapeHtml(params.requestId)}</li>
    </ul>
    <p>Open the Grad Drive <strong>admin panel → Notifications</strong> (sidebar or bell icon) to approve or decline and email the requester automatically.</p>
  `;
    const result = await sendResendEmail({
        from: params.from,
        to: params.to,
        subject,
        html,
        logLabel: 'notify admin passkey request'
    });
    if (!result.sent) {
        console.warn('[resend] admin notify skipped or failed', result);
    }
    return result;
}
async function sendPasskeyApprovalToRequester(params) {
    const subject = "You're approved — your Grad Drive access passkey";
    const html = `
    <p>Hi ${escapeHtml(params.requesterName)},</p>
    <p><strong>Congratulations!</strong> Your request for Grad Drive access has been approved.</p>
    <p>Your access passkey is below. You will need it when you create your account:</p>
    <p style="font-size:18px;font-weight:bold;letter-spacing:0.05em;margin:16px 0;padding:12px 16px;background:#f5f5f5;border-radius:8px;">${escapeHtml(params.passkey)}</p>
    <p><strong>What to do next</strong></p>
    <ol>
      <li>Go to the Grad Drive website.</li>
      <li>Choose <strong>Get access</strong> (or Sign up) and enter this passkey when asked — that unlocks sign-up on your device.</li>
      <li>Create your account with <strong>email and password</strong> or <strong>Google</strong> (after unlock).</li>
      <li>Keep this passkey somewhere safe; you only need it once per browser until you clear site data.</li>
    </ol>
    <p><strong>What you get with Grad Drive</strong></p>
    <ul>
      <li>Exclusive graduation posters, cap designs, and digital keepsakes</li>
      <li>Member discounts (including Fotomatic photography with your community code)</li>
      <li>The Grad Community directory — connect with other graduates</li>
      <li>Scholarship opportunities, e-books, and House of Stole perks</li>
    </ul>
    <p>Welcome to the community — we are glad to have you.</p>
    <p>If you did not request access, you can ignore this email.</p>
  `;
    return sendResendEmail({
        from: params.from,
        to: params.to,
        subject,
        html,
        logLabel: 'passkey approval'
    });
}
async function sendPasskeyToRequester(params) {
    return sendPasskeyApprovalToRequester({
        to: params.to,
        from: params.from,
        passkey: params.passkey,
        requesterName: 'there'
    });
}
async function sendPasskeyRejectionToRequester(params) {
    const subject = 'Update on your Grad Drive access request';
    const bodyHtml = escapeHtml(params.rejectMessage).replace(/\n/g, '<br/>');
    const html = `
    <p>Hi ${escapeHtml(params.requesterName)},</p>
    <p>Thank you for your interest in Grad Drive. Unfortunately we are not able to approve this access request at this time.</p>
    <p><strong>Message from the team:</strong></p>
    <blockquote style="margin:12px 0;padding:12px 16px;border-left:4px solid #ccc;background:#f9f9f9;">
      ${bodyHtml}
    </blockquote>
    <p>Common reasons we cannot approve a request include:</p>
    <ul>
      <li>The email does not match our eligible customer or order records</li>
      <li>Information provided could not be verified (name, school, or graduation year)</li>
      <li>A duplicate or incomplete submission</li>
    </ul>
    <p>If you believe this was a mistake, submit a new request with accurate details and an email address tied to your eligibility (for example, the email used for your House of Stole order). You may also contact us at contact@houseofstole.com.</p>
    <p>We appreciate your understanding.</p>
  `;
    return sendResendEmail({
        from: params.from,
        to: params.to,
        subject,
        html,
        logLabel: 'passkey rejection'
    });
}
function getPasskeyForEmailBody() {
    return process.env.GRAD_DRIVE_USER_PASSKEY?.trim() || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["USER_PASSKEY"];
}
function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
}),
"[project]/app/api/admin/passkey-requests/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase/admin-server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$verify$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/verify-admin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$platform$2d$settings$2d$load$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/platform-settings-load.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$resend$2d$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/resend-passkey.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$verify$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$platform$2d$settings$2d$load$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$verify$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$platform$2d$settings$2d$load$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
const bodySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].discriminatedUnion('action', [
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        action: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('approve'),
        requestId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        action: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('send'),
        requestId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        action: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('resend_approval'),
        requestId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        action: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal('reject'),
        requestId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        rejectMessage: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(10).max(4000)
    })
]);
function serializePasskeyRequest(id, data) {
    const createdAt = data.createdAt;
    const updatedAt = data.updatedAt;
    return {
        id,
        email: data.email ?? '',
        displayName: data.displayName ?? '',
        collegeName: data.collegeName ?? '',
        graduationYear: data.graduationYear ?? '',
        status: data.status ?? 'pending',
        rejectMessage: data.rejectMessage ?? undefined,
        createdAt: createdAt && typeof createdAt.toDate === 'function' ? createdAt.toDate().toISOString() : null,
        updatedAt: updatedAt && typeof updatedAt.toDate === 'function' ? updatedAt.toDate().toISOString() : null
    };
}
async function GET(req) {
    const admin = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$verify$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAdminBearer"])(req);
    if (!admin.ok) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: admin.message
        }, {
            status: admin.status
        });
    }
    let db;
    try {
        db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminDb"])();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Server missing FIREBASE_SERVICE_ACCOUNT_JSON'
        }, {
            status: 503
        });
    }
    try {
        const snap = await db.collection('passkeyRequests').orderBy('createdAt', 'desc').limit(200).get();
        const requests = snap.docs.map((d)=>serializePasskeyRequest(d.id, d.data()));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            requests
        });
    } catch (e) {
        console.error('[passkey-requests] list failed', e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Could not load passkey requests.'
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    const admin = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$verify$2d$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAdminBearer"])(req);
    if (!admin.ok) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: admin.message
        }, {
            status: admin.status
        });
    }
    let json;
    try {
        json = await req.json();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid JSON'
        }, {
            status: 400
        });
    }
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid body. Decline requires a message (at least 10 characters).'
        }, {
            status: 400
        });
    }
    let db;
    try {
        db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminDb"])();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Server missing FIREBASE_SERVICE_ACCOUNT_JSON'
        }, {
            status: 503
        });
    }
    const payload = parsed.data;
    const requestId = payload.requestId;
    const ref = db.collection('passkeyRequests').doc(requestId);
    const snap = await ref.get();
    if (!snap.exists) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Request not found'
        }, {
            status: 404
        });
    }
    const row = snap.data();
    const requesterEmail = (row.email || '').trim().toLowerCase();
    if (!requesterEmail) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid request record'
        }, {
            status: 400
        });
    }
    const requesterName = (row.displayName || '').trim() || requesterEmail.split('@')[0] || 'there';
    const settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$platform$2d$settings$2d$load$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getResolvedEmailSettings"])();
    if (payload.action === 'reject') {
        const rejectMessage = payload.rejectMessage.trim();
        const sendResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$resend$2d$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendPasskeyRejectionToRequester"])({
            to: requesterEmail,
            from: settings.passkeyFromEmail,
            requesterName,
            rejectMessage
        });
        if (!sendResult.sent) {
            const msg = sendResult.reason === 'no_api_key' ? 'RESEND_API_KEY is not set. Configure Resend, then try again.' : 'Resend could not send the decline email. Check the from-address and Resend dashboard.';
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: msg
            }, {
                status: 502
            });
        }
        await ref.update({
            status: 'rejected',
            updatedAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["FieldValue"].serverTimestamp(),
            rejectedAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["FieldValue"].serverTimestamp(),
            rejectedByUid: admin.uid,
            rejectMessage,
            rejectionEmailSentAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["FieldValue"].serverTimestamp()
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    }
    if (row.status === 'sent' && payload.action !== 'resend_approval') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Passkey was already sent for this request.'
        }, {
            status: 400
        });
    }
    const passkey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$resend$2d$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPasskeyForEmailBody"])();
    const sendResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$resend$2d$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendPasskeyApprovalToRequester"])({
        to: requesterEmail,
        from: settings.passkeyFromEmail,
        passkey,
        requesterName
    });
    if (!sendResult.sent) {
        const detail = 'message' in sendResult && sendResult.message ? sendResult.message : undefined;
        const msg = sendResult.reason === 'no_api_key' ? 'RESEND_API_KEY is not set. Configure Resend, then try again.' : detail ? `Resend could not send the approval email: ${detail}` : 'Resend could not send the approval email. Verify your domain and from-address in Resend (trial accounts can only email limited addresses).';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: msg
        }, {
            status: 502
        });
    }
    await ref.update({
        status: 'sent',
        updatedAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["FieldValue"].serverTimestamp(),
        sentAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["FieldValue"].serverTimestamp(),
        sentToEmail: requesterEmail,
        fromEmailUsed: settings.passkeyFromEmail,
        adminNotifyEmailSnapshot: settings.passkeyAdminNotifyEmail,
        sentByUid: admin.uid,
        approvalEmailSentAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["FieldValue"].serverTimestamp(),
        resendMessageId: sendResult.id
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true,
        emailedTo: requesterEmail,
        resendMessageId: sendResult.id
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a607d9c3._.js.map