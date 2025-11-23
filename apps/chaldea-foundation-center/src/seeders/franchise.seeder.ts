/**
 * Franchise Seeder
 * Seeds the P - Franchise content type with sample data
 */

import type { Core } from "@strapi/strapi";

export interface FranchiseData {
    display_name: string;
    position_in_timeline?: number;
    original?: boolean;
    animeName?: string; // For linking to anime
    bubbleName?: string; // For linking to bubble
}

const franchiseSeeds: FranchiseData[] = [
    // One Piece Franchises
    {
        display_name: "One Piece - Main Series",
        position_in_timeline: 1.0,
        original: true,
        animeName: "One Piece",
        bubbleName: "One Piece World",
    },
    {
        display_name: "One Piece Film: Red",
        position_in_timeline: 1.5,
        original: false,
        animeName: "One Piece",
        bubbleName: "One Piece World",
    },

    // Attack on Titan Franchises
    {
        display_name: "Attack on Titan - Season 1",
        position_in_timeline: 1.0,
        original: true,
        animeName: "Attack on Titan",
        bubbleName: "Attack on Titan Walled World",
    },
    {
        display_name: "Attack on Titan - Final Season",
        position_in_timeline: 4.0,
        original: false,
        animeName: "Attack on Titan",
        bubbleName: "Attack on Titan Walled World",
    },

    // Death Note Franchise
    {
        display_name: "Death Note - Original Series",
        position_in_timeline: 1.0,
        original: true,
        animeName: "Death Note",
        bubbleName: "Death Note Modern World",
    },

    // Demon Slayer Franchises
    {
        display_name: "Demon Slayer - TV Series",
        position_in_timeline: 1.0,
        original: true,
        animeName: "Demon Slayer: Kimetsu no Yaiba",
        bubbleName: "Seinen Dark Territory",
    },
    {
        display_name: "Demon Slayer - Mugen Train",
        position_in_timeline: 1.5,
        original: false,
        animeName: "Demon Slayer: Kimetsu no Yaiba",
        bubbleName: "Seinen Dark Territory",
    },

    // Fullmetal Alchemist Franchise
    {
        display_name: "Fullmetal Alchemist: Brotherhood",
        position_in_timeline: 1.0,
        original: true,
        animeName: "Fullmetal Alchemist: Brotherhood",
        bubbleName: "Shonen Jump Universe",
    },

    // My Hero Academia Franchises
    {
        display_name: "My Hero Academia - Main Series",
        position_in_timeline: 1.0,
        original: true,
        animeName: "My Hero Academia",
        bubbleName: "My Hero Academia Society",
    },
    {
        display_name: "My Hero Academia - Heroes Rising",
        position_in_timeline: 2.5,
        original: false,
        animeName: "My Hero Academia",
        bubbleName: "My Hero Academia Society",
    },

    // Steins;Gate Franchise
    {
        display_name: "Steins;Gate - Original",
        position_in_timeline: 1.0,
        original: true,
        animeName: "Steins;Gate",
        bubbleName: "Seinen Dark Territory",
    },
    {
        display_name: "Steins;Gate 0",
        position_in_timeline: 1.5,
        original: false,
        animeName: "Steins;Gate",
        bubbleName: "Seinen Dark Territory",
    },

    // Cowboy Bebop Franchise
    {
        display_name: "Cowboy Bebop - TV Series",
        position_in_timeline: 1.0,
        original: true,
        animeName: "Cowboy Bebop",
        bubbleName: "Seinen Dark Territory",
    },
    {
        display_name: "Cowboy Bebop: The Movie",
        position_in_timeline: 1.2,
        original: false,
        animeName: "Cowboy Bebop",
        bubbleName: "Seinen Dark Territory",
    },

    // Mob Psycho 100 Franchise
    {
        display_name: "Mob Psycho 100 - Complete Series",
        position_in_timeline: 1.0,
        original: true,
        animeName: "Mob Psycho 100",
        bubbleName: "Shonen Jump Universe",
    },

    // Spy x Family Franchise
    {
        display_name: "Spy x Family - Main Series",
        position_in_timeline: 1.0,
        original: true,
        animeName: "Spy x Family",
        bubbleName: "Shonen Jump Universe",
    },
    {
        display_name: "Spy x Family - Code: White",
        position_in_timeline: 1.5,
        original: false,
        animeName: "Spy x Family",
        bubbleName: "Shonen Jump Universe",
    },
];

