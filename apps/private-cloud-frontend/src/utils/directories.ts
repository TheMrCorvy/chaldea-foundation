import { AdultContentType, Directory } from "@repo/type-definitions";

export interface DirectoryLink {
    label: string;
    url: string;
    parent_directory?: string | null;
    age_rating?: AdultContentType;
}

export interface GroupedDirectories {
    [key: string]: DirectoryLink[];
}

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

const organizedDirectories = (directories: Directory[]): GroupedDirectories => {
    const links: DirectoryLink[] = directories.map((dir) => ({
        label: dir.display_name,
        url: dir.documentId,
        parent_directory: dir.parent_directory?.documentId || null,
        age_rating: dir.age_rating as AdultContentType,
    }));

    const sortedDirectories = sortDirectoriesByLabel(links);
    const groupedDirectories =
        groupDirectoriesByFirstCharacter(sortedDirectories);

    return groupedDirectories;
};

export default organizedDirectories;
