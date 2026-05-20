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

    if (typeof remoteStorage.upload === "function") {
        return remoteStorage.upload;
    }

    if (
        remoteStorage.default &&
        typeof remoteStorage.default.upload === "function"
    ) {
        return remoteStorage.default.upload;
    }

    throw new Error(
        'The package "@repo/remote-storage" does not export upload().'
    );
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

function isPathWithinRoot(candidatePath, rootPath) {
    const relativePath = path.relative(rootPath, candidatePath);
    return (
        relativePath === "" ||
        (!relativePath.startsWith("..") && !path.isAbsolute(relativePath))
    );
}

async function collectEnvFiles(directoryPath, collector, scanContext) {
    const entries = await fs.promises.readdir(directoryPath, {
        withFileTypes: true,
    });

    for (const entry of entries) {
        const fullPath = path.resolve(directoryPath, entry.name);
        const realPath = await fs.promises.realpath(fullPath).catch(() => null);

        if (
            !realPath ||
            !isPathWithinRoot(realPath, scanContext.rootRealPath)
        ) {
            continue;
        }

        const stat = await fs.promises.stat(fullPath).catch(() => null);

        if (!stat) {
            continue;
        }

        if (stat.isDirectory()) {
            if (IGNORED_DIRECTORIES.has(entry.name)) {
                continue;
            }

            if (scanContext.visitedRealDirectories.has(realPath)) {
                continue;
            }

            scanContext.visitedRealDirectories.add(realPath);

            await collectEnvFiles(fullPath, collector, scanContext);
            continue;
        }

        if (stat.isFile() && isEnvFile(entry.name)) {
            if (scanContext.seenRealFiles.has(realPath)) {
                continue;
            }

            scanContext.seenRealFiles.add(realPath);
            collector.push(fullPath);
        }
    }
}

async function backup(rootPath = path.resolve(__dirname, "..")) {
    const collectedFiles = [];
    const rootRealPath = await fs.promises.realpath(rootPath);
    const scanContext = {
        rootRealPath,
        visitedRealDirectories: new Set([rootRealPath]),
        seenRealFiles: new Set(),
    };

    await collectEnvFiles(rootPath, collectedFiles, scanContext);

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
