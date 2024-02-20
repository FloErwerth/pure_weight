import { Temporal } from "@js-temporal/polyfill";
import { isoDateDecoder } from "../decoders/date";
import { IsoDate } from "../types/date";
import * as Locale from "expo-localization";

export const getDateTodayIso = (): IsoDate => {
    const now = Temporal.Now.plainDateISO().toString();
    return isoDateDecoder.parse(now);
};

export function getMonthDiff(d1: Date, d2: Date) {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}
export const getIsoDate = (timestamp: number | string) => {
    const convertedTimestamp = typeof timestamp === "string" ? parseInt(timestamp) : timestamp;
    return Temporal.Instant.fromEpochMilliseconds(convertedTimestamp).toString().split("T")[0] as IsoDate;
};

export const getLocaleDate = (date: IsoDate, language?: "en" | "de", options?: Intl.DateTimeFormatOptions) => {
    return Temporal.PlainDate.from(date).toLocaleString(language ?? Locale.locale, options);
};

export const convertDate = {
    toIsoDate: (date?: Date) => {
        if (!date) {
            return getDateTodayIso();
        }
        return Temporal.Instant.from(date.toISOString()).toString().split("T")[0] as IsoDate;
    },
    toDate: (isoDate: IsoDate) => {
        return new Date(isoDate);
    },
    toTemporal: (isoDate: IsoDate) => {
        return Temporal.PlainDate.from(isoDate);
    },
};

export const getMonth = (date?: IsoDate) => {
    if (!date) {
        return -1;
    } else {
        return Temporal.PlainDate.from(date).month;
    }
};

export const getEpochMilliseconds = (date: IsoDate) => {
    return Temporal.Instant.from(`${date}T00:00+00:00`).epochMilliseconds;
};
