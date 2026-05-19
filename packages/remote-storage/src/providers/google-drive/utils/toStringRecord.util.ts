export function toStringRecord(
    record: Record<string, unknown>
): Record<string, string> {
    return Object.fromEntries(
        Object.entries(record).map(([key, value]) => [key, String(value)])
    );
}
