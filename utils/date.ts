import { Temporal } from "@js-temporal/polyfill";
import { isoDateDecoder } from "../decoders/date";
import { IsoDate } from "../types/date";
import * as Locale from "expo-localization";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import de from "javascript-time-ago/locale/de";
import { Language } from "../store/reducers/settings/types";

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
export const getDate = (timestamp: number | string, language?: "en" | "de", dateStyle?: "short" | "medium" | "long") => {
    const convertedTimestamp = typeof timestamp === "string" ? parseInt(timestamp) : timestamp;
    return Temporal.Instant.fromEpochMilliseconds(convertedTimestamp).toLocaleString(language ?? Locale.locale, {
        dateStyle: dateStyle ?? "medium",
    }) as IsoDate;
};

TimeAgo.addLocale(en);
TimeAgo.addLocale(de);

export function getSinceDate(timestamp?: number, language?: Language): string {
    if (!timestamp) {
        return "";
    }
    const timeAgo = new TimeAgo(language ?? Locale.locale);
    return timeAgo.format(timestamp);
}

export const getIsoDateFromDate = (date: Date, language?: "en" | "de", dateStyle?: "short" | "medium" | "long") => {
    return Temporal.PlainDate.from(date.toString()).toLocaleString(language ?? Locale.locale, {
        dateStyle: dateStyle ?? "medium",
    }) as IsoDate;
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
