import { Temporal } from "@js-temporal/polyfill";
import { isoDateDecoder } from "../decoders/date";
import { IsoDate } from "../types/date";
import * as Locale from "expo-localization";

export const getDateTodayIso = (): IsoDate => {
  const now = Temporal.Now.plainDateISO().toString();
  return isoDateDecoder.parse(now);
};

export const getDate = (date: IsoDate) => {
  if (!date) {
    return "";
  }
  return Temporal.PlainDate.from(date).toLocaleString(Locale.locale, { dateStyle: "short" });
};
