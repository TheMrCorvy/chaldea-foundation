import { Directory } from "@/types/StrapiSDK";

export interface DirectoryLink {
    label: string;
    url: string;
    parent_directory?: string | null;
}

export interface GroupedDirectories {
    [key: string]: DirectoryLink[];
}

const filterDirectoriesWithParents = (
    directories: Directory[]
): Directory[] => {
    return directories.filter((directory) => {
        return directory.parent_directory === null;
    });
};

const sortDirectoriesByLabel = (
    directories: DirectoryLink[]
): DirectoryLink[] => {
    return [...directories].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, {
            numeric: true,
            caseFirst: "lower",
        })
    );
};

const groupDirectoriesByFirstCharacter = (
    directories: DirectoryLink[]
): GroupedDirectories => {
    const grouped: GroupedDirectories = {};

    directories.forEach((directory) => {
        const firstChar = directory.label.charAt(0).toUpperCase();
        if (!grouped[firstChar]) {
            grouped[firstChar] = [];
        }
        grouped[firstChar].push(directory);
    });

    return grouped;
};

const organizedDirectories = (
    directories: DirectoryLink[]
): GroupedDirectories => {
    const sortedDirectories = sortDirectoriesByLabel(directories);
    const groupedDirectories =
        groupDirectoriesByFirstCharacter(sortedDirectories);

    return groupedDirectories;
};

export default organizedDirectories;
export {
    sortDirectoriesByLabel,
    groupDirectoriesByFirstCharacter,
    filterDirectoriesWithParents,
};