export async function seedFranchises(
    strapi: Core.Strapi,
    bubbles?: { [key: string]: any },
    animes?: { [key: string]: any }
): Promise<void> {
    const franchiseService = strapi.service("api::franchise.franchise");
    const bubbleService = strapi.service("api::bubble.bubble");

    if (!franchiseService) {
        console.error("❌ Franchise service not found");
        return;
    }

    try {
        // Check if franchises already exist
        const existingFranchises = await franchiseService.find({
            pagination: {
                limit: 1,
            },
        });

        if (
            existingFranchises.results &&
            existingFranchises.results.length > 0
        ) {
            console.log("ℹ️  Franchises already exist, skipping seed");
            return;
        }

        console.log("🌱 Seeding franchises...");

        // If animes weren't provided, fetch them
        if (!animes) {
            const animeService = strapi.service("api::anime.anime");
            if (animeService) {
                const allAnimes = await animeService.find({
                    pagination: {
                        limit: -1,
                    },
                });

                if (allAnimes.results) {
                    animes = {};
                    allAnimes.results.forEach((anime: any) => {
                        animes![anime.name] = anime;
                    });
                }
            }
        }

        // If bubbles weren't provided, fetch them
        if (!bubbles) {
            if (bubbleService) {
                const allBubbles = await bubbleService.find({
                    pagination: {
                        limit: -1,
                    },
                });

                if (allBubbles.results) {
                    bubbles = {};
                    allBubbles.results.forEach((bubble: any) => {
                        bubbles![bubble.display_name] = bubble;
                    });
                }
            }
        }

        const createdFranchises: any[] = [];

        // Create franchises
        for (const franchiseData of franchiseSeeds) {
            const dataToCreate: any = {
                display_name: franchiseData.display_name,
                position_in_timeline: franchiseData.position_in_timeline,
                original: franchiseData.original,
            };

            // Link to anime if it exists
            if (
                animes &&
                franchiseData.animeName &&
                animes[franchiseData.animeName]
            ) {
                dataToCreate.anime = animes[franchiseData.animeName].id;
            }

            const created = await franchiseService.create({
                data: dataToCreate,
            });

            console.log(
                `  ✅ Created franchise: ${franchiseData.display_name}`
            );

            // Store created franchise with its bubble association for later
            createdFranchises.push({
                ...created,
                bubbleName: franchiseData.bubbleName,
            });
        }

        console.log(
            `🎉 Successfully seeded ${franchiseSeeds.length} franchises`
        );

        // Now update bubbles with their franchises if bubbles were provided
        if (bubbles && bubbleService) {
            console.log("🔗 Linking franchises to bubbles...");

            // Group franchises by bubble
            const franchisesByBubble: { [key: string]: number[] } = {};

            createdFranchises.forEach((franchise) => {
                if (franchise.bubbleName) {
                    if (!franchisesByBubble[franchise.bubbleName]) {
                        franchisesByBubble[franchise.bubbleName] = [];
                    }
                    franchisesByBubble[franchise.bubbleName].push(franchise.id);
                }
            });

            // Update each bubble with its franchises
            for (const [bubbleName, franchiseIds] of Object.entries(
                franchisesByBubble
            )) {
                if (bubbles[bubbleName]) {
                    await bubbleService.update(bubbles[bubbleName].id, {
                        data: {
                            franchises: franchiseIds,
                        },
                    });
                    console.log(
                        `  🔗 Linked ${franchiseIds.length} franchises to ${bubbleName}`
                    );
                }
            }
        }
    } catch (error) {
        console.error("❌ Error seeding franchises:", error);
        throw error;
    }
}
