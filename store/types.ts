export const SortingType = ["A_Z", "Z_A", "LONGEST_AGO", "MOST_RECENT"] as const;

export type SortingType = (typeof SortingType)[number];
