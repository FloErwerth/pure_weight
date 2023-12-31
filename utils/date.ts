import { Temporal } from "@js-temporal/polyfill";
import { isoDateDecoder } from "../decoders/date";
import { IsoDate } from "../types/date";
import * as Locale from "expo-localization";

export const getDateToday = () => {
    return Temporal.Now.plainDateISO();
};
export const getDateTodayIso = (): IsoDate => {
    const now = Temporal.Now.plainDateISO().toString();
    return isoDateDecoder.parse(now);
};
export const getTitle = (date?: IsoDate, language?: "en" | "de") => {
    if (!date) {
        return "";
    }
    return Temporal.PlainDate.from(date).toLocaleString(language ?? Locale.locale, {
        day: "2-digit",
        month: "long",
        year: undefined,
    });
};

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
