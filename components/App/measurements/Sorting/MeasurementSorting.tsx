import { SortingButton } from "../../../SortingButton/SortingButton";
import { useSorting } from "../../../../hooks/useSorting";
import { useAppSelector } from "../../../../store";
import { getMeasurements } from "../../../../store/selectors/measurements/measurementSelectors";

export const MeasurementSorting = () => {
    const { iconName, title, mappedSorting } = useSorting({ type: "Measurement" });
    const numberOfMeasurements = useAppSelector(getMeasurements).length;

    return (
        <SortingButton
            hide={numberOfMeasurements <= 1}
            iconName={iconName}
            title={title}
            mappedOptions={mappedSorting}
        />
    );
};
