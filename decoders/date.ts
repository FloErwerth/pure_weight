import { z } from "zod/lib/index";
import { IsoDate } from "../types/date";

const isoDateRegex = new RegExp("^(\\d{4})-(\\d{2})-(\\d{2})");

export const isoDateDecoder = z
  .string()
  .regex(isoDateRegex)
  .transform((date) => date as IsoDate);
