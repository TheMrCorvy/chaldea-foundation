try {
    const husky = (await import("husky")).default;

    console.log(husky());
} catch (error) {
    if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ERR_MODULE_NOT_FOUND"
    ) {
        process.exit(0);
    }

    throw error;
}
