import path from "path";

export default function toPosixPath(filePath: string) {
    return filePath.split(path.sep).join("/");
}
