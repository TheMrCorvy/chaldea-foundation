import { AdultContentType } from '@repo/type-definitions';

export const PREFIXES = {
    ADULTS: '! ',
    EXPLICIT: '* ',
} as const;

export function hasPrefix(name: string): boolean {
    if (name.startsWith(PREFIXES.ADULTS)) {
        return true;
    }

    if (name.startsWith(PREFIXES.EXPLICIT)) {
        return true;
    }

    return false;
}

export interface HasSpecificPrefixParams {
    name: string;
    prefix: (typeof PREFIXES)[keyof typeof PREFIXES];
}

export type HasSpecificPrefix = (params: HasSpecificPrefixParams) => boolean;

export const hasSpecificPrefix: HasSpecificPrefix = ({ name, prefix }) => {
    return name.startsWith(prefix);
};

export function cleanName(name: string): string {
    if (name.startsWith(PREFIXES.ADULTS)) {
        return name.slice(PREFIXES.ADULTS.length);
    }

    if (name.startsWith(PREFIXES.EXPLICIT)) {
        return name.slice(PREFIXES.EXPLICIT.length);
    }

    return name;
}

export const determineAgeRating = (name: string): AdultContentType => {
    if (hasSpecificPrefix({ name, prefix: PREFIXES.ADULTS })) return 'adults';

    if (hasSpecificPrefix({ name, prefix: PREFIXES.EXPLICIT })) return 'explicit';

    return 'everyone';
};
