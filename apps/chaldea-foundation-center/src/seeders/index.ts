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

    const shouldSeed = process.env.RUN_SEEDERS === "true" || config.force;

    if (!shouldSeed && !config.force) {
        console.log("ℹ️  Seeders disabled. Set RUN_SEEDERS=true to enable");
        return;
    }

    console.log("🚀 Starting database seeding...");
    console.log(`📍 Environment: ${env}`);

    try {
        await seedAnimes(strapi);
        const jurisdictions = await seedJurisdictions(strapi);
        const bubbles = await seedBubbles(strapi, jurisdictions);
        const animeService = strapi.service("api::anime.anime");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const animes: { [key: string]: any } = {};
        if (animeService) {
            const allAnimes = await animeService.find({
                pagination: { limit: -1 },
            });
            if (allAnimes.results) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                allAnimes.results.forEach((anime: any) => {
                    animes[anime.name] = anime;
                });
            }
        }
        await seedFranchises(strapi, bubbles, animes);

        console.log("✨ Database seeding completed successfully");
    } catch (error) {
        console.error("❌ Database seeding failed:", error);
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
        "api::franchise.franchise",
        "api::bubble.bubble",
        "api::jurisdiction.jurisdiction",
        "api::anime.anime",
    ]
): Promise<void> {
    console.log("⚠️  Clearing data from content types...");

    for (const contentType of contentTypes) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const service = strapi.service(contentType as any);
            if (!service) {
                console.warn(`  ⚠️  Service ${contentType} not found`);
                continue;
            }

            const entries = await service.find({
                pagination: {
                    limit: -1,
                },
            });

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

    await clearData(strapi);
    await runSeeders(strapi, { force: true });
}
