import { IsoDate } from "../../../types/date";
import { z } from "zod/lib";

export const measurementUnitGroupsDefinition = {
  length: ["cm", "inch"],
  weight: ["kg", "lb"],
  percentage: ["%"],
};

export const measurementUnits = ["kg", "lb", "inch", "cm", "%"] as const;
export const MeasurementUnit = z.enum(measurementUnits);
export type MeasurementUnit = z.infer<typeof MeasurementUnit>;
export const getMeasurementUnits = (unit?: MeasurementUnit) => {
  switch (unit) {
    case "%":
      return measurementUnitGroupsDefinition.percentage;
    case "cm":
    case "inch":
      return measurementUnitGroupsDefinition.length;
    case "kg":
    case "lb":
      return measurementUnitGroupsDefinition.weight;
    default:
      return measurementUnits;
  }
};

export type MeasurementDataPoints = { [date: IsoDate]: string };
export type Measurement = {
  name?: string;
  unit?: MeasurementUnit;
  data?: MeasurementDataPoints;
  higherIsBetter?: boolean;
  date?: Date;
  value?: string;
};
