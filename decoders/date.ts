import { z } from "zod/lib/index";
import { IsoDate } from "../types/date";
import { Temporal } from "@js-temporal/polyfill";

const isoDateRegex = new RegExp("^(\\d{4})-(\\d{2})-(\\d{2})");

export const isoDateDecoder = z
  .string()
  .regex(isoDateRegex)
  .transform((date) => date as IsoDate);

export const getUsDate = (isoDate: IsoDate) => {
  return Temporal.PlainDate.from(isoDate).toLocaleString("en-US");
};
