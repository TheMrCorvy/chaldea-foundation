import fs from 'fs';
import path from 'path';
import { LocalDirectory } from '../utils/typesDefinition';

interface ScanSingleFolderParams {
    dirPath: string;
    excludedParents: string[];
    excludeSubDirectories?: boolean;
    secureBasePath: string;
}

export const scanSingleFolder = ({
    dirPath,
    excludedParents,
    excludeSubDirectories = false,
    secureBasePath,
}: ScanSingleFolderParams): LocalDirectory => {
    const items = fs.readdirSync(secureBasePath + dirPath, { withFileTypes: true });

    const folderIsAdult = determineIfFolderIsAdult(path.basename(dirPath));
    const displayName = !folderIsAdult ? path.basename(dirPath) : removeAsteriskFromFolderName(path.basename(dirPath));
    const parentPath = getParentDirectoryPath(dirPath, excludedParents);

    if (parentPath === null) {
        throw new Error('Something went wrong when analyzing the parent of the directory ' + displayName);
    }

    const result: LocalDirectory = {
        display_name: displayName,
        directory_path: removeBasePath(secureBasePath, dirPath),
        adult: folderIsAdult,
        parent_directory: parentPath,
        sub_directories: [],
        episodes: [],
    };

    for (const item of items) {
        if (item.isDirectory() && !excludeSubDirectories) {
            result.sub_directories.push(path.join(dirPath, item.name));
        } else if (item.isFile() && !fileShouldBeIgnored(item.name)) {
            result.episodes.push({
                display_name: path.basename(item.name, path.extname(item.name)),
                parent_directory: removeBasePath(secureBasePath, dirPath),
                file_type: path.extname(item.name),
            });
        }
    }

    return result;
};

const removeBasePath = (secureBasePath: string, completePath: string): string => {
    if (completePath.startsWith(secureBasePath)) {
        return completePath.slice(secureBasePath.length);
    }

    return completePath;
};

const removeAsteriskFromFolderName = (folderName: string): string => {
    return folderName.startsWith('* ') ? folderName.slice(2) : folderName;
};

const fileShouldBeIgnored = (fileName: string): boolean => {
    const ignoredPrefixes = ['.', '._', 'Thumbs.db', 'desktop.ini'];
    const ignoredSuffixes = [
        '.nfo',
        '.txt',
        '.db',
        '.rar',
        '.zip',
        '.ini',
        '.ds_store',
        '.lnk',
        '.url',
        '.json',
        '.xml',
        '.exe',
        '.bat',
        '.cmd',
    ];

    if (ignoredSuffixes.some(suffix => fileName.endsWith(suffix))) {
        return true;
    }

    return ignoredPrefixes.some(prefix => fileName.startsWith(prefix));
};

const determineIfFolderIsAdult = (folderName: string): boolean => {
    return folderName.split(' ')[0] === '*'; // "*" at the beggining of the folder name indicates adult content
};

const getParentDirectoryPath = (directoryPath: string, excludedParents: string[]): string | null => {
    const parts = directoryPath.split('/');
    parts.pop();

    if (excludedParents.includes(parts[parts.length - 1])) {
        parts.pop();
        return parts.length > 0 ? parts.join('/') : null;
    }

    return parts.join('/');
};

interface JsonFileParams {
    outputFolderPath: string;
    data: unknown[];
    fileName: string;
}

export const writeJsonFile = ({ outputFolderPath, data, fileName }: JsonFileParams): void => {
    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath, { recursive: true });
    }

    const fullFolderPath = path.resolve(outputFolderPath);

    if (!fs.existsSync(fullFolderPath)) {
        fs.mkdirSync(fullFolderPath, { recursive: true });
    }

    const jsonPath = path.join(fullFolderPath, fileName + '.json');
    fs.writeFileSync(jsonPath, JSON.stringify({ amount_of_items: data.length, data: data }), 'utf-8');

    console.log(`✔ JSON written to: ${jsonPath}`);
    console.log(' ');
};
