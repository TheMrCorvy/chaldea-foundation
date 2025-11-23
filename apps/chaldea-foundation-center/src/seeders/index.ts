/**
 * Main Seeder Module
 * Orchestrates all seeders for the application
 */

import type { Core } from "@strapi/strapi";
import { seedAnimes } from "./anime.seeder";
import { seedJurisdictions } from "./jurisdiction.seeder";
import { seedBubbles } from "./bubble.seeder";
import { seedFranchises } from "./franchise.seeder";

export interface SeederConfig {
    runInProduction?: boolean;
    force?: boolean;
}

const DEFAULT_CONFIG: SeederConfig = {
    runInProduction: false,
    force: false,
};

/**
 * Main seeder function that runs all individual seeders
 * @param strapi - Strapi instance
 * @param config - Seeder configuration
 */
export async function runSeeders(
    strapi: Core.Strapi,
    config: SeederConfig = DEFAULT_CONFIG
): Promise<void> {
    const env = process.env.NODE_ENV || "development";

    // Safety check: Don't run seeders in production unless explicitly configured
    if (env === "production" && !config.runInProduction) {
        console.log("⚠️  Skipping seeders in production environment");
        return;
    }

    // Check if we should run seeders
    const shouldSeed = process.env.RUN_SEEDERS === "true" || config.force;

    if (!shouldSeed && !config.force) {
        console.log("ℹ️  Seeders disabled. Set RUN_SEEDERS=true to enable");
        return;
    }

    console.log("🚀 Starting database seeding...");
    console.log(`📍 Environment: ${env}`);

    try {
        // Run all seeders in sequence - order matters for relationships!

        // 1. Seed core anime data first
        await seedAnimes(strapi);

        // 2. Seed jurisdictions (universes) - top level of hierarchy
        const jurisdictions = await seedJurisdictions(strapi);

        // 3. Seed bubbles with jurisdiction relationships
        const bubbles = await seedBubbles(strapi, jurisdictions);

        // 4. Seed franchises with anime and bubble relationships
        // Fetch existing animes to link with franchises
        const animeService = strapi.service("api::anime.anime");
        const animes: { [key: string]: any } = {};
        if (animeService) {
            const allAnimes = await animeService.find({
                pagination: { limit: -1 },
            });
            if (allAnimes.results) {
                allAnimes.results.forEach((anime: any) => {
                    animes[anime.name] = anime;
                });
            }
        }
        await seedFranchises(strapi, bubbles, animes);

        console.log("✨ Database seeding completed successfully");
    } catch (error) {
        console.error("❌ Database seeding failed:", error);
        // In development, we might want to throw to stop the app
        if (env === "development") {
            throw error;
        }
    }
}

/**
 * Clears all data from specified content types
 * USE WITH CAUTION - This will delete all data!
 */
export async function clearData(
    strapi: Core.Strapi,
    contentTypes: string[] = [
        "api::franchise.franchise", // Delete franchises first (has relations to anime and bubbles)
        "api::bubble.bubble", // Delete bubbles second (has relation to jurisdiction)
        "api::jurisdiction.jurisdiction", // Delete jurisdictions third
        "api::anime.anime", // Delete anime last (referenced by franchises)
    ]
): Promise<void> {
    console.log("⚠️  Clearing data from content types...");

    for (const contentType of contentTypes) {
        try {
            const service = strapi.service(contentType);
            if (!service) {
                console.warn(`  ⚠️  Service ${contentType} not found`);
                continue;
            }

            // Get all entries
            const entries = await service.find({
                pagination: {
                    limit: -1, // Get all entries
                },
            });

            // Delete each entry
            if (entries.results && entries.results.length > 0) {
                for (const entry of entries.results) {
                    await service.delete(entry.id);
                }
                console.log(
                    `  ✅ Cleared ${entries.results.length} entries from ${contentType}`
                );
            } else {
                console.log(`  ℹ️  No entries to clear in ${contentType}`);
            }
        } catch (error) {
            console.error(`  ❌ Error clearing ${contentType}:`, error);
        }
    }
}

/**
 * Reset and reseed the database
 * This will clear existing data and run seeders fresh
 */
export async function resetAndSeed(strapi: Core.Strapi): Promise<void> {
    const env = process.env.NODE_ENV || "development";

    if (env === "production") {
        console.error("❌ Reset and seed is not allowed in production");
        return;
    }

    console.log("🔄 Resetting and reseeding database...");

    // Clear existing data
    await clearData(strapi);

    // Run seeders with force flag
    await runSeeders(strapi, { force: true });
}
