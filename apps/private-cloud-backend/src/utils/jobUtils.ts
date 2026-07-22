export const parseTimeOption = (option: string): number => {
    const minutes = parseInt(option, 10);

    if (isNaN(minutes) || !option.endsWith('min')) {
        throw new Error(`Invalid time option: ${option}`);
    }

    return minutes * 60 * 1000;
};
