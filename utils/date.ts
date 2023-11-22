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
export const getDate = (date?: IsoDate, language?: "en" | "de", dateStyle?: "short" | "medium" | "long") => {
  if (!date) {
    return "";
  }
  return Temporal.PlainDate.from(date).toLocaleString(language ?? Locale.locale, {
    dateStyle: dateStyle ?? "medium",
  });
};
