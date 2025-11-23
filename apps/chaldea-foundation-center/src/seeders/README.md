# Database Seeders

This directory contains database seeders for the Strapi application. Seeders are used to populate the database with sample/mock data for development and testing purposes.

## 📁 Structure

```
src/seeders/
├── index.ts               # Main seeder orchestrator
├── anime.seeder.ts        # Anime content type seeder
├── jurisdiction.seeder.ts # Jurisdiction (Universe) seeder
├── bubble.seeder.ts       # Bubble seeder with jurisdiction relations
├── franchise.seeder.ts    # Franchise seeder with anime/bubble relations
└── README.md              # This file
```

## 🚀 Usage

### Manual Seeding

You can run seeders manually using npm scripts:

```bash
# Run seeders (skips if data exists)
npm run seed

# Force run seeders (even if data exists)
npm run seed:force

# Clear all data and reseed
npm run seed:reset

# Clear all data without reseeding
npm run seed:clear
```

### Command Line Options

When using the seed script directly:

```bash
# Normal seeding
ts-node scripts/seed.ts

# Force seeding (ignore existing data)
ts-node scripts/seed.ts --force

# Reset database (clear and reseed)
ts-node scripts/seed.ts --reset

# Clear data only
ts-node scripts/seed.ts --clear
```

## 🔧 Configuration

Seeders are configured to run manually only. Use the npm scripts to execute them:

```env
# Set environment (seeders won't run in production by default)
NODE_ENV=development

# The RUN_SEEDERS variable can still be used with the --force flag
# but seeders no longer run automatically on startup
RUN_SEEDERS=false
```

## 📝 Creating New Seeders

To add a new seeder for another content type:

### 1. Create a new seeder file

Create a file following the naming convention: `[content-type].seeder.ts`

```typescript
// src/seeders/category.seeder.ts
import type { Core } from "@strapi/strapi";

export interface CategoryData {
    name: string;
    slug: string;
    description?: string;
}

const categorySeeds: CategoryData[] = [
    {
        name: "Shonen",
        slug: "shonen",
        description: "Action-packed series targeted at young male audiences",
    },
    // Add more sample data...
];

export async function seedCategories(strapi: Core.Strapi): Promise<void> {
    const categoryService = strapi.service("api::category.category");

    if (!categoryService) {
        console.error("❌ Category service not found");
        return;
    }

    try {
        // Check if categories already exist
        const existing = await categoryService.find({
            pagination: { limit: 1 },
        });

        if (existing.results && existing.results.length > 0) {
            console.log("ℹ️  Categories already exist, skipping seed");
            return;
        }

        console.log("🌱 Seeding categories...");

        for (const categoryData of categorySeeds) {
            await categoryService.create({ data: categoryData });
            console.log(`  ✅ Created category: ${categoryData.name}`);
        }

        console.log(
            `🎉 Successfully seeded ${categorySeeds.length} categories`
        );
    } catch (error) {
        console.error("❌ Error seeding categories:", error);
        throw error;
    }
}
```

### 2. Register the seeder

Add your seeder to the main orchestrator in `src/seeders/index.ts`:

```typescript
import { seedCategories } from "./category.seeder";

// In the runSeeders function:
await seedAnimes(strapi);
await seedCategories(strapi); // Add your new seeder here
```

### 3. Update clear data function (optional)

If you want your content type to be cleared during reset operations:

```typescript
// In clearData function, add your content type to the default array
contentTypes: string[] = ['api::anime.anime', 'api::category.category']
```

## 🏗️ Available Seeders

### Anime Seeder (`anime.seeder.ts`)

Seeds the "P - Animes" content type with sample anime data.

**Sample data includes:**

- 10 popular anime titles
- Mix of completed and ongoing series
- Descriptions, dates, and conclusion status

**Fields seeded:**

- `position`: Display order
- `name`: Anime title
- `date`: Release date/period
- `description`: Brief synopsis
- `has_conclusion`: Whether the series has ended

### Jurisdiction Seeder (`jurisdiction.seeder.ts`)

Seeds the "P - Universe" content type representing top-level anime universes.

**Sample data includes:**

- 6 major anime jurisdictions/universes
- Various genre-based universes (Shonen, Seinen, Isekai, etc.)

**Fields seeded:**

- `god_in_charge`: Name of the universe/jurisdiction
- `status`: Active/inactive status
- `description`: Universe description
- Relationships: Has many bubbles

### Bubble Seeder (`bubble.seeder.ts`)

Seeds the "P - Bubble" content type representing worlds within universes.

**Sample data includes:**

- 16 anime worlds/bubbles
- Distributed across different jurisdictions
- Each linked to their parent jurisdiction

**Fields seeded:**

- `display_name`: Name of the bubble/world
- `universe`: Universe identifier number
- `description`: World description
- Relationships: Belongs to jurisdiction, has many franchises

### Franchise Seeder (`franchise.seeder.ts`)

Seeds the "P - Franchise" content type representing anime series/movies.

**Sample data includes:**

- 17 franchise entries
- Links to specific anime and bubbles
- Timeline positioning for series continuity

**Fields seeded:**

- `display_name`: Franchise title
- `position_in_timeline`: Chronological position
- `original`: Whether it's the original series
- Relationships: Has one anime, belongs to bubble

## ⚠️ Important Notes

1. **Production Safety**: Seeders are disabled in production by default. Never run seeders in production unless you fully understand the implications.

2. **Idempotency**: Seeders check for existing data before inserting to avoid duplicates.

3. **Development Only**: The reset functionality (`--reset` flag) is only available in development environment.

4. **Data Loss**: The `--clear` and `--reset` options will DELETE all data in the specified content types. Use with caution.

5. **Order Matters**: Seeders run in the order they're called in `index.ts`. If you have dependencies between content types, ensure they're seeded in the correct order.

6. **Relationship Hierarchy**: The seeding follows this hierarchy:
    - Anime (independent)
    - Jurisdiction (top level)
    - Bubble (linked to Jurisdiction)
    - Franchise (linked to both Anime and Bubble)

## 🐛 Troubleshooting

### Seeders not running

1. Ensure you're using the correct npm script: `npm run seed`
2. Verify you're in development mode (`NODE_ENV=development`)
3. Check the console logs for any error messages
4. For forced seeding, use `npm run seed:force`

### "Service not found" errors

1. Ensure the content type exists and is properly configured
2. Verify the service name follows the pattern: `api::[singular-name].[singular-name]`
3. Check that Strapi has been built after adding new content types

### TypeScript errors

1. Ensure all type imports are correct
2. Run `npm run build` to compile TypeScript files
3. Check that `@strapi/strapi` types are properly installed

## 📚 Additional Resources

- [Strapi Documentation](https://docs.strapi.io)
- [Strapi Services API](https://docs.strapi.io/dev-docs/backend-customization/services)
- [Content Types](https://docs.strapi.io/dev-docs/backend-customization/models)
