import { SortingButton } from "../../../SortingButton/SortingButton";
import { useSorting } from "../../../../hooks/useSorting";
import { useAppSelector } from "../../../../store";
import { getWorkouts } from "../../../../store/reducers/workout/workoutSelectors";

export const WorkoutSorting = () => {
    const { title, iconName, ref, mappedSorting } = useSorting({ type: "Workout" });
    const numberOfWorkouts = useAppSelector(getWorkouts).length;
    return <SortingButton hide={numberOfWorkouts <= 1} iconName={iconName} sheetRef={ref} title={title} mappedOptions={mappedSorting} />;
};
