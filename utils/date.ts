import { Temporal } from "@js-temporal/polyfill";
import { isoDateDecoder } from "../decoders/date";
import { IsoDate } from "../types/date";
import * as Locale from "expo-localization";
import TimeAgo, { Style } from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import de from "javascript-time-ago/locale/de";

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
export const getDate = (date?: IsoDate, language?: "en" | "de", dateStyle?: "short" | "medium" | "long") => {
    if (!date) {
        return "";
    }
    return Temporal.PlainDate.from(date).toLocaleString(language ?? Locale.locale, {
        dateStyle: dateStyle ?? "medium",
    });
};

TimeAgo.addLocale(en);
TimeAgo.addLocale(de);

const formatStyle: Style = {
    labels: "long",
    steps: [
        { formatAs: "now", minTime: 0 },
        { formatAs: "second", minTime: 20 },
        { formatAs: "minute", minTime: 60 },
        { formatAs: "day", minTime: 60 * 60 },
        { formatAs: "month", minTime: 60 * 60 * 24 * 30 },
        { formatAs: "year", minTime: 60 * 60 * 24 * 365 },
    ],
};
export const getSinceDate = (date?: IsoDate, language?: "en" | "de") => {
    if (!date) {
        return "";
    }

    const timeAgo = new TimeAgo(language ?? Locale.locale);
    const dateMilli = Temporal.Instant.from(`${date}T00:00+00:00`).epochMilliseconds;
    const now = Temporal.Now.instant().epochMilliseconds;
    const duration = now - (now - dateMilli);
    return timeAgo.format(duration, formatStyle);
};

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
