module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

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
"[project]/lib/firebase/admin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminDb",
    ()=>adminDb,
    "default",
    ()=>__TURBOPACK__default__export__
]);
(()=>{
    const e = new Error("Cannot find module 'firebase-admin/app'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'firebase-admin/firestore'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
// Initialize Firebase Admin SDK
let adminApp;
if (getApps().length === 0) {
    // Try to use service account from environment variable or default config
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) : undefined;
    if (serviceAccount) {
        adminApp = initializeApp({
            credential: cert(serviceAccount),
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "graddrive-e3695"
        });
    } else {
        // If no service account, try to use Application Default Credentials
        // This works if running on Firebase/Google Cloud or if you've set up gcloud auth
        try {
            adminApp = initializeApp({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "graddrive-e3695"
            });
        } catch (error) {
            console.error("Failed to initialize Firebase Admin SDK:", error);
            throw error;
        }
    }
} else {
    adminApp = getApps()[0];
}
const adminDb = getFirestore(adminApp);
const __TURBOPACK__default__export__ = adminApp;
}),
"[project]/lib/firebase/firestore-server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addPhotographerServer",
    ()=>addPhotographerServer,
    "importPhotographersServer",
    ()=>importPhotographersServer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase/admin.ts [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'firebase-admin/firestore'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
async function addPhotographerServer(data) {
    try {
        const photographerData = {
            ...data,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };
        // Remove undefined values
        Object.keys(photographerData).forEach((key)=>{
            if (photographerData[key] === undefined) {
                delete photographerData[key];
            }
        });
        const docRef = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"].collection("photographers").add(photographerData);
        return docRef.id;
    } catch (error) {
        console.error("Error adding photographer:", error);
        return null;
    }
}
async function importPhotographersServer(jsonData) {
    let success = 0;
    let errors = 0;
    for (const item of jsonData){
        try {
            // Skip header rows
            if (item["First Name"] === "First Name" || item["Contact Stage"] === "Contact Stage") {
                continue;
            }
            // Normalize status value - support both old and new key names
            let status = item["Contact Stage"] || item.Column1 || item.Status || "interested-follow-up";
            if (typeof status === "string") {
                status = status.toLowerCase().trim();
                // Map various status formats to our enum values
                if (status.includes("interested") && status.includes("follow")) {
                    status = "interested-follow-up";
                } else if (status.includes("contacted")) {
                    status = "contacted";
                } else if (status.includes("not") && status.includes("contacted")) {
                    status = "not-contacted";
                } else if (status.includes("not") || status.includes("no response")) {
                    status = "not-interested/no-response";
                }
            }
            // Map JSON columns to Photographer interface - support both old and new key names
            const photographerData = {
                firstName: item["First Name"] || item.Column2 || "",
                lastName: item["Last Name"] || item.Column3 || undefined,
                email: item["Email"] || item.Column4 || undefined,
                website: item["Website"] || item.Column5 || undefined,
                instagram: item["Instagram"] || item.Column6 || undefined,
                phone: item["Phone Number"] || item["Phone"] || item.Column7 || undefined,
                address: item["Address"] || item.Column8 || undefined,
                state: item["State"] || item.Column9 || undefined,
                status: status,
                // Support both old and new key names for contact preferences
                instagramContact: item["Instagram-contact"] === true || item["Mode of Contact"] === true || item["Column 10"] === true || false,
                emailContact: item["Email-contact"] === true || item.Column11 === true || false,
                phoneContact: item["Phone-contact"] === true || item.Column12 === true || false
            };
            // Remove empty strings and convert to undefined
            Object.keys(photographerData).forEach((key)=>{
                const value = photographerData[key];
                if (value === "" || value === " " || value === null) {
                    photographerData[key] = undefined;
                }
            });
            // Ensure firstName is not empty
            if (!photographerData.firstName) {
                console.warn("Skipping photographer with no first name:", item);
                errors++;
                continue;
            }
            await addPhotographerServer(photographerData);
            success++;
        } catch (error) {
            console.error("Error importing photographer:", error, item);
            errors++;
        }
    }
    return {
        success,
        errors
    };
}
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/photographers/import/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$firestore$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase/firestore-server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
;
async function POST() {
    try {
        // Read the JSON file
        const filePath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(process.cwd(), "data", "photographers.json");
        console.log("Reading file from:", filePath);
        const fileContents = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])(filePath, "utf8");
        const photographersData = JSON.parse(fileContents);
        console.log(`Parsed ${photographersData.length} records from JSON file`);
        // Filter out header row if present
        const data = photographersData.filter((item)=>{
            const firstName = item["First Name"] || item.Column2;
            return firstName && firstName !== "First Name" && firstName !== "Column2";
        });
        console.log(`Filtered to ${data.length} valid photographer records`);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2f$firestore$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["importPhotographersServer"])(data);
        console.log(`Import complete: ${result.success} success, ${result.errors} errors`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            imported: result.success,
            errors: result.errors,
            message: `Successfully imported ${result.success} photographers. ${result.errors} errors.`
        });
    } catch (error) {
        console.error("Error importing photographers:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message || "Failed to import photographers",
            stack: ("TURBOPACK compile-time truthy", 1) ? error.stack : "TURBOPACK unreachable"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d25f9414._.js.map