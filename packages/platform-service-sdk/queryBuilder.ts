import qs from "qs";

export const queryBuilder = (params: Record<string, unknown>): string => {
    return qs.stringify(params);
};
