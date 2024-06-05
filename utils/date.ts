import { Temporal } from "@js-temporal/polyfill";
import { IsoDate } from "../types/date";
import * as Locale from "expo-localization";
import { z } from "zod/lib";

const isoDateRegex = new RegExp("^(\\d{4})-(\\d{2})-(\\d{2})");

const isoDateDecoder = z
    .string()
    .regex(isoDateRegex)
    .transform((date) => date as IsoDate);

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
