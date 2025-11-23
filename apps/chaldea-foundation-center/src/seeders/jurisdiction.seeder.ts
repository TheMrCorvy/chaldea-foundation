/**
 * Jurisdiction (Universe) Seeder
 * Seeds the P - Universe content type with sample data
 */

import type { Core } from "@strapi/strapi";

export interface JurisdictionData {
    god_in_charge: string;
    status: boolean;
    description?: string;
}

const jurisdictionSeeds: JurisdictionData[] = [
    {
        god_in_charge: "Shonen Jump Universe",
        status: true,
        description:
            "The expansive universe containing all Shonen Jump properties, managed by the collective spirit of adventure and friendship. This jurisdiction oversees battle shounen, comedy, and sports anime that emphasize growth through challenges.",
    },
    {
        god_in_charge: "Studio Ghibli Realm",
        status: true,
        description:
            "A mystical jurisdiction governed by the spirit of wonder and environmental harmony. This universe contains all the whimsical and thought-provoking worlds created by Studio Ghibli, where nature and humanity intertwine.",
    },
    {
        god_in_charge: "Seinen Dark Territory",
        status: true,
        description:
            "A mature jurisdiction overseeing psychological thrillers, horror, and complex narratives aimed at adult audiences. This realm explores the darker aspects of human nature and society.",
    },
    {
        god_in_charge: "Isekai Multiverse Authority",
        status: true,
        description:
            "The administrative body managing all parallel worlds and reincarnation scenarios. This jurisdiction handles the endless variations of transported heroes, reborn protagonists, and game-world adventures.",
    },
    {
        god_in_charge: "Mecha Coalition Space",
        status: false,
        description:
            "Currently undergoing restructuring. This jurisdiction traditionally manages all giant robot and military science fiction properties, from real robot to super robot subgenres.",
    },
    {
        god_in_charge: "Romance & Slice of Life Garden",
        status: true,
        description:
            "A peaceful jurisdiction nurturing stories of love, daily life, and emotional connections. This realm focuses on character development and interpersonal relationships rather than action.",
    },
];

export async function seedJurisdictions(
    strapi: Core.Strapi
): Promise<{ [key: string]: any }> {
    const jurisdictionService = strapi.service(
        "api::jurisdiction.jurisdiction"
    );

    if (!jurisdictionService) {
        console.error("❌ Jurisdiction service not found");
        return {};
    }

    const createdJurisdictions: { [key: string]: any } = {};

    try {
        // Check if jurisdictions already exist
        const existingJurisdictions = await jurisdictionService.find({
            pagination: {
                limit: 1,
            },
        });

        if (
            existingJurisdictions.results &&
            existingJurisdictions.results.length > 0
        ) {
            console.log(
                "ℹ️  Jurisdictions already exist, fetching existing data"
            );

            // Fetch all existing jurisdictions to return for reference
            const allJurisdictions = await jurisdictionService.find({
                pagination: {
                    limit: -1,
                },
            });

            if (allJurisdictions.results) {
                allJurisdictions.results.forEach((jurisdiction: any) => {
                    createdJurisdictions[jurisdiction.god_in_charge] =
                        jurisdiction;
                });
            }

            return createdJurisdictions;
        }

        console.log("🌱 Seeding jurisdictions (universes)...");

        // Create jurisdictions
        for (const jurisdictionData of jurisdictionSeeds) {
            const created = await jurisdictionService.create({
                data: jurisdictionData,
            });
            console.log(
                `  ✅ Created jurisdiction: ${jurisdictionData.god_in_charge}`
            );
            createdJurisdictions[jurisdictionData.god_in_charge] = created;
        }

        console.log(
            `🎉 Successfully seeded ${jurisdictionSeeds.length} jurisdictions`
        );
    } catch (error) {
        console.error("❌ Error seeding jurisdictions:", error);
        throw error;
    }

    return createdJurisdictions;
}
