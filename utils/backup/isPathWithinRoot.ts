import path from "path";

export default function isPathWithinRoot(
    candidatePath: string,
    rootPath: string
): boolean {
    const relativePath = path.relative(rootPath, candidatePath);

    if (relativePath === "") {
        return true;
    }

    if (relativePath.startsWith("..")) {
        return false;
    }

    if (path.isAbsolute(relativePath)) {
        return false;
    }

    return true;
}
