import { Temporal } from "@js-temporal/polyfill";
import { isoDateDecoder } from "../decoders/date";
import { IsoDate } from "../types/date";

export const getDateTodayIso = (): IsoDate => {
  const now = Temporal.Now.plainDateISO().toString();
  return isoDateDecoder.parse(now);
};

export const getUsDate = (date: IsoDate) => {
  if (!date) {
    return "";
  }
  return Temporal.PlainDate.from(date).toLocaleString("en-US", { dateStyle: "short" });
};
