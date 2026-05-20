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

const CONFIG_FILE_PATH = path.resolve(__dirname, "..", "config", "config.ts");
const BACKUP_IDS_FILE_PATH = path.resolve(
    __dirname,
    "..",
    "specs",
    "backupIds.json"
);

let backupMemory = [];

function toPosixPath(filePath) {
    return filePath.split(path.sep).join("/");
}

function readDriveBackupRootFromConfig() {
    try {
        const configContent = fs.readFileSync(CONFIG_FILE_PATH, "utf8");
        let match = configContent.match(
            /^\s*export\s+const\s+DRIVE_ROOT_FOLDER\s*=\s*["']([^"']+)["']\s*;?/m
        );

        if (!match) {
            match = configContent.match(
                /^\s*export\s+const\s+DRIVE_BACKUP_ROOT\s*=\s*["']([^"']+)["']\s*;?/m
            );
        }

        if (!match) {
            return null;
        }

        const configuredPath = match[1].trim();
        return configuredPath || null;
    } catch {
        return null;
    }
}

function resolveDriveBackupRoot(rootPath) {
    const configuredRoot = readDriveBackupRootFromConfig();

    if (configuredRoot) {
        if (configuredRoot.startsWith("/")) {
            return configuredRoot;
        }

        return `/${configuredRoot}`;
    }

    const repositoryName = path.basename(path.resolve(rootPath));
    return `/${repositoryName}`;
}

function buildBackupEntry(absolutePath, rootPath, driveBackupRoot) {
    const relativePath = path.relative(rootPath, absolutePath);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        throw new Error(
            `Cannot create backup entry outside monorepo root: ${absolutePath}`
        );
    }

    const normalizedRelativePath = toPosixPath(relativePath);
    const destinationPath = `${driveBackupRoot}/${normalizedRelativePath}`;

    return {
        absolutePath,
        relativePath: normalizedRelativePath,
        destinationPath,
    };
}

async function loadStorageFunctions() {
    const remoteStorage = await import("@repo/remote-storage");
    let upload = null;
    let overwrite = null;

    if (typeof remoteStorage.upload === "function") {
        upload = remoteStorage.upload;
    }

    if (typeof remoteStorage.overwrite === "function") {
        overwrite = remoteStorage.overwrite;
    }

    if (remoteStorage.default) {
        if (!upload && typeof remoteStorage.default.upload === "function") {
            upload = remoteStorage.default.upload;
        }

        if (
            !overwrite &&
            typeof remoteStorage.default.overwrite === "function"
        ) {
            overwrite = remoteStorage.default.overwrite;
        }
    }

    if (!upload) {
        throw new Error(
            'The package "@repo/remote-storage" does not export upload().'
        );
    }

    if (!overwrite) {
        throw new Error(
            'The package "@repo/remote-storage" does not export overwrite().'
        );
    }

    return {
        upload,
        overwrite,
    };
}

function shouldBackupFile(fileName) {
    if (
        fileName.includes(".example") ||
        fileName.includes(".sample") ||
        fileName.includes(".template")
    ) {
        return false;
    }
    return (
        fileName === ".env" ||
        fileName.startsWith(".env.") ||
        fileName === "config.ts"
    );
}

function createEmptyBackupIdsIndex() {
    return {
        backupIds: [],
    };
}

