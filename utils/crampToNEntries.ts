export function crampToNEntries<T extends Array<unknown>>(n: number, entries: T): T {
    if (entries.length > n) {
        return entries.slice(-n) as T;
    }
    return entries;
}
