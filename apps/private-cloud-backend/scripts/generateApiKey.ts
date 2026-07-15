import dotenv from 'dotenv';
import { generateApiKeyWithPrefix } from '../src/services/apiKey.service';
import { getPrisma, disconnect } from '../src/database/connection';
import { HttpMethod } from '@prisma/client';

dotenv.config();

const main = async (): Promise<void> => {
    try {
        const args = process.argv.slice(2);

        let name = '';
        let prefix = 'apc_';
        const permissions: { method: HttpMethod; route: string }[] = [];
        let expiresAt: Date | null = null;

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (arg === '--name' && i + 1 < args.length) {
                name = args[++i];
            } else if (arg === '--prefix' && i + 1 < args.length) {
                prefix = args[++i];
            } else if (arg === '--expires' && i + 1 < args.length) {
                const val = args[++i];
                if (val.endsWith('d')) {
                    const days = parseInt(val.slice(0, -1), 10);
                    if (!isNaN(days)) {
                        expiresAt = new Date();
                        expiresAt.setDate(expiresAt.getDate() + days);
                    }
                } else {
                    expiresAt = new Date(val);
                }
            } else if (arg === '--permissions') {
                while (i + 1 < args.length && !args[i + 1].startsWith('--')) {
                    const item = args[++i];
                    const colonIndex = item.indexOf(':');
                    if (colonIndex === -1) {
                        throw new Error(
                            `Invalid permission format: "${item}". Expected METHOD:route (e.g. GET:/api/v2/serve-episode)`
                        );
                    }
                    const methodStr = item.slice(0, colonIndex).toUpperCase();
                    const route = item.slice(colonIndex + 1);
                    if (!Object.values(HttpMethod).includes(methodStr as HttpMethod)) {
                        throw new Error(
                            `Invalid HTTP method: "${methodStr}". Valid methods: ${Object.values(HttpMethod).join(', ')}`
                        );
                    }
                    permissions.push({ method: methodStr as HttpMethod, route });
                }
            }
        }

        if (!name) {
            console.error('❌ Error: --name <name> is required.');
            console.log('\nUsage:');
            console.log(
                '  pnpm api-key:generate --name "App Name" [--prefix "apc_"] [--expires 90d] [--permissions GET:/api/v1/route POST:/api/v2/route]'
            );
            process.exit(1);
        }

        if (permissions.length === 0) {
            console.error('❌ Error: At least one permission is required via --permissions.');
            process.exit(1);
        }

        console.log('🔑 Generating API Key...\n');
        const apiKey = await generateApiKeyWithPrefix(prefix, 32);

        const prisma = getPrisma();

        await prisma.apiKey.create({
            data: {
                name,
                key_prefix: prefix,
                hash: apiKey.hash,
                expires_at: expiresAt,
                permissions: {
                    create: permissions.map(p => ({
                        method: p.method,
                        route: p.route,
                    })),
                },
            },
        });

        console.log('✅ API Key created and stored successfully!\n');
        console.log('📋 Details:');
        console.log(`   Name:        ${name}`);
        console.log(`   Prefix:      ${prefix}`);
        console.log(`   Expires:     ${expiresAt ? expiresAt.toISOString() : 'Never'}`);
        console.log(`   Created:     ${apiKey.createdAt.toISOString()}`);
        console.log('\n🔐 Permissions:');
        permissions.forEach(p => console.log(`   - ${p.method}: ${p.route}`));
        console.log('\n⚠️  Important:');
        console.log(`   - Raw Key:   ${apiKey.key}`);
        console.log('   - Save this key in a safe place');
        console.log('   - The key CANNOT be recovered once lost\n');
    } catch (error) {
        console.error('❌ Error generating or storing the API key:', error);
        process.exit(1);
    } finally {
        await disconnect();
    }
};

if (require.main === module) {
    main().catch(err => {
        console.error(err);
        process.exit(1);
    });
}
