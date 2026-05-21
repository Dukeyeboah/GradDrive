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
async function notifyAdminNewPasskeyRequest(params) {
    const resend = getResend();
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
    <p>Open the admin panel → <strong>Notifications</strong> (Grad Drive) to approve or decline and send the appropriate email.</p>
  `;
    if (!resend) {
        console.warn('[resend] RESEND_API_KEY not set; skipping admin notification email');
        return {
            sent: false,
            reason: 'no_api_key'
        };
    }
    try {
        await resend.emails.send({
            from: params.from,
            to: params.to,
            subject,
            html
        });
        return {
            sent: true
        };
    } catch (e) {
        console.error('[resend] notify admin failed', e);
        return {
            sent: false,
            reason: 'send_failed'
        };
    }
}
async function sendPasskeyApprovalToRequester(params) {
    const resend = getResend();
    const subject = "You're approved — your Grad Drive access passkey";
    const html = `
    <p>Hi ${escapeHtml(params.requesterName)},</p>
    <p><strong>Congratulations!</strong> Your request for Grad Drive access has been approved.</p>
    <p>Your access passkey is below. You will need it when you create your account:</p>
    <p style="font-size:18px;font-weight:bold;letter-spacing:0.05em;margin:16px 0;">${escapeHtml(params.passkey)}</p>
    <p><strong>What to do next</strong></p>
    <ol>
      <li>Go to the Grad Drive website.</li>
      <li>Choose <strong>Get access</strong> (or Sign up) and enter this passkey when asked — that unlocks sign-up on your device.</li>
      <li>Create your account with <strong>email and password</strong> or <strong>Google</strong> (after unlock).</li>
      <li>Keep this passkey somewhere safe; you only need it once per browser until you clear site data.</li>
    </ol>
    <p>If you did not request access, you can ignore this email.</p>
  `;
    if (!resend) {
        console.warn('[resend] RESEND_API_KEY not set; cannot email approval to requester');
        return {
            sent: false,
            reason: 'no_api_key'
        };
    }
    try {
        await resend.emails.send({
            from: params.from,
            to: params.to,
            subject,
            html
        });
        return {
            sent: true
        };
    } catch (e) {
        console.error('[resend] approval email failed', e);
        return {
            sent: false,
            reason: 'send_failed'
        };
    }
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
    const resend = getResend();
    const subject = 'Update on your Grad Drive access request';
    const bodyHtml = escapeHtml(params.rejectMessage).replace(/\n/g, '<br/>');
    const html = `
    <p>Hi ${escapeHtml(params.requesterName)},</p>
    <p>Thank you for your interest in Grad Drive. Unfortunately we are not able to approve this access request at this time.</p>
    <p><strong>Message from the team:</strong></p>
    <blockquote style="margin:12px 0;padding:12px 16px;border-left:4px solid #ccc;background:#f9f9f9;">
      ${bodyHtml}
    </blockquote>
    <p>If you believe this was a mistake, you may submit a new request with accurate details and a valid email address associated with your eligibility (for example through your House of Stole order).</p>
    <p>We appreciate your understanding.</p>
  `;
    if (!resend) {
        console.warn('[resend] RESEND_API_KEY not set; cannot email rejection to requester');
        return {
            sent: false,
            reason: 'no_api_key'
        };
    }
    try {
        await resend.emails.send({
            from: params.from,
            to: params.to,
            subject,
            html
        });
        return {
            sent: true
        };
    } catch (e) {
        console.error('[resend] rejection email failed', e);
        return {
            sent: false,
            reason: 'send_failed'
        };
    }
}
function getPasskeyForEmailBody() {
    return process.env.GRAD_DRIVE_USER_PASSKEY?.trim() || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$user$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["USER_PASSKEY"];
}
function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
}),
"[project]/app/api/request-passkey/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase/admin-server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$platform$2d$settings$2d$load$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/platform-settings-load.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$resend$2d$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/server/resend-passkey.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$platform$2d$settings$2d$load$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$platform$2d$settings$2d$load$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
const bodySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email().max(320),
    displayName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(200).trim(),
    collegeName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(300).trim(),
    graduationYear: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(2).max(32).trim()
});
async function POST(req) {
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
            error: 'Please provide a valid email, name, school, and graduation year.'
        }, {
            status: 400
        });
    }
    const email = parsed.data.email.trim().toLowerCase();
    const displayName = parsed.data.displayName.trim();
    const collegeName = parsed.data.collegeName.trim();
    const graduationYear = parsed.data.graduationYear.trim();
    let db;
    try {
        db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdminDb"])();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Server is not configured for passkey requests (missing FIREBASE_SERVICE_ACCOUNT_JSON).'
        }, {
            status: 503
        });
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$platform$2d$settings$2d$load$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensurePlatformSettingsDoc"])();
    const settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$platform$2d$settings$2d$load$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getResolvedEmailSettings"])();
    const docRef = await db.collection('passkeyRequests').add({
        email,
        displayName,
        collegeName,
        graduationYear,
        status: 'pending',
        createdAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["FieldValue"].serverTimestamp(),
        updatedAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["FieldValue"].serverTimestamp()
    });
    const webhook = process.env.PASSKEY_REQUEST_WEBHOOK_URL;
    if (webhook) {
        try {
            await fetch(webhook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    displayName,
                    collegeName,
                    graduationYear,
                    requestId: docRef.id,
                    source: 'graddrive-passkey-request',
                    at: new Date().toISOString()
                })
            });
        } catch  {
        /* non-fatal */ }
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$server$2f$resend$2d$passkey$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["notifyAdminNewPasskeyRequest"])({
        to: settings.passkeyAdminNotifyEmail,
        from: settings.passkeyFromEmail,
        requesterEmail: email,
        requestId: docRef.id,
        displayName,
        collegeName,
        graduationYear
    });
    console.info('[request-passkey]', email, docRef.id);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true,
        message: 'Thanks. If your email matches our records, we will send your access passkey and instructions shortly.'
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2b4008cd._.js.map