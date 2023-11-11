import { IsoDate } from "../../../types/date";
import { z } from "zod/lib";

export const measurementUnits = ["kg", "lb", "inch", "cm", "%"] as const;
export const MeasurementUnit = z.enum(measurementUnits);
export type MeasurementUnit = z.infer<typeof MeasurementUnit>;

export type Measurement = {
  name?: string;
  unit?: MeasurementUnit;
  data?: {
    [date: IsoDate]: string;
  };
  higherIsBetter?: boolean;
  date?: Date;
  value?: string;
};
