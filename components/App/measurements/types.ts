import { IsoDate } from "../../../types/date";
import { z } from "zod/lib";

export const measurementTypes = ["weight", "growth", "percent"] as const;
export const MeasurementUnit = z.enum(measurementTypes);
export type MeasurementType = z.infer<typeof MeasurementUnit>;

export type MeasurementDataPoints = { [date: IsoDate]: string };
export type Measurement = {
    name: string;
    type?: MeasurementType;
    data: MeasurementDataPoints;
    higherIsBetter?: boolean;
    value?: string;
};
