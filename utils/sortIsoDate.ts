import { Temporal } from "@js-temporal/polyfill";
import { MeasurementDataPoint } from "../components/App/measurements/types";

export const sortMeasurementDataPoints = (points: MeasurementDataPoint[]) => {
    return points.sort((a, b) => Temporal.PlainDate.compare(a?.isoDate ?? "1970-01-01", b?.isoDate ?? "1970-01-01")) as MeasurementDataPoint[];
};
