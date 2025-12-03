const fs = require("fs");
const path = require("path");

const servicesDir = path.join(
    __dirname,
    "../packages/platform-service-sdk/generated-sdk/services"
);
const importStatement = `import type { QueryParams, PaginationQuery } from "@repo/type-definitions";\n`;

console.log("🚀 Patching SDK types...");

// Get all the generated service files
fs.readdirSync(servicesDir).forEach((file) => {
    if (path.extname(file) === ".ts") {
        const filePath = path.join(servicesDir, file);
        let content = fs.readFileSync(filePath, "utf8");

        // 1. Replace the generic types with our custom, detailed types
        const updatedContent = content
            .replace(/filters\?: Record<string, any>/g, "filters?: QueryParams")
            .replace(
                /pagination\?: \([\s\S]*?\)\)/g,
                "pagination?: PaginationQuery"
            );

        // 2. Only add the import statement if we actually made replacements
        const typesWereReplaced = updatedContent !== content;
        if (typesWereReplaced && !content.includes(importStatement)) {
            content = importStatement + updatedContent;
        } else {
            content = updatedContent;
        }

        // 3. Write the changes back to the file
        fs.writeFileSync(filePath, content);
        if (typesWereReplaced) {
            console.log(`✅ Patched types in ${file}`);
        }
    }
});

console.log("🎉 SDK patching complete!");

// 4. Patch OpenAPI.ts to use environment variable for BASE URL
const openApiPath = path.join(
    __dirname,
    "../packages/platform-service-sdk/generated-sdk/core/OpenAPI.ts"
);

let openApiContent = fs.readFileSync(openApiPath, "utf8");
openApiContent = openApiContent.replace(
    /BASE: '',/,
    "BASE: process.env.STRAPI_BASE_URL || 'http://localhost:1337/api',"
);
fs.writeFileSync(openApiPath, openApiContent);
console.log("✅ Patched OpenAPI BASE URL configuration");
