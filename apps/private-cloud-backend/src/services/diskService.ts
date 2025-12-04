import fs from 'fs';
import path from 'path';
import { LocalDirectory } from '../utils/typesDefinition';
import { VideoContainers } from '@repo/type-definitions';

interface ScanSingleFolderParams {
    dirPath: string;
    excludedParents: string[];
    excludeSubDirectories?: boolean;
}

export const scanSingleFolder = ({
    dirPath,
    excludedParents,
    excludeSubDirectories = false,
}: ScanSingleFolderParams): LocalDirectory => {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    const folderIsAdult = determineIfFolderIsAdult(path.basename(dirPath));
    const displayName = !folderIsAdult ? path.basename(dirPath) : removeAsteriskFromFolderName(path.basename(dirPath));
    const parentPath = getParentDirectoryPath(dirPath, excludedParents);

    if (parentPath === null) {
        throw new Error('Something went wrong when analyzing the parent of the directory ' + displayName);
    }

    const result: LocalDirectory = {
        display_name: displayName,
        directory_path: dirPath,
        adult: folderIsAdult,
        parent_directory: parentPath,
        sub_directories: [],
        episodes: [],
    };

    for (const item of items) {
        if (item.isDirectory() && !excludeSubDirectories) {
            result.sub_directories.push(path.join(dirPath, item.name));
        } else if (item.isFile() && !episodeShouldBeIgnored(item.name)) {
            result.episodes.push({
                display_name: path.basename(item.name, path.extname(item.name)),
                parent_directory: dirPath,
                file_type: getFileType(path.extname(item.name)),
            });
        }
    }

    return result;
};

const getFileType = (extension: string): VideoContainers => {
    const withoutDot = extension.toLowerCase().slice(1);
    if (withoutDot === 'mp4' || withoutDot === 'mkv' || withoutDot === 'avi') {
        return withoutDot;
    }

    return '*';
};

const removeAsteriskFromFolderName = (folderName: string): string => {
    return folderName.startsWith('* ') ? folderName.slice(2) : folderName;
};

const episodeShouldBeIgnored = (fileName: string): boolean => {
    const ignoredPrefixes = ['.', '._', 'Thumbs.db', 'desktop.ini'];
    const extension = path.extname(fileName).slice(1);
    return (
        ignoredPrefixes.some(prefix => fileName.startsWith(prefix)) ||
        (extension !== 'mp4' && extension !== 'mkv' && extension !== 'avi')
    );
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
