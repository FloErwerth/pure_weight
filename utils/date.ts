import { Temporal } from "@js-temporal/polyfill";
import { isoDateDecoder } from "../decoders/date";
import { IsoDate } from "../types/date";

export const getDateTodayIso = (): IsoDate => {
  const now = Temporal.Now.plainDateISO().toString();
  return isoDateDecoder.parse(now);
};
