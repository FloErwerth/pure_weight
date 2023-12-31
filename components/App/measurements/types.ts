import { z } from "zod/lib";
import { IsoDate } from "../../../types/date";

export const measurementTypes = ["weight", "length", "percent"] as const;
export const MeasurementUnit = z.enum(measurementTypes);
export type MeasurementType = z.infer<typeof MeasurementUnit>;

export type MeasurementDataPoint = { isoDate: IsoDate; value: string };
export type Measurement = {
    name: string;
    type?: MeasurementType;
    //for modal
    value?: string;
    data: MeasurementDataPoint[];
    higherIsBetter?: boolean;
};
