import { v4 } from "uuid";

export const generateId = () => {
    return v4();
};

export const stringIsEmpty = (str: string) => {
    return (
        str === null ||
        !str ||
        str.match(/^ *$/) !== null ||
        str.trim().length === 0
    );
};

export const printTimeStamp = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} - ${hours}:${minutes}:${seconds}`;
};

export const fakeTimeout = async (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Data fetched!");
        }, delay);
    });
};
