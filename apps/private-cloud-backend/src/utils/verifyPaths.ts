import path from 'path';

const verifyPaths = (...paths: string[]): string | false => {
    const fullPath = path.join(...paths);
    const resolvedPath = path.resolve(fullPath);

    if (!resolvedPath) {
        return false;
    }

    return fullPath;
};

export default verifyPaths;
