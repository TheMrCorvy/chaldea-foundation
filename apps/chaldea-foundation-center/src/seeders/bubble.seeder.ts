/**
 * Bubble Seeder
 * Seeds the P - Bubble content type with sample data
 */

import type { Core } from "@strapi/strapi";

export interface BubbleData {
    display_name: string;
    universe?: number;
    description?: string;
    jurisdictionName?: string; // For linking to jurisdiction
}

const bubbleSeeds: BubbleData[] = [
    {
        display_name: "One Piece World",
        universe: 1,
        description:
            "The vast oceanic world where pirates search for the ultimate treasure. Contains multiple islands, kingdoms, and the Grand Line.",
        jurisdictionName: "Shonen Jump Universe",
    },
    {
        display_name: "Naruto Shinobi Nations",
        universe: 2,
        description:
            "The hidden villages and ninja world where shinobi protect their nations and pursue their ninja way.",
        jurisdictionName: "Shonen Jump Universe",
    },
    {
        display_name: "Dragon Ball Multiverse",
        universe: 3,
        description:
            "Multiple universes containing Saiyans, gods, and warriors with incredible power levels.",
        jurisdictionName: "Shonen Jump Universe",
    },
    {
        display_name: "My Hero Academia Society",
        universe: 4,
        description:
            "A modern world where 80% of the population has Quirks, and heroes are professional protectors.",
        jurisdictionName: "Shonen Jump Universe",
    },
    {
        display_name: "Spirited Away Spirit Realm",
        universe: 1,
        description:
            "The bathhouse and surrounding spirit world where gods and spirits come to rest and rejuvenate.",
        jurisdictionName: "Studio Ghibli Realm",
    },
    {
        display_name: "Princess Mononoke Forest",
        universe: 2,
        description:
            "Ancient Japan where forest gods, spirits, and humans struggle for coexistence.",
        jurisdictionName: "Studio Ghibli Realm",
    },
    {
        display_name: "Tokyo Ghoul Dark Tokyo",
        universe: 1,
        description:
            "A hidden world within modern Tokyo where ghouls prey on humans while maintaining secret identities.",
        jurisdictionName: "Seinen Dark Territory",
    },
    {
        display_name: "Attack on Titan Walled World",
        universe: 2,
        description:
            "Humanity's last stronghold behind three concentric walls, protecting them from the Titan threat.",
        jurisdictionName: "Seinen Dark Territory",
    },
    {
        display_name: "Death Note Modern World",
        universe: 3,
        description:
            "Our world but with shinigami and Death Notes that can kill anyone whose name is written.",
        jurisdictionName: "Seinen Dark Territory",
    },
    {
        display_name: "SAO Virtual Realms",
        universe: 1,
        description:
            "Multiple virtual reality game worlds where players can become trapped with real consequences.",
        jurisdictionName: "Isekai Multiverse Authority",
    },
    {
        display_name: "Re:Zero Lugnica Kingdom",
        universe: 2,
        description:
            "A fantasy kingdom where time loops and witch cultists create endless suffering and redemption.",
        jurisdictionName: "Isekai Multiverse Authority",
    },
    {
        display_name: "Overlord New World",
        universe: 3,
        description:
            "A fantasy realm where an undead overlord and his NPC servants build a kingdom of darkness.",
        jurisdictionName: "Isekai Multiverse Authority",
    },
    {
        display_name: "Evangelion Post-Impact Earth",
        universe: 1,
        description:
            "Tokyo-3 and the world after Second Impact, where humanity fights Angels using biomechanical Evangelions.",
        jurisdictionName: "Mecha Coalition Space",
    },
    {
        display_name: "Gundam Universal Century",
        universe: 2,
        description:
            "Space colonies and Earth in perpetual conflict, with mobile suits as the primary weapons of war.",
        jurisdictionName: "Mecha Coalition Space",
    },
    {
        display_name: "Your Name Timeline",
        universe: 1,
        description:
            "Two timelines connected by body-swapping and fate, spanning rural and urban Japan.",
        jurisdictionName: "Romance & Slice of Life Garden",
    },
    {
        display_name: "Clannad Town",
        universe: 2,
        description:
            "A small town where family bonds and love transcend time and tragedy.",
        jurisdictionName: "Romance & Slice of Life Garden",
    },
];

export async function seedBubbles(
    strapi: Core.Strapi,
    jurisdictions?: { [key: string]: any }
): Promise<{ [key: string]: any }> {
    const bubbleService = strapi.service("api::bubble.bubble");

    if (!bubbleService) {
        console.error("❌ Bubble service not found");
        return {};
    }

    const createdBubbles: { [key: string]: any } = {};

    try {
        // Check if bubbles already exist
        const existingBubbles = await bubbleService.find({
            pagination: {
                limit: 1,
            },
        });

        if (existingBubbles.results && existingBubbles.results.length > 0) {
            console.log("ℹ️  Bubbles already exist, fetching existing data");

            // Fetch all existing bubbles to return for reference
            const allBubbles = await bubbleService.find({
                pagination: {
                    limit: -1,
                },
            });

            if (allBubbles.results) {
                allBubbles.results.forEach((bubble: any) => {
                    createdBubbles[bubble.display_name] = bubble;
                });
            }

            return createdBubbles;
        }

        console.log("🌱 Seeding bubbles...");

        // Create bubbles
        for (const bubbleData of bubbleSeeds) {
            const dataToCreate: any = {
                display_name: bubbleData.display_name,
                universe: bubbleData.universe,
                description: bubbleData.description,
            };

            // Link to jurisdiction if provided and exists
            if (
                jurisdictions &&
                bubbleData.jurisdictionName &&
                jurisdictions[bubbleData.jurisdictionName]
            ) {
                // Note: The relationship is from jurisdiction to bubble, so we'll update the jurisdiction instead
                // For now, we'll just create the bubble without the relation
                // The relation can be set up from the jurisdiction side if needed
            }

            const created = await bubbleService.create({
                data: dataToCreate,
            });

            console.log(`  ✅ Created bubble: ${bubbleData.display_name}`);
            createdBubbles[bubbleData.display_name] = created;
        }

        console.log(`🎉 Successfully seeded ${bubbleSeeds.length} bubbles`);

        // Now update jurisdictions with their bubbles if jurisdictions were provided
        if (jurisdictions) {
            const jurisdictionService = strapi.service(
                "api::jurisdiction.jurisdiction"
            );
            if (jurisdictionService) {
                console.log("🔗 Linking bubbles to jurisdictions...");

                for (const [jurisdictionName, jurisdiction] of Object.entries(
                    jurisdictions
                )) {
                    const relatedBubbles = bubbleSeeds
                        .filter((b) => b.jurisdictionName === jurisdictionName)
                        .map((b) => createdBubbles[b.display_name]?.id)
                        .filter((id) => id);

                    if (relatedBubbles.length > 0) {
                        await jurisdictionService.update(jurisdiction.id, {
                            data: {
                                jurisdiction: relatedBubbles,
                            },
                        });
                        console.log(
                            `  🔗 Linked ${relatedBubbles.length} bubbles to ${jurisdictionName}`
                        );
                    }
                }
            }
        }
    } catch (error) {
        console.error("❌ Error seeding bubbles:", error);
        throw error;
    }

    return createdBubbles;
}
