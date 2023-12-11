import { z } from "zod/lib";

export const measurementTypes = ["weight", "growth", "percent"] as const;
export const MeasurementUnit = z.enum(measurementTypes);
export type MeasurementType = z.infer<typeof MeasurementUnit>;

export type MeasurementDataPoint = { timestamp: number; value: string };
export type Measurement = {
    name: string;
    type?: MeasurementType;
    //for modal
    value?: string;
    data: MeasurementDataPoint[];
    higherIsBetter?: boolean;
};
