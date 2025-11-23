#!/usr/bin/env node

/**
 * Seed Script
 * Run with: npm run seed
 *
 * Options:
 *   --reset    Clear existing data before seeding
 *   --force    Run seeders even if data exists
 */

import { runSeeders, resetAndSeed, clearData } from "../src/seeders";
import strapiFactory from "@strapi/strapi";

async function main() {
    const args = process.argv.slice(2);
    const shouldReset = args.includes("--reset");
    const shouldForce = args.includes("--force");
    const shouldClear = args.includes("--clear");
    // Import Strapi

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const app = await (strapiFactory as any)({ distDir: "./dist" }).load();

        if (shouldClear) {
            console.log("🗑️  Clearing all data...");
            await clearData(app);
        } else if (shouldReset) {
            await resetAndSeed(app);
        } else {
            await runSeeders(app, { force: shouldForce });
        }

        await app.destroy();
        process.exit(0);
    } catch (error) {
        console.error("❌ Script failed:", error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("❌ Unhandled error:", error);
    process.exit(1);
});
