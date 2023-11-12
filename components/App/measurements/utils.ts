import { MeasurementDataPoints, MeasurementUnit, measurementUnitGroupsDefinition } from "./types";

const KG_TO_POUND = 2.205;
const CM_TO_INCH = 2.54;
const convertKgToPound = (data: MeasurementDataPoints): MeasurementDataPoints => Object.fromEntries(Object.entries(data).map(([date, data]) => [date, (parseFloat(data) * KG_TO_POUND).toString()]));
const convertPoundToKg = (data: MeasurementDataPoints) => Object.fromEntries(Object.entries(data).map(([date, data]) => [date, (parseFloat(data) / KG_TO_POUND).toString()]));
const convertCmToInch = (data: MeasurementDataPoints) => Object.fromEntries(Object.entries(data).map(([date, data]) => [date, (parseFloat(data) / CM_TO_INCH).toString()]));
const convertInchToCm = (data: MeasurementDataPoints) => Object.fromEntries(Object.entries(data).map(([date, data]) => [date, (parseFloat(data) * CM_TO_INCH).toString()]));

const convertWeight = (previousUnit: MeasurementUnit, data: MeasurementDataPoints): MeasurementDataPoints => {
  switch (previousUnit) {
    case "kg":
      return convertKgToPound(data);
    case "lb":
      return convertPoundToKg(data);
    default:
      return data;
  }
};

const convertLength = (previousUnit: MeasurementUnit, data: MeasurementDataPoints): MeasurementDataPoints => {
  switch (previousUnit) {
    case "cm":
      return convertCmToInch(data);
    case "inch":
      return convertInchToCm(data);
    default:
      return data;
  }
};

export const convertMeasurements = (previousUnit: MeasurementUnit, data: MeasurementDataPoints): MeasurementDataPoints => {
  if (measurementUnitGroupsDefinition.length.includes(previousUnit)) {
    return convertLength(previousUnit, data);
  }
  if (measurementUnitGroupsDefinition.weight.includes(previousUnit)) {
    return convertWeight(previousUnit, data);
  }
  return data;
};
