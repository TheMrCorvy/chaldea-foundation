#!/usr/bin/env node

/**
 * Seed Script for Strapi v5
 * Run with: npm run seed
 *
 * Options:
 *   --reset    Clear existing data before seeding
 *   --force    Run seeders even if data exists
 *   --clear    Only clear data without seeding
 */

import { runSeeders, resetAndSeed, clearData } from "../src/seeders";
import { createStrapi } from "@strapi/core";
import type { Core } from "@strapi/strapi";

async function main() {
    const args = process.argv.slice(2);
    const shouldReset = args.includes("--reset");
    const shouldForce = args.includes("--force");
    const shouldClear = args.includes("--clear");

    let strapi: Core.Strapi | undefined;

    try {
        console.log("🔄 Loading Strapi instance...");

        strapi = createStrapi({ distDir: "./dist" });
        await strapi.load();

        if (shouldClear) {
            console.log("🗑️  Clearing all data...");
            await clearData(strapi);
        } else if (shouldReset) {
            await resetAndSeed(strapi);
        } else {
            await runSeeders(strapi, { force: shouldForce });
        }

        console.log("✅ Seed script completed successfully");
    } catch (error) {
        console.error("❌ Script failed:", error);
        process.exit(1);
    } finally {
        if (strapi) {
            await strapi.destroy();
        }
        process.exit(0);
    }
}

main().catch((error) => {
    console.error("❌ Unhandled error:", error);
    process.exit(1);
});
