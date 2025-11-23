/**
 * Anime Seeder
 * Seeds the P - Animes content type with sample data
 */

import type { Core } from "@strapi/strapi";

export interface AnimeData {
    position?: number;
    name: string;
    date?: string;
    description?: string;
    has_conclusion?: boolean;
}

const animeSeeds: AnimeData[] = [
    {
        position: 1,
        name: "Steins;Gate",
        date: "2011",
        description:
            "A gripping sci-fi thriller about time travel, featuring a self-proclaimed mad scientist who accidentally discovers a method to send messages to the past, leading to unforeseen consequences.",
        has_conclusion: true,
    },
    {
        position: 2,
        name: "Attack on Titan",
        date: "2013-2023",
        description:
            "Humanity's desperate struggle for survival against giant humanoid Titans that have forced them to live behind enormous walls. The story follows Eren Yeager and his friends as they join the military to fight back.",
        has_conclusion: true,
    },
    {
        position: 3,
        name: "Death Note",
        date: "2006-2007",
        description:
            "A psychological thriller following Light Yagami, a high school genius who discovers a supernatural notebook that allows him to kill anyone by writing their name, leading to a cat-and-mouse game with detective L.",
        has_conclusion: true,
    },
    {
        position: 4,
        name: "Demon Slayer: Kimetsu no Yaiba",
        date: "2019-present",
        description:
            "Set in Taisho-era Japan, it follows Tanjiro Kamado's quest to cure his demon-turned sister and avenge his family, while training as a demon slayer in a world where demons prey on humans at night.",
        has_conclusion: false,
    },
    {
        position: 5,
        name: "One Piece",
        date: "1999-present",
        description:
            "The epic adventure of Monkey D. Luffy, a young pirate with rubber powers who sets out to find the legendary One Piece treasure and become the Pirate King, gathering a diverse crew along the way.",
        has_conclusion: false,
    },
    {
        position: 6,
        name: "Fullmetal Alchemist: Brotherhood",
        date: "2009-2010",
        description:
            "Two brothers use alchemy in their quest to restore their bodies after a failed attempt to resurrect their mother. Their journey reveals a vast conspiracy that threatens the entire nation.",
        has_conclusion: true,
    },
    {
        position: 7,
        name: "My Hero Academia",
        date: "2016-present",
        description:
            "In a world where most people have superpowers called 'Quirks', Izuku Midoriya, born without powers, still dreams of becoming a hero and enrolls in the prestigious hero academy U.A. High School.",
        has_conclusion: false,
    },
    {
        position: 8,
        name: "Cowboy Bebop",
        date: "1998-1999",
        description:
            "A space western following the adventures of bounty hunter Spike Spiegel and his crew aboard the spaceship Bebop, blending noir, jazz, and philosophical themes in a futuristic setting.",
        has_conclusion: true,
    },
    {
        position: 9,
        name: "Mob Psycho 100",
        date: "2016-2022",
        description:
            "Shigeo 'Mob' Kageyama, an awkward middle schooler with immense psychic powers, tries to live a normal life while working for a con-artist spirit medium and dealing with supernatural threats.",
        has_conclusion: true,
    },
    {
        position: 10,
        name: "Spy x Family",
        date: "2022-present",
        description:
            "A master spy must build a fake family to infiltrate an elite school. Unknown to him, his adopted daughter is a telepath and his wife is an assassin, creating a comedic and heartwarming dynamic.",
        has_conclusion: false,
    },
];

export async function seedAnimes(strapi: Core.Strapi): Promise<void> {
    const animeService = strapi.service("api::anime.anime");

    if (!animeService) {
        console.error("❌ Anime service not found");
        return;
    }

    try {
        // Check if animes already exist
        const existingAnimes = await animeService.find({
            pagination: {
                limit: 1,
            },
        });

        if (existingAnimes.results && existingAnimes.results.length > 0) {
            console.log("ℹ️  Animes already exist, skipping seed");
            return;
        }

        console.log("🌱 Seeding animes...");

        // Create animes
        for (const animeData of animeSeeds) {
            await animeService.create({
                data: animeData,
            });
            console.log(`  ✅ Created anime: ${animeData.name}`);
        }

        console.log(`🎉 Successfully seeded ${animeSeeds.length} animes`);
    } catch (error) {
        console.error("❌ Error seeding animes:", error);
        throw error;
    }
}