async function ensureBackupIdsFile() {
    const parentDirectory = path.dirname(BACKUP_IDS_FILE_PATH);
    await fs.promises.mkdir(parentDirectory, { recursive: true });

    const exists = await fs.promises
        .access(BACKUP_IDS_FILE_PATH, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

    if (exists) {
        return;
    }

    const initialContent = JSON.stringify(createEmptyBackupIdsIndex(), null, 4);
    await fs.promises.writeFile(BACKUP_IDS_FILE_PATH, `${initialContent}\n`);
}

async function readBackupIdsIndex() {
    await ensureBackupIdsFile();

    try {
        const content = await fs.promises.readFile(
            BACKUP_IDS_FILE_PATH,
            "utf8"
        );
        const parsed = JSON.parse(content);

        if (!parsed || typeof parsed !== "object") {
            return createEmptyBackupIdsIndex();
        }

        if (!Array.isArray(parsed.backupIds)) {
            return createEmptyBackupIdsIndex();
        }

        return parsed;
    } catch {
        return createEmptyBackupIdsIndex();
    }
}

async function writeBackupIdsIndex(index) {
    const content = JSON.stringify(index, null, 4);
    await fs.promises.writeFile(BACKUP_IDS_FILE_PATH, `${content}\n`, "utf8");
}

function findStoredEntry(index, file) {
    for (const entry of index.backupIds) {
        if (!entry || typeof entry !== "object") {
            continue;
        }

        if (entry.relativePath !== file.relativePath) {
            continue;
        }

        if (entry.destinationPath !== file.destinationPath) {
            continue;
        }

        if (!entry.driveId || typeof entry.driveId !== "string") {
            continue;
        }

        return entry;
    }

    return null;
}

function upsertStoredEntry(index, file, driveId) {
    let updated = false;

    for (let i = 0; i < index.backupIds.length; i += 1) {
        const entry = index.backupIds[i];
        if (!entry || typeof entry !== "object") {
            continue;
        }

        if (entry.relativePath !== file.relativePath) {
            continue;
        }

        if (entry.destinationPath !== file.destinationPath) {
            continue;
        }

        index.backupIds[i] = {
            fileName: path.basename(file.absolutePath),
            localPath: file.absolutePath,
            relativePath: file.relativePath,
            driveId,
            destinationPath: file.destinationPath,
        };
        updated = true;
        break;
    }

    if (updated) {
        return;
    }

    index.backupIds.push({
        fileName: path.basename(file.absolutePath),
        localPath: file.absolutePath,
        relativePath: file.relativePath,
        driveId,
        destinationPath: file.destinationPath,
    });
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

        if (stat.isFile() && shouldBackupFile(entry.name)) {
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
    const driveBackupRoot = resolveDriveBackupRoot(rootRealPath);
    const scanContext = {
        rootRealPath,
        visitedRealDirectories: new Set([rootRealPath]),
        seenRealFiles: new Set(),
    };

    await collectEnvFiles(rootPath, collectedFiles, scanContext);

    const sortedFiles = collectedFiles.sort((a, b) => a.localeCompare(b));

    backupMemory = sortedFiles.map((absolutePath) => {
        return buildBackupEntry(absolutePath, rootPath, driveBackupRoot);
    });

    return [...backupMemory];
}

async function upload(rootPath = path.resolve(__dirname, "..")) {
    const files = await backup(rootPath);
    const index = await readBackupIdsIndex();
    const storage = await loadStorageFunctions();
    const uploadResults = [];

    for (const file of files) {
        const storedEntry = findStoredEntry(index, file);
        let result;

        if (storedEntry) {
            try {
                result = await storage.overwrite({
                    file: {
                        id: storedEntry.driveId,
                        metadata: {
                            relativePath: file.relativePath,
                        },
                    },
                    localPath: file.absolutePath,
                    metadata: {
                        relativePath: file.relativePath,
                    },
                });
            } catch {
                result = await storage.upload({
                    localPath: file.absolutePath,
                    destinationPath: file.destinationPath,
                    metadata: {
                        relativePath: file.relativePath,
                    },
                });
            }
        }

        if (!storedEntry) {
            result = await storage.upload({
                localPath: file.absolutePath,
                destinationPath: file.destinationPath,
                metadata: {
                    relativePath: file.relativePath,
                },
            });
        }

        const fileId = result.file.id;
        upsertStoredEntry(index, file, fileId);

        uploadResults.push({
            ...file,
            fileId,
            checksum: result.checksum,
        });
    }

    await writeBackupIdsIndex(index);

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
