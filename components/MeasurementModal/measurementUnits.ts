import { z } from "zod/lib/index";

export const measurementUnits = ["kg", "lb", "inch", "cm", "%"] as const;
export const MeasurementUnit = z.enum(measurementUnits);
export type MeasurementUnit = z.infer<typeof MeasurementUnit>;
