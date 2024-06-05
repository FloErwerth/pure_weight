import { Temporal } from "@js-temporal/polyfill";
import { isoDateDecoder } from "../decoders/date";
import { IsoDate } from "../types/date";
import * as Locale from "expo-localization";

export const getDateTodayIso = (): IsoDate => {
    const now = Temporal.Now.plainDateISO().toString();
    return isoDateDecoder.parse(now);
};

export const getLocaleDate = (date?: IsoDate, language?: "en" | "de", options?: Intl.DateTimeFormatOptions) => {
    if (!date) {
        return undefined;
    }
    return Temporal.PlainDate.from(date).toLocaleString(language ?? Locale.locale, options);
};

export const convertDate = {
    toDate: (isoDate: IsoDate) => {
        return new Date(isoDate);
    },
    toTemporal: (isoDate: IsoDate) => {
        return Temporal.PlainDate.from(isoDate);
    },
};

export const getMonthYearLabel = (date: IsoDate) => {
    return Temporal.PlainDate.from(date).toLocaleString(Locale.locale, { month: "long", year: "numeric" });
};
