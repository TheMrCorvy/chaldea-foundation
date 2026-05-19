/* global __dirname, console, module, process, require */
/* eslint-disable @typescript-eslint/no-require-imports */
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

const DRIVE_BACKUP_ROOT = "/chaldea foundation";

let backupMemory = [];

function toPosixPath(filePath) {
    return filePath.split(path.sep).join("/");
}

function buildBackupEntry(absolutePath, rootPath) {
    const relativePath = path.relative(rootPath, absolutePath);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        throw new Error(
            `Cannot create backup entry outside monorepo root: ${absolutePath}`
        );
    }

    const normalizedRelativePath = toPosixPath(relativePath);
    const destinationPath = `${DRIVE_BACKUP_ROOT}/${normalizedRelativePath}`;

    return {
        absolutePath,
        relativePath: normalizedRelativePath,
        destinationPath,
    };
}

async function loadUploadFunction() {
    const remoteStorage = await import("@repo/remote-storage");

    if (typeof remoteStorage.upload !== "function") {
        throw new Error(
            'The package "@repo/remote-storage" does not export upload().'
        );
    }

    return remoteStorage.upload;
}

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

    const sortedFiles = collectedFiles.sort((a, b) => a.localeCompare(b));

    backupMemory = sortedFiles.map((absolutePath) => {
        return buildBackupEntry(absolutePath, rootPath);
    });

    return [...backupMemory];
}

async function upload(rootPath = path.resolve(__dirname, "..")) {
    const files = await backup(rootPath);
    const uploadFile = await loadUploadFunction();
    const uploadResults = [];

    for (const file of files) {
        const result = await uploadFile({
            localPath: file.absolutePath,
            destinationPath: file.destinationPath,
            metadata: {
                relativePath: file.relativePath,
            },
        });

        uploadResults.push({
            ...file,
            fileId: result.file.id,
            checksum: result.checksum,
        });
    }

    return uploadResults;
}

function getBackupMemory() {
    return [...backupMemory];
}

module.exports = {
    backup,
    upload,
    getBackupMemory,
};

if (require.main === module) {
    upload()
        .then((files) => {
            console.log(`Uploaded ${files.length} .env file(s):`);
            for (const file of files) {
                console.log(
                    `${file.relativePath} -> ${file.destinationPath} (id: ${file.fileId})`
                );
            }
        })
        .catch((error) => {
            console.error("Backup scan failed:", error);
            process.exitCode = 1;
        });
}
