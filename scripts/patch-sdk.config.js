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

        // 1. Add the import statement at the top if it's not already there
        if (!content.includes(importStatement)) {
            content = importStatement + content;
        }

        // 2. Replace the generic types with our custom, detailed types
        content = content
            .replace(/filters\?: Record<string, any>/g, "filters?: QueryParams")
            .replace(
                /pagination\?: \([\s\S]*?\)\)/g,
                "pagination?: PaginationQuery"
            );

        // 3. Write the changes back to the file
        fs.writeFileSync(filePath, content);
        console.log(`✅ Patched types in ${file}`);
    }
});

console.log("🎉 SDK patching complete!");
