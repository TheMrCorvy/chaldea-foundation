import path from "path";

export const CONFIG_FILE_PATH = path.resolve(
    __dirname,
    "..",
    "..",
    "config",
    "config.ts"
);
export const BACKUP_IDS_FILE_PATH = path.resolve(
    __dirname,
    "..",
    "..",
    "specs",
    "backupIds.json"
);

export const IGNORED_DIRECTORIES = new Set([
    ".git",
    ".turbo",
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage",
]);
