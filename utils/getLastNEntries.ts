export function getLastNEntries<T extends Array<unknown>>(entries: T, n?: number): T {
    if (!n) {
        return entries;
    }
    if (entries.length > n) {
        return entries.slice(-n) as T;
    }
    return entries;
}
