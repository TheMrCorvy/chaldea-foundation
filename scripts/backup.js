const fs = require("fs");
const path = require("path");

const IGNORED_DIRECTORIES = new Set([
    ".git",
    ".turbo",
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage",
]);

let backupMemory = [];

function isEnvFile(fileName) {
    if (
        fileName.includes(".example") ||
        fileName.includes(".sample") ||
        fileName.includes(".template")
    ) {
        return false;
    }
    return fileName === ".env" || fileName.startsWith(".env.");
}

async function collectEnvFiles(directoryPath, collector) {
    const entries = await fs.promises.readdir(directoryPath, {
        withFileTypes: true,
    });

    for (const entry of entries) {
        if (entry.isSymbolicLink()) {
            continue;
        }

        const fullPath = path.resolve(directoryPath, entry.name);

        if (entry.isDirectory()) {
            if (IGNORED_DIRECTORIES.has(entry.name)) {
                continue;
            }

            await collectEnvFiles(fullPath, collector);
            continue;
        }

        if (entry.isFile() && isEnvFile(entry.name)) {
            collector.push(fullPath);
        }
    }
}

async function backup(rootPath = path.resolve(__dirname, "..")) {
    const collectedFiles = [];

    await collectEnvFiles(rootPath, collectedFiles);

    backupMemory = collectedFiles.sort((a, b) => a.localeCompare(b));

    return [...backupMemory];
}

function getBackupMemory() {
    return [...backupMemory];
}

module.exports = {
    backup,
    getBackupMemory,
};

if (require.main === module) {
    backup()
        .then((files) => {
            console.log(`Found ${files.length} .env file(s):`);
            for (const filePath of files) {
                console.log(filePath);
            }
        })
        .catch((error) => {
            console.error("Backup scan failed:", error);
            process.exitCode = 1;
        });
}
